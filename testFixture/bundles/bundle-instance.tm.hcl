# Example bundle instance in HCL format
# This file tests syntax highlighting and autocomplete for bundle instantiation blocks

bundle "test-bundle-instance" {
  source = "/bundles/example.com/test-bundle/v1"
  uuid   = "79a83f2e-dbc0-429e-80e0-d0c395f0f605"
  
  inputs {
    env      = "dev"
    name     = "test-instance"
    vpc_cidr = "10.0.0.0/16"
    tags     = {}
  }
}
