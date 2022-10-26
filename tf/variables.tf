#
# AWS variables
#
variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "aws_resource_tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default = {
    Terraform = "true"
  }
}

#
# Environment variables
#
variable "env_name" {
  description = "Namespace used to prefix all resources"
  type        = string
  default     = "ecoapi"
}

#
# VPC
#
variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

variable "vpc_public_subnet_cidrs" {
  type        = list(string)
  description = "Public Subnet CIDR blocks"
  default     = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

variable "vpc_private_subnet_cidrs" {
  type        = list(string)
  description = "Private Subnet CIDR blocks"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}
