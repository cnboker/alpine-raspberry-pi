ROOTDIR="${PWD}/dist/dclient"
killall -9 node

#export DISPLAY=:0 && chromium-browser --no-sandbox --remote-debugging-port=9222 &
export DISPLAY=:0 && google-chrome --no-sandbox --remote-debugging-port=9222 &

#kill $(lsof -t -i:3000)
node ${ROOTDIR}/proxyServer/bundle.js &

#kill $(lsof -t -i:8000)
node ${ROOTDIR}/staticserver/index.js &

