import { Construct } from "constructs";
import { App, TerraformStack, RemoteBackend, TerraformOutput } from "cdktf";

class SourceStack extends TerraformStack {
  public password: any;
  constructor(scope: Construct, name: string) {
    super(scope, name);

    this.password = 'THIS IS THE VALUE'

    new TerraformOutput(app, "output", {
      value: "constant value",
    });

    new RemoteBackend(app, {
      hostname: 'app.terraform.io',
      organization: 'kc-dot-io',
      workspaces: {
        name: 'workspaceA'
      }
    })
  }
}

class ConsumerStack extends TerraformStack {
  constructor(scope: Construct, name: string, password: any) {
    super(scope, name);

    new TerraformOutput(app, "password", {
      value: password
    })

    new RemoteBackend(app, {
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
