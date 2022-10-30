resource "aws_security_group" "eks" {
  name = "${var.env_name}-eks-sg"

  vpc_id = aws_vpc.main.id

  #
  # Egress to Mongo DB
  #
  egress {
    description      = "Mongo DB"
    from_port        = 27017
    to_port          = 27020
    protocol         = "tcp"
    ipv6_cidr_blocks = [var.mongodb_cidr_ipv6]
  }

  tags = var.aws_resource_tags
}
