module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "18.30.2"

  cluster_name = "lea-cluster"
  cluster_version = "1.23"

  vpc_id = aws_vpc.main.id
  subnet_ids = [for s in aws_subnet.private : s.id]

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"

    attach_cluster_primary_security_group = true

    # Disabling and using externally provided security groups
    # create_security_group = false
  }

  eks_managed_node_groups = {
    one = {
      name = "node-group-1"

      instance_types = ["t3.small"]

      min_size = 1
      max_size = 3
      desired_size = 2

      pre_bootstrap_user_data = <<-EOT
      echo 'foo bar'
      EOT

      # vpc_security_group_ids = [
        # aws_security_group.eks.id
      # ]
    }
  }
}
