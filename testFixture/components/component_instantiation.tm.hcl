# Test fixture for component instantiation blocks
# This file tests syntax highlighting for component usage in stacks

# Standalone component instantiation
component "my-repository" {
  source = "/components/terramate.io/terramate-tf-github-repository/v1"

  inputs = {
    name        = "my-awesome-repo"
    description = "An awesome repository"
    visibility  = "public"
  }
}

# Component with nested inputs block
component "database" {
  source = "/components/aws-rds/v2"

  inputs {
    instance_class = "db.t3.micro"
    engine         = "postgres"
    engine_version = "15.4"
  }
}

# Component with both inputs attribute and block
component "app-server" {
  source = "/components/ec2-instance/v1"

  inputs = {
    instance_type = "t3.medium"
  }

  inputs {
    ami_id            = "ami-12345678"
    availability_zone = "us-east-1a"
  }
}

# Component with expression in inputs
component "network" {
  source = "/components/vpc/v1"

  inputs = { for k in tm_keys(global.network_config) : k => global.network_config[k] }
}

# Component "name" "inputs" block pattern
component "cache" "inputs" {
  redis_version = "7.0"
  node_type     = "cache.t3.micro"
}

