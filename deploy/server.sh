# Pull code
pwd
hostnamectl
curl -s https://deb.nodesource.com/setup_16.x | sudo -S bash
sudo -S apt install nodejs -y
node -v
cd ./sdmay23-40/server
git checkout master
git pull origin master

# Build and deploy
node -v
npm install --production
node server.js