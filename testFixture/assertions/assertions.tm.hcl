# Test fixture for open-source terramate blocks: assert
# This file tests syntax highlighting for assertion blocks

assert {
  assertion = tm_can_access("/secure/path")
  message   = "Cannot access secure path"
}

assert {
  assertion = global.environment == "production"
  message   = "This configuration is only valid in production"
}

assert {
  assertion = tm_length(global.required_tags) > 0
  message   = "At least one tag is required"
}

