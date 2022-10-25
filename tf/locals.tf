resource "random_string" "suffix" {
  length  = 8
  special = false
}

locals {
  deployment_id    = random_string.suffix.result
  eks_cluster_name = "${var.env_name}-eks-${local.deployment_id}"
}
