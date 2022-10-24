#
# EKS SGs
#
resource "aws_security_group" "eks" {
  name = "${var.env_name}-eks-sg"

  vpc_id = module.vpc.vpc_id

  ingress {
    # TODO: remove me
    description = "All (for now)"
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}
