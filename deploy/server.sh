# Pull code
cd ./sdmay23-40/server
git checkout master
git pull origin master

# Build and deploy
npm install --omit=dev
killall node
nodemon server.js &