# Test fixture for generate_hcl blocks
# This tests Terramate's core code generation feature

globals {
  environment = "production"
  region      = "us-east-1"
}

# Generate Terraform backend configuration
generate_hcl "backend.tf" {
  content {
    terraform {
      backend "s3" {
        bucket = "terraform-state-${global.environment}"
        key    = "${terramate.path}/terraform.tfstate"
        region = global.region
      }
    }
  }
}

# Generate provider configuration
generate_hcl "provider.tf" {
  content {
    provider "aws" {
      region = global.region
      
      default_tags {
        tags = {
          Environment = global.environment
          ManagedBy   = "Terramate"
          Stack       = terramate.stack.name
        }
      }
    }
  }
}

# Generate with condition
generate_hcl "monitoring.tf" {
  condition = global.environment == "production"
  
  content {
    resource "aws_cloudwatch_alarm" "high_cpu" {
      alarm_name          = "${terramate.stack.name}-high-cpu"
      comparison_operator = "GreaterThanThreshold"
      evaluation_periods  = 2
      metric_name         = "CPUUtilization"
      threshold           = 80
    }
  }
}

# Generate with lets
generate_hcl "outputs.tf" {
  lets {
    output_prefix = "${global.environment}-${global.region}"
  }
  
  content {
    output "vpc_id" {
      value       = aws_vpc.main.id
      description = "VPC ID for ${let.output_prefix}"
    }
  }
}

