export const chromiumOpen = (url: string) => {
    const WebSocket = require("ws");
    const { createLogger, format, transports } = require('winston');
    const { combine, timestamp, label, printf } = format;
    //@ts-ignore
    const myFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    });
  
    const logger = createLogger({
      level: 'info',
      format: combine(
        label({ label: 'right meow!' }),
        timestamp(),
        myFormat
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'changUrl.log', level: 'error' }),
        new transports.File({ filename: 'changUrlCombined.log' }),
      ],
    });
  
    const axios = require('axios')
  
    var args = process.argv.slice(2);
    console.log("args:" + args)
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
                id: 2,
                method: "Page.navigate",
                params: {
                  url: args[0] || url
                }
              }
  
              wsChrome.send(JSON.stringify(dataChangeUrl))
              //You can use promise-ws to exit the program
              //.then(() => process.exit())
            });
          }
        }
        else {
          logger.error("No tabs open")
          console.log(resp.data);
        }
      })
      .catch((err: any) => {
        // Handle Error Here
        logger.error(err);
      });
  }