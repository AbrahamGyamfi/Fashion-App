resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, {
    Name = "shopnow-vpc-${var.environment}"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.tags, {
    Name = "shopnow-igw-${var.environment}"
  })
}

resource "aws_subnet" "public" {
  count                   = length(var.public_availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.public_availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "shopnow-public-${var.public_availability_zones[count.index]}-${var.environment}"
    Type = "public"
  })
}

resource "aws_subnet" "private" {
  count             = length(var.private_availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.private_availability_zones[count.index]

  tags = merge(var.tags, {
    Name = "shopnow-private-${var.private_availability_zones[count.index]}-${var.environment}"
    Type = "private"
  })
}

resource "aws_eip" "nat" {
  count  = var.use_nat_gateway ? length(var.private_availability_zones) : 0
  domain = "vpc"

  tags = merge(var.tags, {
    Name = "shopnow-nat-eip-${count.index + 1}-${var.environment}"
  })
}

resource "aws_nat_gateway" "main" {
  count         = var.use_nat_gateway ? length(var.private_availability_zones) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(var.tags, {
    Name = "shopnow-nat-${count.index + 1}-${var.environment}"
  })

  depends_on = [aws_internet_gateway.main]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(var.tags, {
    Name = "shopnow-public-rt-${var.environment}"
  })
}

resource "aws_route_table" "private" {
  count  = length(var.private_availability_zones)
  vpc_id = aws_vpc.main.id

  # Route to NAT Gateway if enabled (NAT instance route handled in root main.tf)
  dynamic "route" {
    for_each = var.use_nat_gateway ? [1] : []
    content {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.main[count.index].id
    }
  }

  tags = merge(var.tags, {
    Name = "shopnow-private-rt-${count.index + 1}-${var.environment}"
  })
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_availability_zones)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = length(var.private_availability_zones)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
