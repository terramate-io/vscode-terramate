# Test fixture for bundle stack and component blocks
# This file tests syntax highlighting for stack definitions and components

define bundle stack "repository" {
  metadata {
    path = tm_slug(bundle.input.name.value)

    name        = "GitHub Repository ${bundle.input.name.value}"
    description = bundle.input.description.value
    tags = [
      "terramate.io/github-repository",
    ]
    after = [
      "tag:terramate.io/github-organization",
      "tag:terramate.io/github-team",
    ]
    before = [
      "tag:terramate.io/github-webhook",
    ]
    wants = [
      "/stacks/networking",
    ]
    wanted_by = [
      "/stacks/frontend",
    ]
    watch = [
      "/shared/config",
    ]
  }

  component "repository" {
    source = "/components/terramate.io/terramate-tf-github-repository/v1"

    inputs = { for k in tm_keys(bundle.input) : k => bundle.input[k].value }

    inputs {
      # Additional input overrides can go here
    }
  }

  component "webhooks" {
    source = "/components/terramate.io/github-webhooks/v1"

    inputs {
      repository_name = bundle.input.name.value
      webhook_url     = bundle.input.webhook_url.value
    }
  }
}

# Multiple stacks in one bundle
define bundle stack "database" {
  metadata {
    path        = "/stacks/db-${tm_slug(bundle.input.environment.value)}"
    name        = "Database for ${bundle.input.environment.value}"
    description = "PostgreSQL database stack"
    tags        = ["database", "postgresql"]
  }

  component "rds" {
    source = "/components/aws-rds/v2"
    
    inputs {
      instance_class = "db.t3.micro"
      engine         = "postgres"
      engine_version = "15.4"
    }
  }
}

define bundle stack "cache" {
  metadata {
    path = "/stacks/cache-${tm_slug(bundle.input.environment.value)}"
    name = "Redis Cache"
  }

  component "elasticache" {
    source = "/components/aws-elasticache/v1"
  }
}

