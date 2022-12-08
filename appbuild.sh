#!/bin/sh
ROOTDIR="/media/internal/dclient"
mkdir -p "${ROOTDIR}/app" "${ROOTDIR}/app/downloads" "${ROOTDIR}/staticserver" "${ROOTDIR}/proxyServer"

cd ./apppack
npm run build
cp -r ./build/* ${ROOTDIR}/app

echo 'run contentWatcher app...'
cd ..
cd ./contentWatcher
npm run build
cp -r ./dist ${ROOTDIR}/proxyServer
lsof -i:3000
node ${ROOTDIR}/proxyServer/index.js &

echo 'run staticserver app...'
cd ..
cd ./staticserver
cp -r ./* ${ROOTDIR}/staticserver
lsof -i:8000
node ${ROOTDIR}/staticserver/index.js &