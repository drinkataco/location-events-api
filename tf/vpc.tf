#
# VPC
#
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  instance_tenancy = "default"

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-vpc"
    })
  )
}

#
# Subnets
#
resource "aws_subnet" "public" {
  # we want to cidr value and the list ID
  for_each = { for k, v in var.vpc_public_subnet_cidrs: k => v }

  availability_zone = element(var.vpc_azs, each.key)
  cidr_block = each.value
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-public-subnet-${each.key}"
    })
  )
}

resource "aws_subnet" "private" {
  # we want to cidr value and the list ID
  for_each = { for k, v in var.vpc_private_subnet_cidrs: k => v }

  availability_zone = element(var.vpc_azs, each.key)
  cidr_block = each.value
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-private-subnet-${each.key}"
    })
  )
}

#
# Internet Gateway
#
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-igw"
    })
  )
}

#
# Route Table for Public Subnet IGW
#
resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0" 
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-igw-route-table"
    })
  )
}

resource "aws_route_table_association" "main" {
  for_each = aws_subnet.public
  subnet_id = each.value.id
  route_table_id = aws_route_table.main.id
}

