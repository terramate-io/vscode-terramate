# Test fixture for terramate configuration blocks
# This tests terramate.config and its sub-blocks

terramate {
  required_version = ">= 0.4.0"
  required_version_allow_prereleases = false
  
  config {
    # Git configuration
    git {
      default_branch    = "main"
      default_remote    = "origin"
      check_untracked   = false
      check_uncommitted = false
      check_remote      = true
    }
    
    # Cloud configuration
    cloud {
      organization = "my-organization"
      
      targets {
        enabled = ["production", "staging", "development"]
        default = "production"
      }
    }
    
    # Run configuration
    run {
      env {
        TF_PLUGIN_CACHE_DIR        = "/tmp/terraform-plugin-cache"
        TF_LOG                     = "INFO"
        AWS_SDK_LOAD_CONFIG        = "1"
        TERRAMATE_CLOUD_SYNC_DRIFT = "true"
      }
      
      check_gen_code = true
    }
    
    # Experimental features
    experiments = ["scripts", "tmgen"]
  }
}

# Minimal terramate block
terramate {
  required_version = ">= 0.3.0"
}

# Terramate with only config
terramate {
  config {
    git {
      default_branch = "develop"
    }
  }
}

