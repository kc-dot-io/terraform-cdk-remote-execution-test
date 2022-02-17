import { Construct } from "constructs";
import { App, TerraformStack, RemoteBackend } from "cdktf";

class WorkspaceA extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new RemoteBackend(this, {
      hostname: 'app.terraform.io',
      organization: 'kc-dot-io',
      workspaces: {
        name: 'workspaceA'
      }
    })
  }
}

class WorkspaceB extends TerraformStack {
  constructor(scope: Construct, name: string, workspace: any) {
    super(scope, name);

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
const a = new WorkspaceA(app, "workspaceA");
new WorkspaceB(app, "workspaceB", a);
app.synth();
