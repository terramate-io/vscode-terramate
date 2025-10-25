# Test fixture for open-source terramate blocks: script
# This file tests syntax highlighting for script blocks

script "deploy" "production" {
  name        = "Deploy to Production"
  description = "Deploys the application to production"
  
  job {
    name    = "terraform-apply"
    command = ["terraform", "apply", "-auto-approve"]
  }
  
  job {
    name     = "post-deploy"
    commands = [
      "echo 'Deployment complete'",
      "notify-slack.sh",
    ]
  }
}

script "test" {
  description = "Run tests"
  
  job {
    command = ["go", "test", "./..."]
  }
  
  lets {
    test_env = "development"
  }
}

