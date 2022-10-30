resource "aws_security_group" "eks" {
  name = "${var.env_name}-eks-sg"

  vpc_id = aws_vpc.main.id

  #
  # HTTP(S)
  #
  ingress {
    description      = "HTTPS"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description      = "HTTP"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

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
