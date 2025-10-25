# Test fixture for bundle inputs and exports
# This file tests syntax highlighting for input and export blocks

define bundle {
  # String input with all optional fields
  input "name" {
    type                  = string
    prompt                = "Enter your name"
    description           = "The user's name"
    required_for_scaffold = true
  }

  # Number input with default
  input "count" {
    type        = number
    description = "Number of resources"
    default     = 5
  }

  # List input with default
  input "tags" {
    type    = list(string)
    default = ["dev", "test"]
  }

  # Map input with default
  input "config" {
    type = map(string)
    default = {
      env = "dev"
      region = "us-east-1"
    }
  }

  # Boolean input
  input "enabled" {
    type    = bool
    default = true
  }

  # Simple export
  export "computed_name" {
    value = bundle.input.name.value
  }

  # Complex export with expression
  export "all_tags" {
    value = concat(
      bundle.input.tags.value,
      ["managed-by-terramate"]
    )
  }

  # Export with map transformation
  export "transformed_config" {
    value = { for k, v in bundle.input.config.value : k => upper(v) }
  }
}


