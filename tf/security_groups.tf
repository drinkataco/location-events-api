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
