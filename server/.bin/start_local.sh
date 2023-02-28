#!/bin/bash
docker compose -f "docker-compose.yml" down
docker compose -f "docker-compose.yml" up -d --build
nodemon server.js > server.log 2>&1