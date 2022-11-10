# Pull code
cd ./sdmay23-40/frontend

git checkout master
git pull origin master
ls
npm ci --omit=dev
npm run build

cd ../server
ls
# Build and deploy
npm ci --omit=dev
/usr/bin/pm2 restart server.js