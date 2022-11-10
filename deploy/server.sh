# Pull code
cd ./sdmay23-40/frontend

git checkout master
git pull origin master

npm install --omit=dev
npm run Build

cd ../server
# Build and deploy
npm install --omit=dev
/usr/bin/pm2 restart server.js