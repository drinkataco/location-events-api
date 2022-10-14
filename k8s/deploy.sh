#!/usr/bin/env bash
K8S_DIR=$(cd -- "$(dirname -- "$(readlink "$0" || echo "$0")")" && pwd) # get root directory

# Script Helpers
declare -r K8S_DIR
declare MISSING_SECRET=0
declare -r RED="\033[0;31m" # ansi colour code sequence for green text
declare -r GREEN="\033[0;32m" # ansi colour code sequence for green text
declare -r BLUE="\033[0;34m" # ansi colour code sequence for blue text
declare -r NC="\033[0m" # ansi colour code sequence for no colour text

# Package Config
declare -r K_NAMESPACE_CERT_MANAGER='cert-manager'
declare -r K_HELM_V_CERT_MANAGER='v1.9.1'
declare -r K_NAMESPACE_TRAEFIK='traefik'
declare -r K_HELM_V_TRAEFIK='v15.1.0'

#########################################
# Install Cert Manager from Helm Chart
# Arguments:
#   1 - version of cert-manager
#   2 - namespace of resources
#######################################
function install_cert_manager() {
  local version="$1"
  local namespace="${2:-'cert-manager'}"

  echo -e "${BLUE}Adding Cert Manager${NC}"

  helm repo add jetstack https://charts.jetstack.io
  helm repo update jetstack

  if [[ -z $(helm list --short --namespace "${namespace}") ]]; then
    echo "Installing cert-manager@${version}..."

    helm install \
      cert-manager jetstack/cert-manager \
      --namespace "${namespace}" \
      --create-namespace \
      --version "${version}" \
      --set installCRDs=true
  else
    echo 'helm chart cert-manager already installed'
  fi
}

#########################################
# Install Traefik from Helm Chart
# Arguments:
#   1 - version of cert-manager
#   2 - namespace of resources
#######################################
function install_traefik {
  local version="$1"
  local namespace="${2:-'traefik'}"

  echo -e "${BLUE}Adding Traefik${NC}"

  helm repo add traefik https://helm.traefik.io/traefik
  helm repo update traefik

  if [[ -z $(helm list --short --namespace "${namespace}") ]]; then
    echo "Installing traefik@${version}..."

    helm install \
      traefik traefik/traefik \
      --namespace "${namespace}" \
      --create-namespace \
      --version "${version}"
  else
    echo 'helm chart traefik already installed'
  fi
}

#########################################
# Check required secret resource exists
# Globals:
#  MISSING_SECRET - A flag so all missing secrets can be reported on before circuit breaks
# Arguments:
#   1 - name of secret to set
#   2 - if set, throws a non-zero if secret is missing
#######################################
function check_k8s_secret {
  local secret_name="$1"
  local throw="$2"

  if ! kubectl describe secrets "${secret_name}" &> /dev/null; then
    echo -e "${RED}Secret '${secret_name}' doesn't exist!${NC}" >&2

    if [[ -z "${throw}" ]]; then
      MISSING_SECRET=1
    else
      return 1
    fi
  else
    echo -e "${BLUE}Found secret '${secret_name}'${NC}"
  fi
}

#########################################
# Create Secret for dotenv file
# Arguments:
#   1 - name of secret to set
#   2 - directory of dotenv file to use
#######################################
function create_k8s_env_file_secret {
  local secret_name="$1"
  local env_file="$2"

  if check_k8s_secret "${secret_name}" 1 &> /dev/null; then
    echo -e "${BLUE}Deleting pre-existing secret for '${secret_name}'${NC}"
    kubectl delete secret "${secret_name}"
  fi

  echo -e "${BLUE}Creating Secret for '${secret_name}'${NC}"
  kubectl create secret generic "${secret_name}" \
    --from-env-file="${env_file}"
}

#########################################
# Main function to run deployment
#######################################
function main {
  local env_file

  echo -e "${GREEN}Deploying Kubernetes Resources${NC}"

  # First we'll check if there's an argument supplied to create the .env file secret
  while getopts f:t: opts; do
    case "${opts}" in
      f) env_file="${OPTARG}" ;;
      *) continue ;;
    esac
  done

  if [[ -n "${env_file}" ]]; then
    echo -e "${GREEN}Create Application dotenv file secret${NC}"
    create_k8s_env_file_secret 'app-env' "${env_file}"
  fi

  # Install dependencies via helm
  echo -e "\n${GREEN}Checking Dependencies${NC}"
  install_cert_manager "${K_HELM_V_CERT_MANAGER}" "${K_NAMESPACE_CERT_MANAGER}"
  install_traefik "${K_HELM_V_TRAEFIK}" "${K_NAMESPACE_TRAEFIK}"

  # Check required secrets exist
  echo -e "\n${GREEN}Checking Secrets${NC}"
  check_k8s_secret 'ghcr-drinkataco'
  check_k8s_secret 'app-env'

  if [[ "${MISSING_SECRET}" == 1 ]]; then
    echo -e "${RED}Please consult the README to create the required secrets before rerunning!${NC}" >&2
    exit 1
  fi

  # Apply Kubes
  echo -e "\n${GREEN}Applying Kubernetes Resources${NC}"
  kubectl apply -k "${K8S_DIR}"
}

main "$@"
