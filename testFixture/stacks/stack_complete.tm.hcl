# Test fixture for complete stack definition
# This tests stack blocks with inputs, outputs, and metadata

stack {
  name        = "production-vpc"
  description = "VPC infrastructure for production environment"
  tags        = ["networking", "production", "core"]
  id          = "550e8400-e29b-41d4-a716-446655440000"
  
  # Stack ordering
  after      = ["/stacks/base"]
  before     = ["/stacks/production/eks", "/stacks/production/rds"]
  wants      = ["/stacks/iam"]
  wanted_by  = ["/stacks/production/app"]
  
  # Watch paths for change detection
  watch = [
    "/modules/vpc/**/*.tf",
    "/global/network-config.tm"
  ]
}

# Stack inputs (parameters for the stack)
input "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

input "enable_nat_gateway" {
  type        = bool
  description = "Enable NAT gateway for private subnets"
  default     = true
}

input "availability_zones" {
  type        = list(string)
  description = "List of availability zones to use"
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

input "subnet_config" {
  type = map(object({
    cidr   = string
    public = bool
  }))
  description = "Configuration for subnets"
  default = {
    public = {
      cidr   = "10.0.1.0/24"
      public = true
    }
    private = {
      cidr   = "10.0.2.0/24"
      public = false
    }
  }
}

# Stack outputs (values exposed to other stacks)
output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The ID of the VPC"
  sensitive   = false
}

output "private_subnet_ids" {
  value       = aws_subnet.private[*].id
  description = "IDs of private subnets"
}

output "vpc_cidr_block" {
  value       = aws_vpc.main.cidr_block
  description = "CIDR block of the VPC"
}

output "nat_gateway_ips" {
  value       = aws_eip.nat[*].public_ip
  description = "Public IPs of NAT gateways"
  sensitive   = false
}


