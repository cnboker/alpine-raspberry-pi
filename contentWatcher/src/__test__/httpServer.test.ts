import { expect } from "chai";
import "mocha";
const request = require('supertest')
import { appCreator } from '../expressApp'
const { app, server } = appCreator();
describe("local api test", () => {
    beforeEach(function () {

    });

    after(() => {
        console.log('test after')
        server.close();
    });

    process.on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        console.log('Closing http server.');
        server.close((err: any) => {
            console.log('Http server closed.');
            process.exit(err ? 1 : 0);
        });
    });

    it('save config', (done) => {
        request(app)
            .post('/api/postConfigInfo')
            .send({ id: '123', fileServer: 'http://file.ioliz.com' })
            .expect(200, done)

    });

    it('post deviceInfo', (done) => {
        request(app)
            .post('/api/postDeviceInfo')
            .send({ authorizeCode: '123', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbmlzdHJhdG9ycyIsInVzZXJOYW1lIjoiYWRtaW4iLCJpc0FnZW50IjoiZmFsc2UiLCJlbWFpbCI6ImFkbWluQHFxLmNvbSIsInN1YiI6ImFkbWluIiwianRpIjoiYmZlY2M1OTEtNmVmZC00MGRlLWIzZmEtNDQxYzhiNjNkN2FmIiwiaWF0IjoxNjcwNjQxNzMwLCJuYmYiOjE2NzA2NDE3MzAsImV4cCI6MTk4NjAwMTczMCwiaXNzIjoiRGVtb19Jc3N1ZXIiLCJhdWQiOiJEZW1vX0F1ZGllbmNlIn0.hYku_t-NJktpkf79Xmm36AYKGLhIezN-diEFQEEEeF8' })
            .expect(200, done)

    });
})

