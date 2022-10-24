terraform {
  required_version = ">= 1.2.0"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.16"
    }

    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "0.9.0"
    }
  }
}
