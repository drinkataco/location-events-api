# Template version of ../../k8s/kustomization.yaml
apiVersion: 'kustomize.config.k8s.io/v1beta1'
kind: 'Kustomization'

resources:
  - '${resource_location}/certificates.yaml'
  - '${resource_location}/deployment.yaml'
  - '${resource_location}/ingress.yaml'
  - '${resource_location}/traefik.middleware.yaml'

patchesStrategicMerge:
  - '${kustomization_patch}'
