# Interactive Learning Tool for Large Size Lectures ###
Express Application for Senior Design Team 40
## Pre-Reqs
- Node 16
- Docker
- nodemon library installed (preferrably globally)
## Running Locally
Create a .env file in the server folder with the following content
```
PORT=80
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=db
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=db
SESSION_SECRET=test
NODE_ENV=devl
```
```
## From /server  directory run
docker compose -f "docker-compose.yml" down
docker compose -f "docker-compose.yml" up -d --build
nodemon server.js
```
