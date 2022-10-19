# Pull code
nvm --version
cd ./sdmay23-40/server
git checkout master
git pull origin master

# Build and deploy
node -v
npm install --production
node server.js