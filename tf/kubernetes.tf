#
# Initialise Environment
#
resource "helm_release" "traefik" {
  name             = "traefik"
  namespace        = "traefik"
  create_namespace = true
  repository       = "https://helm.traefik.io/traefik"
  chart            = "traefik"
  version          = var.k8s_helm_traefik_version

  values = [
    "${file("./assets/helm/traefik.yaml")}"
  ]
}

resource "helm_release" "cert-manager" {
  name             = "cert-manager"
  namespace        = "cert-manager"
  create_namespace = true
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = var.k8s_helm_cert-manager_version

  set {
    name  = "installCRDs"
    value = "true"
  }
}

# Docker Authentication Secret
resource "kubernetes_secret_v1" "docker_registry" {
  type = "kubernetes.io/dockerconfigjson"

  metadata {
    name = "ghcr-drinkataco"
  }

  data = {
    ".dockerconfigjson" = jsonencode({
      auths : {
        "${var.k8s_docker_registry.server}" : {
          "username" : "${var.k8s_docker_registry.username}",
          "password" : "${var.k8s_docker_registry.password}"
        }
      }
    })
  }
}

# .env Secret
data "dotenv" "dev_config" {
  filename = var.k8s_secret_env_file
}

resource "kubernetes_secret_v1" "environment_variables" {
  type = "Opaque"

  metadata {
    name = "app-env"
  }

  data = merge(
    data.dotenv.dev_config.env,
    {
      REDIS_URL = var.elasticache_enable ?  "redis://${aws_elasticache_cluster.main[0].cache_nodes[0].address}:${var.elasticache_cluster_port}" : null
    }
  )
}

#
# Deploy Kubernetes
#
resource "null_resource" "create_tmp_dir" {
  provisioner "local-exec" {
    command = "mkdir -p ${local.tmp_dir}"
  }
}
resource "local_file" "kubeconfig" {
  depends_on = [
    resource.helm_release.traefik,
    resource.helm_release.cert-manager,
    resource.kubernetes_secret_v1.docker_registry,
    resource.kubernetes_secret_v1.environment_variables,
    resource.null_resource.create_tmp_dir
  ]

  content  = local.kubeconfig
  filename = local.kubeconfig_generated_file
}

data "template_file" "kustomization" {
  template = file("${path.module}/assets/kustomization.tpl")
  vars = {
    resource_location   = "./k8s"
    kustomization_patch = "./k8s/patches/${var.k8s_kustomization_patch}.yaml"
  }
}

resource "null_resource" "create_manifests" {
  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [resource.local_file.kubeconfig]

  provisioner "local-exec" {
    command = <<KUBE
      # create kustomize
      mkdir -p "${local.kustomization_generated_dir}"
      cp -r "${local.k8s_dir}" "${local.kustomization_generated_dir}"
      echo "${data.template_file.kustomization.rendered}" > "${local.kustomization_generated_dir}/kustomization.yaml"

      # apply files
      kubectl --kubeconfig "${local.kubeconfig_generated_file}" apply -k "${local.kustomization_generated_dir}"
    KUBE
  }
}
