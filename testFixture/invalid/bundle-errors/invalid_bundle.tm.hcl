# Test fixture for invalid bundle syntax
# This should produce diagnostics from terramate-pro

# Invalid: define bundle with no content
define bundle {
  # Missing required metadata or content
}

# Invalid: Misspelled keyword
defin bundle {
  input "test" {
    type = string
  }
}

# Invalid: Unknown attribute in bundle metadata
define bundle metadata {
  class   = "test.class"
  version = "1.0.0"
  unknown_attribute = "this should error"
}

# Invalid: Input without type
define bundle {
  input "missing_type" {
    description = "This input is missing the required type attribute"
  }
}

