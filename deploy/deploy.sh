#!/bin/bash
DEPLOY_SERVER=sdmay23-40.ece.iastate.edu
echo "Deploying to ${DEPLOY_SERVER}"
ssh vm-user@sdmay23-40.ece.iastate.edu 'bash' < ./deploy/server.sh