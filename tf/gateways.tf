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
