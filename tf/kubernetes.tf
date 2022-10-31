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

  data = data.dotenv.dev_config.env
}

# Deploy Kubernetes
resource "null_resource" "k8s_apply" {
  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [
    resource.helm_release.traefik,
    resource.helm_release.cert-manager,
    resource.kubernetes_secret_v1.docker_registry,
    resource.kubernetes_secret_v1.environment_variables
  ]

  # provisioner "local-exec" {
    # command = <<EOT
      # dir=/Users/joshwalwyn/projects/mine/location-events-api/k8s

    # EOT
  # }
}
