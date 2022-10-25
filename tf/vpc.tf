#
# VPC
#
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

#
# Subnets
#
resource "aws_subnet" "public" {
  # we want to cidr value and the list ID
  for_each = { for k, v in var.vpc_public_subnet_cidrs : k => v }

  availability_zone       = element(var.vpc_azs, each.key)
  cidr_block              = each.value
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-public-subnet-${each.key}"
    })
  )
}

resource "aws_subnet" "private" {
  # we want to cidr value and the list ID
  for_each = { for k, v in var.vpc_private_subnet_cidrs : k => v }

  availability_zone       = element(var.vpc_azs, each.key)
  cidr_block              = each.value
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = false

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-private-subnet-${each.key}"
    })
  )
}

#
# Gateways
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

resource "aws_eip" "nat" {
  vpc  = true
  tags = var.aws_resource_tags
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[keys(aws_subnet.public)[0]].id
  depends_on    = [aws_internet_gateway.main]
  tags          = var.aws_resource_tags
}

#
# Route Tables
#
resource "aws_route_table" "public" {
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

resource "aws_route_table_association" "public" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.main.id
  }

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-igw-route-table"
    })
  )
}

resource "aws_route_table_association" "private" {
  for_each       = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private.id
}
