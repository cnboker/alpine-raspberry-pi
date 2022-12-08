import { APP_ID } from "../constants";

export const screenCapture = (outputFile: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        //@ts-ignore
        const bridge = window.webosBridge;
        bridge.onservicecallback = (msg: string) => {
            const response = JSON.parse(msg)
            const { returnValue, errorText } = response
            if (returnValue) {
                resolve(response)
            } else {
                reject(errorText)
            }
        }
        var url = "luna://com.webos.surfacemanager/captureCompositorOutput"
        var params = JSON.stringify({
            "appId": APP_ID,
            "format": "PNG",
            "output": outputFile
        })
        bridge.call(url, params)
    })
}

export type ForegroundAppInfo = {
    appId: string;
    processId: string;
    windowGroup: boolean;
    windowGroupOwner: boolean;
    windowGroupOwnerId: string;
    //这个参数很重要，加载视频文件的时候需要这个参数
    windowId: string;
    windowType: string;
}

//获取激活app的基本信息
export const getForegroundAppInfo = (): Promise<ForegroundAppInfo> => {
    return new Promise((resolve) => {
        //@ts-ignore
        const bridge = window.webosBridge;
        bridge.onservicecallback = (msg: string) => {
            const response = JSON.parse(msg)
            const { returnValue, foregroundAppInfo } = response
            if (returnValue) {
                resolve(response)
            }
        }
        var url = "luna://com.webos.surfacemanager/getForegroundAppInfo"
        var params = JSON.stringify({
        })
        bridge.call(url, params)
    })
}