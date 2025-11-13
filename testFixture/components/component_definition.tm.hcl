# Test fixture for component definition blocks
# This file tests syntax highlighting for define component metadata and inputs

define component metadata {
  class   = "terramate.io/terramate-tf-github-repository"
  version = "1.0.0"

  name         = "GitHub Repository"
  description  = "Manage a GitHub Repository"
  technologies = ["terraform", "opentofu"]
}

define component {
  input "name" {
    type        = string
    description = "The name of the repository."
  }

  input "import" {
    type        = bool
    description = <<-EOF
      Whether the repository resources shall be imported.
      The repository needs to exist in the GitHub organization.
    EOF
    default     = false
  }

  input "description" {
    type        = string
    description = "A description of the repository."
    default     = component.input.name.value
  }

  input "visibility" {
    type        = string
    description = "Can be public or private."
    default     = "private"
  }

  input "homepage_url" {
    type        = string
    description = "URL of a page describing the project."
    default     = null
  }

  input "has_issues" {
    type        = bool
    description = "Set to true to enable the GitHub Issues features on the repository."
    default     = false
  }

  input "has_discussions" {
    type        = bool
    description = "Set to true to enable GitHub Discussions on the repository."
    default     = false
  }

  input "has_projects" {
    type        = bool
    description = "Set to true to enable the GitHub Projects features on the repository."
    default     = false
  }

  input "has_wiki" {
    type        = bool
    description = "Set to true to enable the GitHub Wiki features on the repository."
    default     = false
  }

  input "is_template" {
    type        = bool
    description = "Set to true to tell GitHub that this is a template repository."
    default     = false
  }

  input "allow_merge_commit" {
    type        = bool
    description = "Set to false to disable merge commits on the repository."
    default     = true
  }

  input "allow_squash_merge" {
    type        = bool
    description = "Set to false to disable squash merges on the repository."
    default     = true
  }

  input "allow_rebase_merge" {
    type        = bool
    description = "Set to false to disable rebase merges on the repository."
    default     = true
  }

  input "allow_auto_merge" {
    type        = bool
    description = "Set to true to allow auto-merging pull requests on the repository."
    default     = false
  }

  input "squash_merge_commit_title" {
    type        = string
    description = <<-EOF
      Can be PR_TITLE or COMMIT_OR_PR_TITLE for a default squash merge commit title.
      Applicable only if allow_squash_merge is true.
    EOF
    default     = "COMMIT_OR_PR_TITLE"
  }

  input "squash_merge_commit_message" {
    type        = string
    description = <<-EOF
      Can be PR_BODY, COMMIT_MESSAGES, or BLANK for a default squash merge commit message.
      Applicable only if allow_squash_merge is true.
    EOF
    default     = "COMMIT_MESSAGES"
  }

  input "merge_commit_title" {
    type        = string
    description = <<-EOF
      Can be PR_TITLE or MERGE_MESSAGE for a default merge commit title.
      Applicable only if allow_merge_commit is true.
    EOF
    default     = "PR_TITLE"
  }

  input "merge_commit_message" {
    type        = string
    description = <<-EOF
      Can be PR_BODY, PR_TITLE, or BLANK for a default merge commit message.
      Applicable only if allow_merge_commit is true.
    EOF
    default     = "PR_BODY"
  }

  input "delete_branch_on_merge" {
    type        = bool
    description = "Automatically delete head branch after a pull request is merged."
    default     = true
  }

  input "web_commit_signoff_required" {
    type        = bool
    description = "Require contributors to sign off on web-based commits."
    default     = false
  }

  input "auto_init" {
    type        = bool
    description = "Set to true to produce an initial commit in the repository."
    default     = false
  }

  input "gitignore_template" {
    type        = string
    description = "Use the name of the template without the extension."
    default     = null
  }

  input "license_template" {
    type        = string
    description = "Use the name of the template without the extension."
    default     = null
  }

  input "default_branch" {
    type        = string
    description = "The name of the default branch of the repository."
    default     = "main"
  }

  input "archived" {
    type        = bool
    description = "Specifies if the repository should be archived."
    default     = false
  }

  input "archive_on_destroy" {
    type        = bool
    description = "Set to false to not archive the repository instead of deleting on destroy."
    default     = true
  }

  input "vulnerability_alerts" {
    type        = bool
    description = <<-EOF
      Set to true to enable security alerts for vulnerable dependencies.
      Enabling requires alerts to be enabled on the owner level.
    EOF
    default     = component.input.visibility.value == "public"
  }

  input "ignore_vulnerability_alerts_during_read" {
    type        = bool
    description = "Set to true to not call the vulnerability alerts endpoint so the resource can also be used without admin permissions during read."
    default     = false
  }

  input "allow_update_branch" {
    type        = bool
    description = "Set to false to disable always suggesting updating pull request branches."
    default     = true
  }
}

