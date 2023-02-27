# Pull code
cd ./sdmay23-40/frontend

git checkout master
git pull origin master
npm ci
npm run build

cd ../server
# Build and deploy
npm ci
npm run test -- --silent
cat .env.sudo | sudo -S /usr/bin/pm2 restart server.js >> server.log 2>>&1