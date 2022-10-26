module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "18.30.2"

  cluster_name    = local.eks_cluster_name
  cluster_version = "1.23"

  vpc_id     = aws_vpc.main.id
  subnet_ids = [for s in aws_subnet.private : s.id]

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"

    # attach_cluster_primary_security_group = true
    # create_security_group                 = false
  }

  eks_managed_node_groups = {
    main = {
      name = "${var.env_name}-main"

      instance_types = ["t3.medium"]

      min_size     = 1
      max_size     = 3
      desired_size = 2

      # vpc_security_group_ids = [
        # aws_security_group.eks.id
      # ]
    }
  }

  tags = var.aws_resource_tags
}
