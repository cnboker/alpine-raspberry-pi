ROOTDIR="${PWD}/dist/dclient"
kill $(lsof -t -i:3000)
node ${ROOTDIR}/proxyServer/bundle.js &

kill $(lsof -t -i:8000)
node ${ROOTDIR}/staticserver/index.js &

export DISPLAY=:0 && google-chrome --remote-debugging-port=9222 &