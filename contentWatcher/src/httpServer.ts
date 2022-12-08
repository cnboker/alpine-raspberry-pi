//import { chromiumOpen } from "./chromiumUtil";
import axios from 'axios'
import { instance } from './configer';

export const runProxyServer = () => {
  const express = require('express')
  var bodyParser = require('body-parser');
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json())
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
    var url = `${process.env.REACT_APP_SERVICE_URL}/api/License/PostDeviceInfo`;
    await axios({
      url,
      method: "post",
      data: {
        deviceId: mac,
        authorizeCode,
        os: `${platform}-${arch}`,
        os_ver: release,
        mac,
        ip: address,
        name: hostname,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
    res.json({
      arch,
      platform,
      hostname,
      release,
      address,
      mac
    });
  })

  //写配置
  app.get('/api/postConfigInfo', (req: any, res: any) => {
    instance
      .write(req.body)
      .then(() => {
        console.log("write configInfo success");
      })
      .catch((e) => {
        console.log("write config file error", e);
      });
    res.sendStatus(200)
  })

  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    //const configPage = "http://localhost:8000/config/index.html"
    //chromiumOpen(configPage)
  })
}