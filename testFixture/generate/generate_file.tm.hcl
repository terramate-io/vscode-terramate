# Test fixture for generate_file blocks
# This tests file generation feature

# Generate simple text file
generate_file ".terraform-version" {
  content = "1.5.0"
}

# Generate with template
generate_file "README.md" {
  content = <<-EOF
    # ${terramate.stack.name}
    
    ${terramate.stack.description}
    
    ## Stack Information
    - Environment: ${global.environment}
    - Region: ${global.region}
    - Path: ${terramate.path}
  EOF
}

# Generate JSON file
generate_file "stack.json" {
  content = tm_jsonencode({
    name        = terramate.stack.name
    description = terramate.stack.description
    path        = terramate.path
    tags        = terramate.stack.tags
  })
}

# Generate with condition
generate_file ".envrc" {
  condition = tm_fileexists("${terramate.root.path.fs.absolute}/.envrc.template")
  
  content = tm_templatefile(
    "${terramate.root.path.fs.absolute}/.envrc.template",
    {
      environment = global.environment
      region      = global.region
    }
  )
}

# Generate YAML file
generate_file "config.yaml" {
  content = tm_yamlencode({
    environment = global.environment
    region      = global.region
    vpc_cidr    = global.vpc_cidr
    tags        = global.tags
  })
}

