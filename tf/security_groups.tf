resource "aws_security_group" "eks" {
  name        = "${var.env_name}-eks-sg"
  description = "Custom EKS SG"

  vpc_id = aws_vpc.main.id

  #
  # Self
  #
  ingress {
    description = "Self"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  #
  # Egress
  #
  # We need to be able to connect to:
  #  - MongoDB Atlas (External)
  #  - Google Maps API (External)
  #  - Elasticache (AWS)
  #
  egress {
    description = "Allow All"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.aws_resource_tags
}

resource "aws_security_group" "elasticache" {
  count = var.elasticache_enable ? 1 : 0

  name        = "${var.env_name}-elasticache-sg"
  description = "Elasticache SG"

  vpc_id = aws_vpc.main.id

  #
  # Allow access from EKS
  #
  ingress {
    description     = "EKS Access"
    from_port       = var.elasticache_cluster_port
    to_port         = var.elasticache_cluster_port
    protocol        = "tcp"
    security_groups = [resource.aws_security_group.eks.id]
  }

  tags = var.aws_resource_tags
}
