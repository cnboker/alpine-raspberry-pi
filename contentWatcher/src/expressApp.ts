//import { chromiumOpen } from "./chromiumUtil";
import axios from 'axios'
import { instance } from './configer';
import { REACT_APP_SERVICE_URL } from './constants';
const qs = require("querystring");
const crypto = require('crypto');
const deviceId = crypto.randomUUID();

export const appCreator = (configWriteSuccess?: () => void) => {
  const express = require('express')
  var bodyParser = require('body-parser');
  var cors = require('cors')
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json())
  app.use(cors())
  const port = 3000

  //上传设备信息
  app.post('/api/postDeviceInfo', async (req: any, res: any, next: any) => {
    console.log('app.post,/api/postDeviceInfo...')
    const os = require('os');
    const arch = os.arch();
    const platform = os.platform();
    const hostname = os.hostname();
    const release = os.release();
    const { authorizeCode, token } = req.body
    const ifaces = require('os').networkInterfaces();
    let address;
    // let mac;
    // Object.keys(ifaces).forEach(dev => {
    //   //@ts-ignore
    //   ifaces[dev].filter(details => {
    //     if (details.family === 'IPv4' && details.internal === false) {
    //       address = details.address;
    //       mac = details.mac
    //     }
    //   });
    // });
    
    console.log('deviceId', deviceId);
    const data = {
      deviceId,
      authorizeCode,
      os: `${platform}-${arch}`,
      os_ver: release,
      ip: address,
      name: hostname,
    }

    var url = `${REACT_APP_SERVICE_URL}/api/License/PostDeviceInfo`;
    console.log('upload device info data', data, url)
    axios({
      url,
      method: "post",
      data: qs.stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    }).then(x => res.status(200).end())
      .catch(next)
  })

  app.get('/api/getConfigInfo', async (req: any, res: any, next: any) => {
    instance.read()
      .then((info) => res.json(info))
      .catch(next)
    //return res.json(info)
  })

  app.get('/api/test', async (req: any, res: any) => {
    return res.status(200).end()
  })

  //写配置
  app.post('/api/postConfigInfo', (req: any, res: any, next: any) => {
    console.log('body', req.body)
    instance
      .write({ ...req.body, deviceId })
      .then(() => {
        console.log("write configInfo success");
        //server && server.close();
        configWriteSuccess && configWriteSuccess();
        return res.status(200).end()
      })
      .catch(next);
  })

  const server = app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })

  return { app, server };
}