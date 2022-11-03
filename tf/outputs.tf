output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "eks_cluster_id" {
  description = "EKS cluster ID"
  value       = module.eks.cluster_id
}

output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_security_group_id" {
  description = "Security group ids attached to the cluster control plane"
  value       = module.eks.cluster_security_group_id
}

output "elasticache_primary_node_address" {
  description = "Primary DNS address of elasticache node"
  value       = var.elasticache_enable ? aws_elasticache_cluster.main[0].cache_nodes[0].address : null
}

output "elasticache_cluster_port" {
  description = "Primary DNS address of elasticache node"
  value       = var.elasticache_cluster_port
}
