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
# Deployment variables
#
variable "env_name" {
  description = "Namespace used to prefix all resources"
  type        = string
  default     = "eloapi"
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

#
# Kubernetes (EKS)
#
variable "k8s_helm_traefik_version" {
  type        = string
  description = "Version of Traefik Helm Chart"
  default     = "v15.1.0"
}

variable "k8s_helm_cert-manager_version" {
  type        = string
  description = "Version of Cert Manager Helm Chart"
  default     = "v1.10.0"
}

variable "k8s_secret_env_file" {
  type        = string
  description = "Location of .env file to use"
}

variable "k8s_docker_registry" {
  type = object({
    server   = string
    username = string
    password = string
  })
  description = "ghcr.io credentials"
}

variable "k8s_kustomization_patch" {
  type        = string
  description = "Location of kustomization patch"
  default     = "local"
}
