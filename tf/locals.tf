locals {
  tmp_dir = "${path.module}/.terraform/.tmp"
  # Location of generated kubeconfig
  kubeconfig_generated_file = "${local.tmp_dir}/${var.env_name}-kubeconfig"
  # Location of generated kustomization directory
  kustomization_generated_dir = "${local.tmp_dir}/${var.env_name}"
  # location of k8s
  k8s_dir = "${path.module}/../k8s"
  # Generated kubeconfig
  kubeconfig = yamlencode({
    apiVersion      = "v1"
    kind            = "Config"
    current-context = "terraform"
    clusters = [{
      name = module.eks.cluster_id
      cluster = {
        certificate-authority-data = module.eks.cluster_certificate_authority_data
        server                     = module.eks.cluster_endpoint
      }
    }]
    contexts = [{
      name = "terraform"
      context = {
        cluster = module.eks.cluster_id
        user    = "terraform"
      }
    }]
    users = [{
      name = "terraform"
      user = {
        token = data.aws_eks_cluster_auth.cluster-auth.token
      }
    }]
  })
}
