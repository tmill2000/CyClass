# Pull code
cd ./sdmay23-40/server
nvm use 16.17.0
git checkout master
git pull origin master

# Build and deploy
npm install --production
node server.js