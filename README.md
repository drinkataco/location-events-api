# location-events-api

![Application](https://github.com/drinkataco/location-events-api/actions/workflows/application.yaml/badge.svg)
![Infrastructure](https://github.com/drinkataco/location-events-api/actions/workflows/infrastructure.yaml/badge.svg)

GraphQL based API that has the abilities to Create, Read, Update, & Delete Locations & Events. Query and find all the locations & events belonging to an organisation, as well as the reverse: being able to query a location(s) / event(s) and having the ability to find the organisation it belongs to.

The application uses [Apollo](https://www.apollographql.com/) and [Fastify](https://www.fastify.io/) as its main graphql and web server. Alongside is [MongoDB](https://www.mongodb.com/) to store data, and a [Redis](https://redis.io/) cache to speed up and cache responses.

Application container orchestration is provided by [Kubernetes](https://kubernetes.io/), using [traefik](https://traefik.io/) as the HTTP loadbalancer. [Cert-Manager](https://github.com/cert-manager/cert-manager/releases/) CRDs are provided to provision HTTPS certificates with [letsencrypt](https://letsencrypt.org/). For local instances of Redis and Mongo, a development [docker compose](./docker-compose.yml) config is also provided.

Infrastructure as Code (IaC) if written using [terraform](https://www.terraform.io/) to provision an environment on [AWS](https://aws.amazon.com/) using [Amazon EKS](https://aws.amazon.com/eks/) to host the kubernetes cluster.

## Contents
- [Development](#development)
- [Kubernetes](#kubernetes)
  - [Local Deployment](#local-deployment)
  - [Secrets](#secrets)
  - [Kustomization](#kustomization)
- [Terraform](#terraform)
- [CI/CD](#ci-cd)
- [GraphQL Examples](#examples)
  - [Queries](#queries)
  - [Mutations](#mutations)

## Development

To run locally

1. Install node modules `npm i`
1. Set up `.env` file - you can just copy the `.env.example` file for now
1. Run `docker compose up` to start a mongodb container and redis container
1. Run `npm run db:seed` to seed the database with documents
1. Start the application with `npm run dev` and visit [localhost:3000/graphql](http://localhost:3000/graphql) to query the application

Alternatively, the command `npm run build` builds a production distribution.

## Kubernetes

This project includes a kubernetes deployment in the `k8s/` directory.

The manifests require [cert-manager](https://cert-manager.io) and [traefik](https://traefik.io/) to be installed (with [helm](https://helm.sh/docs/intro/install/) if you'd like), and secrets for docker-registry authentication and application environment variables.

### Local Deployment

A helper script is supplied, `./k8s/deploy.sh [-f .env -r username:password]` for deploying the cluster locally by;

- Installing resource dependencies via [helm](https://helm.sh/docs/intro/install/) (traefik and cert-manager)
- Ensuring secrets are defined (for container registry authentication and .env definitions).
  - The .env secret can be created/updated by passing through `-f .env`.
  - The docker registry secret can be created/updated by passing through `-r username:password`
- Applies the kubernetes resources to your cluster

After deployment your resources can access locally using [https://localhost](https://localhost)

Note: If deploying this cluster locally, and are using the redis and mongo development containers provided in the [docker compose](./docker-compose.yml) file - swap out the hostnames from `localhost` to `host.docker.internal` in your .env file!

### Secrets

#### Container Repository Authentication

To fetch the container from the repository kubernetes must be authenticated with the github container registry with their username and [github token](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry).

Run the following command with your credentials:

```bash
kubectl create secret docker-registry ghcr-drinkataco \
  --docker-server=ghcr.io \
  --docker-username="$GITHUB_USERNAME" \
  --docker-password="$GHCR_TOKEN"
```

#### ENV File

The container requires several environment variables to be set (as described in the [example file](./.env.example)).

This file is sourced from a secret in the kubernetes deployment.

```bash
kubectl create secret generic app-env \
  --from-env-file=.env
```

### Kustomization

These kubernetes resources use [kustomize](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/) for declarative management of resources.

Different [patches](./k8s/patches) are supplied for local, dev, and prod environments - the former offering a self-signed certificate, and the latter provisioning them with [letsencrypt](https://letsencrypt.org).

## Terraform

Terraform IaC is located in the [./tf](./tf) directory. To deploy you must:

1. Have an AWS profile set up in your local session
2. Initialise default variables (take a peak at [./tf/variables.tf](./tf/variables.tf)  to see what you can set) in a file ./terraform.tfvars.json. A selection:
  - `k8s_docker_registry` must be set to authorise with github to pull the docker container
  - `k8s_secret_env_file` location of .env file for kubernetes (defaulted to `../.env`)
  - `aws_region` region of resources (defaulted to `eu-west-1`)
  - `env_name` resource prefix (defaulted to `eloapi`)
3. Run `terraform init` and `terraform apply`

### Post Deployment Steps

#### Local Access

Once deployed you can use the command `aws eks update-kubeconfig --name <env_name>` to update your `~/.kube/config` file with your cluster config. Then, using `kubectl config set-context <cluster_arn>` you can change your context. By running `kubectl get svc -A`, you can also see the DNS name of your EKS cluster, under EXTERNAL_IP on the traefik service.

### EKS Console

TODO: Add your AWS user to the generated role (ARN returned in the `eks_console_access_role` output) to view cluster information directly in the console.

### TODO:

1. Fetch the loadbalancer EXTERNAL IP for access using `kubectl get svc -A` - you may want to use this to drop behind Route53 too!
1. Add your AWS user to kubernetes aws-auth config - [https://veducate.co.uk/aws-console-permission-eks-cluster/](https://veducate.co.uk/aws-console-permission-eks-cluster/) to view K8s resources in EKS

## CI/CD

On push and tag, typescript linting (using eslint) and testing (using jest) are performed before building.

### Deployment

The application is deployed by tagging based on [semantic versioning](https://semver.org/).

This tag triggers a release workflow and the latest packaged is released to the [repository](https://github.com/drinkataco?tab=packages&repo_name=location-events-api).

## GraphQL Examples

### Queries

The API contains similar methods of access for each collection and each document. A collection can be queried with a find Query (such as `findEvents`) and can be passed parameters related to pagination and ordering. The response includes the `results` and `meta` (which includes total documents, for example).

```graphql
query FindEvents {
  findEvents(limit: 10, order: { by: time, dir: desc }) {
    meta {
      total
      limit
      offset
    }
    results {
      _id
      name
      time {
        start
        end
      }
    }
  }
}
```

Similar methods for querying organisations (findOrganisations) and locations (findLocations) allso exist.

Documents are queried just by stating the document type as a field - such as `event` or `organisation`. They take an `id` argument.

```graphql
query Event {
  event(id: "6343ea4a241c18e3ec46a39d") {
    _id
    name
    description
    time {
      start
      end
    }
  }
}
```

Furthermore, on all collection and document queries we can subquery relations. For example, on an event we could query the location (which is a one to one) by adding the organisation field. If the relationship is one to many, such as organisation to its events, we can use the findEvents query, with the same parameters listed above (such as pagination and ordering).

### Mutations

Mutations are formatted similarly to the collection queries, but prefaced with create, update, and delete.

Create Mutation takes parameters relating to the required fields of that object. A location, however, only requires an address, or a latlng. The missing information will be gathered and filled out from Google Maps API.

```graphql
mutation newLocation {
  createLocation(location: {
    address: {
      line1: "Alligator Lounge",
      line2: "600 Metropolitan Ave",
      city: "Brooklyn",
      region: "New York",
      postCode: "NY 112211",
      country: "USA"
    }
  }) {
    success
    result {
      _id
      latitude
      longitude
    }
  }
}
```

The repsonse above will return the correct latitude and longitude of the supplied address.

An update is similar, but must include an `id` parameter. A delete only requires an `id`.
