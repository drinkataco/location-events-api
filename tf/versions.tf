terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }

    dotenv = {
      source  = "jrhouston/dotenv"
      version = "~> 1.0"
    }
  }

  required_version = "~> 1.2.0"
}
