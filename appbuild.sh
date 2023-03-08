#!/bin/sh

kill $(lsof -t -i:3000)
kill $(lsof -t -i:8000)

ROOTDIR="${PWD}"
TARGETDIR="${PWD}/dist/dclient"
rm -rf "${TARGETDIR}/app" "${TARGETDIR}/app/downloads" "${TARGETDIR}/staticserver" "${TARGETDIR}/proxyServer"
mkdir -p "${TARGETDIR}/app" "${TARGETDIR}/app/downloads" "${TARGETDIR}/staticserver" "${TARGETDIR}/proxyServer"

cd ./apppack
npm run build
cp -r ./build/* ${TARGETDIR}/app
cd ..

echo 'build contentWatcher app...'
cd ./contentWatcher
npm run build
cp -r ./dist/* ${TARGETDIR}/proxyServer
cd ..

echo 'build staticserver app...'
cd ./staticserver
cp -r ./* ${TARGETDIR}/staticserver
cd ..
