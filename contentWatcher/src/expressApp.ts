//import { chromiumOpen } from "./chromiumUtil";
import axios from 'axios'
import { instance } from './configer';
const qs = require("querystring");

export const appCreator = (close?:()=>void) => {
  const express = require('express')
  var bodyParser = require('body-parser');
  var cors = require('cors')
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json())
  app.use(cors())
  const port = 3000

  //上传设备信息
  app.post('/api/postDeviceInfo', async (req: any, res: any) => {
    const os = require('os');
    const arch = os.arch();
    const platform = os.platform();
    const hostname = os.hostname();
    const release = os.release();
    const { authorizeCode, token } = req.body
    const ifaces = require('os').networkInterfaces();
    let address;
    let mac;
    Object.keys(ifaces).forEach(dev => {
      //@ts-ignore
      ifaces[dev].filter(details => {
        if (details.family === 'IPv4' && details.internal === false) {
          address = details.address;
          mac = details.mac
        }
      });
    });
    const data = {
      deviceId: mac,
      authorizeCode,
      os: `${platform}-${arch}`,
      os_ver: release,
      mac,
      ip: address,
      name: hostname,
    }

    var url = `${process.env.REACT_APP_SERVICE_URL}/api/License/PostDeviceInfo`;
    console.log('upload device info data', data, url)
    await axios({
      url,
      method: "post",
      data: qs.stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
    return res.status(200).end()
  })

  app.get('/api/getConfigInfo', async(req: any, res: any) => {
    const info = await instance.read()
    return res.json(info)
  })
  
  //写配置
  app.post('/api/postConfigInfo', (req: any, res: any) => {
    console.log('body', req.body)
    instance
      .write(req.body)
      .then(() => {
        console.log("write configInfo success");
        server && server.close();
        close && close();
        return res.status(200).end()
      })
      .catch((e) => {
        console.log("write config file error", e);
        return res.status(500).end()
      });

  })

  const server = app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    //const configPage = "http://localhost:8000/config/index.html"
    //chromiumOpen(configPage)
  })

  return { app, server };
}