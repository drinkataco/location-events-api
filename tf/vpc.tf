resource "aws_vpc" "main" {
  cidr_block       = var.vpc_cidr
  instance_tenancy = "default"

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-vpc"
    })
  )
}

data "aws_availability_zones" "available" {
  state = "available"
}
