import axios from 'axios'
import { instance } from '../configer';
import { REACT_APP_SERVICE_URL } from '../constants';
const qs = require("querystring");

export default (app: any) => {
    const crypto = require('crypto');
    const deviceId = crypto.randomUUID();

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
                return res.status(200).end()
            })
            .catch(next);
    })
}