import { Construct } from "constructs";
import { App, TerraformStack, RemoteBackend, TerraformOutput, TerraformAsset } from "cdktf";
import * as NullProvider from "./.gen/providers/null";
import { RandomProvider, Password } from "./.gen/providers/random";
import * as path from "path";

class SourceStack extends TerraformStack {
  public password: any;
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new NullProvider.NullProvider(this, "null", {});
    new RandomProvider(this, "random", {});

    this.password = new Password(this, "password", {
      length: 32,
    });


    const nullResouce = new NullProvider.Resource(this, "test", {});

    nullResouce.addOverride("provisioner", [
      {
        "local-exec": {
          command: `echo "hello deploy"`,
        },
      },
    ]);

    new TerraformOutput(this, "output", {
      value: "constant value",
    });

    const asset = new TerraformAsset(this, "asset-a", {
      path: path.resolve(__dirname, "fixtures/a.txt"),
    });

    new TerraformOutput(this, "isAssetPresent", {
      value: `\${fileexists("\${path.module}/${asset.path}") ? "yes" : "no"}`,
    });

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: process.env.TFC_ORG || 'kc-dot-io',
      workspaces: {
        name: 'workspaceA'
      }
    })
  }
}

class ConsumerStack extends TerraformStack {
  constructor(scope: Construct, name: string, password: Password) {
    super(scope, name);

    new TerraformOutput(this, "password", {
      value: password
    })

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: process.env.TFC_ORG || 'kc-dot-io',
      workspaces: {
        name: 'workspaceB'
      }
    })

  }
}

const app = new App();
const a = new SourceStack(app, "workspaceA");
new ConsumerStack(app, "workspaceB", a.password);
app.synth();
