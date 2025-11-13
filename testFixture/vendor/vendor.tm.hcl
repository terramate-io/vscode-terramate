# Test fixture for open-source terramate blocks: vendor, sharing_backend
# This file tests syntax highlighting for vendor and sharing_backend blocks

vendor {
  dir = "/vendor"
  
  manifest {
    default {
      ref = "v1.0.0"
    }
  }
}

sharing_backend {
  type = "local"
}

sharing_backend {
  type = "s3"
  
  config {
    bucket = "my-terraform-state"
    region = "us-east-1"
  }
}

