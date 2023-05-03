import { assert } from 'chai'
import 'mocha'
import { instance } from '../configer'

describe("test file", () => {
    it('test write file', async (done) => {
        await instance.write({
            userName: 'scott',
            deviceId: '123',
            fileServer: '',
            mqttServer: '',
            token: ''
        })
        done()
    })
})