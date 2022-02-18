### overview

This repo only exists to try to solve [this issue](https://github.com/hashicorp/terraform-cdk/issues/1534)

To replicate the issue create `workspaceA` and `workspaceB` in Terraform Cloud. 

`workspaceB` MUST be set to remote execution mod, `workspaceA` can be either.

Make sure you've set up the cdktf cli for [local development](https://github.com/hashicorp/terraform-cdk/blob/main/CONTRIBUTING.md#outside-of-this-monorepo)

Run it like this `TFC_ORG=my-org cdktf deploy`


