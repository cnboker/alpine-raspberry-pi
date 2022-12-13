ROOTDIR="/home/$USER/dclient"
kill $(lsof -t -i:3000)
node ${ROOTDIR}/proxyServer/bundle.js &

kill $(lsof -t -i:8000)
node ${ROOTDIR}/staticserver/index.js &

google-chrome --remote-debugging-port=9222 &