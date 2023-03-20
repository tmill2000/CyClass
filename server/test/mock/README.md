# Testing instructions
Jest & Postman
## Jest
- cd to server directory
- ```npm run test```
## Postman
- cd to server directory
- ```docker compose -f "docker-compose.yml" down```
- ```docker compose -f "docker-compose.yml" up -d --build```
- ```node server.js```
- upload ```automated_tests.postman_collection.json``` to postman
- right click on the uploaded collection and hit run
