resource "aws_elasticache_subnet_group" "main" {
  # count = var.elasticache_enable ? 1 : 0

  name       = "${var.env_name}-cache-subnet"
  subnet_ids = [for s in aws_subnet.private : s.id]
}

resource "aws_elasticache_cluster" "main" {
  count = var.elasticache_enable ? 1 : 0

  cluster_id = var.env_name

  engine          = "redis"
  node_type       = var.elasticache_node_type
  num_cache_nodes = 1

  parameter_group_name = "default.redis6.x"
  engine_version       = "6.2"

  port               = var.elasticache_cluster_port
  subnet_group_name  = resource.aws_elasticache_subnet_group.main.name
  security_group_ids = [resource.aws_security_group.eks.id]

  tags = var.aws_resource_tags
}
