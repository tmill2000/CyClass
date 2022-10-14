#!/bin/bash
docker compose -f "..\server\docker-compose.yml" down
docker compose -f "..\server\docker-compose.yml" up -d --build
node server.js