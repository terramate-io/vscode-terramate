# Test fixture for globals blocks
# This tests Terramate's global variable system

# Simple globals
globals {
  environment = "production"
  region      = "us-east-1"
  project     = "myapp"
}

# Globals with complex values
globals {
  vpc_config = {
    cidr_block           = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support   = true
  }
  
  tags = {
    Environment = global.environment
    Project     = global.project
    ManagedBy   = "Terramate"
  }
}

# Labeled globals (namespaced)
globals "database" {
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  allocated_storage = 20
}

globals "monitoring" {
  enabled         = true
  retention_days  = 30
  alarm_email     = "devops@example.com"
}

# Globals with lets (variable binding)
globals {
  lets {
    base_name   = "myapp"
    full_prefix = "${let.base_name}-${global.environment}-${global.region}"
  }
  
  resource_prefix = let.full_prefix
  bucket_name     = "${let.full_prefix}-terraform-state"
}

# Globals with conditionals
globals {
  is_production = global.environment == "production"
  instance_type = global.is_production ? "t3.large" : "t3.micro"
  
  replicas = global.is_production ? 3 : 1
}

# Globals with functions
globals {
  timestamp     = tm_formatdate("YYYY-MM-DD", tm_timestamp())
  stack_slug    = tm_slug(terramate.stack.name)
  region_short  = tm_substr(global.region, 0, 6)
  
  all_tags = tm_merge(
    global.tags,
    {
      CreatedAt = global.timestamp
      StackSlug = global.stack_slug
    }
  )
}

# Globals with lists and maps
globals {
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
  
  subnet_config = {
    for az in global.availability_zones :
    az => {
      cidr = "10.0.${index(global.availability_zones, az)}.0/24"
      az   = az
    }
  }
}


