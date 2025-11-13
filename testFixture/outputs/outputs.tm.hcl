# Test fixture for open-source terramate blocks: output
# This file tests syntax highlighting for output blocks

output "instance_id" {
  value       = global.instance_id
  description = "The EC2 instance ID"
}

output "vpc_id" {
  value       = global.vpc.id
  description = "The VPC ID"
  sensitive   = false
}

output "database_endpoint" {
  value       = global.rds.endpoint
  description = "The RDS database endpoint"
  sensitive   = true
}

