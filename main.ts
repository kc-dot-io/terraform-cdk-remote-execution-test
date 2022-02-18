import { Construct } from "constructs";
import { App, TerraformStack, RemoteBackend, TerraformOutput, TerraformAsset } from "cdktf";
import * as NullProvider from "./.gen/providers/null";
import * as local from "./.gen/providers/local";
import { RandomProvider, Password } from "./.gen/providers/random";
import * as path from "path";

class SourceStack extends TerraformStack {
  public password: any;
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new NullProvider.NullProvider(this, "null", {});
    new RandomProvider(this, "random", {});
    new local.LocalProvider(this, "local", {});

    this.password = new Password(this, "password", {
      length: 32,
    });

    new local.File(this, "file", {
      filename: "../../../origin-file.txt",
      content: this.password.result,
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
      organization: 'kc-dot-io',
      workspaces: {
        name: 'workspaceA'
      }
    })
  }
}

class ConsumerStack extends TerraformStack {
  constructor(scope: Construct, name: string, password: Password) {
    super(scope, name);

    new local.LocalProvider(this, "local", {});

    new local.File(this, "file", {
      filename: "../../../consumer-file.txt",
      content: password.result,
    });

    new TerraformOutput(this, "password", {
      value: password
    })

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: 'kc-dot-io',
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
