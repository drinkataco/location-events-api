#
# Subnets are created based of public and private list in variables
# - The lists index is used to differ the name of resources
# - Availability zone is selected automatically from what is available, cycling through indexes
#
resource "aws_subnet" "public" {
  for_each = { for k, v in var.vpc_public_subnet_cidrs : k => v }

  availability_zone       = data.aws_availability_zones.available.names[(length(data.aws_availability_zones.available.names) - 1) % each.key]
  cidr_block              = each.value
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-public-subnet-${each.key}"
      "kubernetes.io/role/elb" = "shared"
    })
  )
}

resource "aws_subnet" "private" {
  for_each = { for k, v in var.vpc_private_subnet_cidrs : k => v }

  availability_zone       = data.aws_availability_zones.available.names[(length(data.aws_availability_zones.available.names) - 1) % each.key]
  cidr_block              = each.value
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = false

  tags = merge(
    var.aws_resource_tags,
    tomap({
      Name = "${var.env_name}-private-subnet-${each.key}"
      "kubernetes.io/role/internal-elb" = "1"
    })
  )
}
