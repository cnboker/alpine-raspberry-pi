export const chromiumOpen = (url:string) =>{
  const childProc = require('child_process');
  childProc.exec(`google-chrome ${url}`);
}
export const chromiumOpen1 = (url: string) => {
  const WebSocket = require("ws");

  const axios = require('axios')

  //var args = process.argv.slice(2);
  //console.log("args:" + args)
  axios.get('http://127.0.0.1:9222/json')
    .then((resp: { data: any; }) => {
      const data = resp.data;
      if (data.length > 0) {
        const firstTab = data[0];
        const wsUrl = firstTab.webSocketDebuggerUrl;
        if (wsUrl) {
          //open websocket
          const wsChrome = new WebSocket(wsUrl);

          wsChrome.on('open', function open() {
            const dataChangeUrl = {
              id: 1,
              method: "Page.navigate",
              params: {
                url
              }
            }
            console.log('dataChangeUrl', dataChangeUrl)
            wsChrome.send(JSON.stringify(dataChangeUrl))
              //You can use promise-ws to exit the program
            
          });
        }
      }
      else {
        //logger.error("No tabs open")
        //console.log(resp.data);
      }
    })
    .catch((err: any) => {
      console.log('chromeuile error', err)
    });
} 