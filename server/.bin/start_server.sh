#!/bin/bash
sudo docker compose -f "../server/docker-compose.yml" down
sudo docker compose -f "../server/docker-compose.yml" up -d --build
node server.js