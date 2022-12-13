#!/bin/sh
ROOTDIR="/home/$USER/dclient"
rm -rf "${ROOTDIR}/app" "${ROOTDIR}/app/downloads" "${ROOTDIR}/staticserver" "${ROOTDIR}/proxyServer"
mkdir -p "${ROOTDIR}/app" "${ROOTDIR}/app/downloads" "${ROOTDIR}/staticserver" "${ROOTDIR}/proxyServer"

cd ./apppack
npm run build
cp -r ./build/* ${ROOTDIR}/app
cd ..

echo 'run contentWatcher app...'
cd ./contentWatcher
npm run build
cp -r ./dist/* ${ROOTDIR}/proxyServer


echo 'run staticserver app...'
cd ..
cd ./staticserver
cp -r ./* ${ROOTDIR}/staticserver
