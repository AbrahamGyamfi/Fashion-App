# Data source for latest Amazon Linux 2023 ARM AMI
data "aws_ami" "amazon_linux_2023_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }
}

# Elastic IP for NAT Instance
resource "aws_eip" "nat_instance" {
  domain = "vpc"

  tags = merge(var.tags, {
    Name = "${var.project_name}-nat-instance-eip-${var.environment}"
  })
}

# Security Group for NAT Instance
resource "aws_security_group" "nat_instance" {
  name        = "${var.project_name}-nat-instance-${var.environment}"
  description = "Security group for NAT instance"
  vpc_id      = var.vpc_id

  # Allow all traffic from private subnets
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.private_subnet_cidr]
    description = "Allow all traffic from private subnet"
  }

  # Allow SSH from specific IP (optional, for management)
  dynamic "ingress" {
    for_each = var.enable_ssh_access && var.ssh_cidr_blocks != null ? [1] : []
    content {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = var.ssh_cidr_blocks
      description = "SSH access for management"
    }
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-nat-instance-sg-${var.environment}"
  })
}

# IAM Role for NAT Instance
resource "aws_iam_role" "nat_instance" {
  name = "${var.project_name}-nat-instance-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = var.tags
}

# Attach CloudWatch and SSM policies
resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role       = aws_iam_role.nat_instance.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.nat_instance.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance Profile
resource "aws_iam_instance_profile" "nat_instance" {
  name = "${var.project_name}-nat-instance-profile-${var.environment}"
  role = aws_iam_role.nat_instance.name

  tags = var.tags
}

# User Data Script for NAT Configuration
locals {
  user_data = <<-EOF
    #!/bin/bash
    set -e
    
    # Update system
    dnf update -y
    
    # Install required packages
    dnf install -y iptables-services amazon-cloudwatch-agent
    
    # Enable IP forwarding
    echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
    sysctl -p
    
    # Configure iptables for NAT
    iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    iptables -A FORWARD -i eth0 -o eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -i eth0 -o eth0 -j ACCEPT
    
    # Save iptables rules
    service iptables save
    systemctl enable iptables
    systemctl start iptables
    
    # Enable automatic security updates
    dnf install -y dnf-automatic
    sed -i 's/apply_updates = no/apply_updates = yes/' /etc/dnf/automatic.conf
    systemctl enable --now dnf-automatic-install.timer
    
    # Configure CloudWatch Agent
    cat > /opt/aws/amazon-cloudwatch-agent/etc/config.json <<'CWCONFIG'
    {
      "metrics": {
        "namespace": "NAT-Instance",
        "metrics_collected": {
          "cpu": {
            "measurement": [
              {"name": "cpu_usage_idle", "rename": "CPU_IDLE", "unit": "Percent"},
              {"name": "cpu_usage_iowait", "rename": "CPU_IOWAIT", "unit": "Percent"}
            ],
            "metrics_collection_interval": 60,
            "totalcpu": false
          },
          "disk": {
            "measurement": [
              {"name": "used_percent", "rename": "DISK_USED", "unit": "Percent"}
            ],
            "metrics_collection_interval": 60,
            "resources": ["*"]
          },
          "mem": {
            "measurement": [
              {"name": "mem_used_percent", "rename": "MEM_USED", "unit": "Percent"}
            ],
            "metrics_collection_interval": 60
          },
          "net": {
            "measurement": [
              {"name": "bytes_sent", "rename": "NET_OUT", "unit": "Bytes"},
              {"name": "bytes_recv", "rename": "NET_IN", "unit": "Bytes"}
            ],
            "metrics_collection_interval": 60,
            "resources": ["eth0"]
          }
        }
      }
    }
    CWCONFIG
    
    # Start CloudWatch Agent
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
      -a fetch-config \
      -m ec2 \
      -s \
      -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
    
    # Create status file
    echo "NAT Instance configured successfully at $(date)" > /var/log/nat-instance-setup.log
  EOF
}

# NAT Instance
resource "aws_instance" "nat_instance" {
  ami                    = data.aws_ami.amazon_linux_2023_arm.id
  instance_type          = var.instance_type
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [aws_security_group.nat_instance.id]
  iam_instance_profile   = aws_iam_instance_profile.nat_instance.name

  # Disable source/destination check (required for NAT)
  source_dest_check = false

  user_data = local.user_data

  # Enable detailed monitoring
  monitoring = true

  # Use EBS-optimized
  ebs_optimized = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 30
    delete_on_termination = true
    encrypted             = true
  }

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-nat-instance-${var.environment}"
    Role = "NAT"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Associate Elastic IP with NAT Instance
resource "aws_eip_association" "nat_instance" {
  instance_id   = aws_instance.nat_instance.id
  allocation_id = aws_eip.nat_instance.id
}

# CloudWatch Alarm - CPU Utilization
resource "aws_cloudwatch_metric_alarm" "nat_cpu" {
  alarm_name          = "${var.project_name}-nat-instance-cpu-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "NAT instance CPU utilization is too high"

  dimensions = {
    InstanceId = aws_instance.nat_instance.id
  }

  tags = var.tags
}

# CloudWatch Alarm - Status Check Failed (Auto-Recovery)
resource "aws_cloudwatch_metric_alarm" "nat_status_check" {
  alarm_name          = "${var.project_name}-nat-instance-recovery-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "StatusCheckFailed_System"
  namespace           = "AWS/EC2"
  period              = "60"
  statistic           = "Maximum"
  threshold           = "0"
  alarm_description   = "Auto-recover NAT instance on system status check failure"
  alarm_actions       = ["arn:aws:automate:${data.aws_region.current.name}:ec2:recover"]

  dimensions = {
    InstanceId = aws_instance.nat_instance.id
  }

  tags = var.tags
}

# CloudWatch Alarm - Network Errors
resource "aws_cloudwatch_metric_alarm" "nat_network" {
  alarm_name          = "${var.project_name}-nat-instance-network-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "NetworkPacketsOut"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "1000000"
  alarm_description   = "NAT instance network traffic is unusually high"

  dimensions = {
    InstanceId = aws_instance.nat_instance.id
  }

  tags = var.tags
}

# Data source for current region
data "aws_region" "current" {}
