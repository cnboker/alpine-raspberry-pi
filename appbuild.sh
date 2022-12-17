#!/bin/sh
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


echo 'build staticserver app...'
cd ..
cd ./staticserver
cp -r ./* ${TARGETDIR}/staticserver
cd ..
