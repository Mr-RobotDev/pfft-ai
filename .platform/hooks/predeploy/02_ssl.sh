#!/usr/bin/env bash
yum install certbot -y
certbot certonly --standalone -d pfft.ai -d www.pfft.ai --email info@pfft.ai --agree-tos --eff-email

