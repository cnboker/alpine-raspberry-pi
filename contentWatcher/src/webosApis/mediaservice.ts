import { getForegroundAppInfo } from "./surfaceservice";
import { APP_ID } from "../constants";

export type Metadata = {
    video_codec: string;
    date_of_creattion: string;
    last_modified_date: string;
    url: string;
    height: number;
    width: number;
    type: string;
    frame_rate: string;
    mime: string;
    file_size: number;
    //file:///tmp/usb/sdh/test.mp4
    file_path: string;
    duration: number;
    //filename
    title: string;
    thumbnail: string;
}

export const getMetadata = (url: string): Promise<Metadata> => {
    return new Promise((resolve, reject) => {
        //@ts-ignore
        const bridge = window.webosBridge;
        bridge.onservicecallback = (msg: string) => {
            const response = JSON.parse(msg)
            const { returnValue, errorText, metadata } = response
            if (returnValue) {
                resolve(metadata)
            } else {
                reject(errorText)
            }
        }
        var uri = "luna://com.webos.service.mediaindexer/getVideoMetadata"
        var params = JSON.stringify({
            "uri": uri
        })
        bridge.call(url, params)
    })
}

//return mediaId
//加载视频，图片文件
export const load = (uri: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const { windowId } = await getForegroundAppInfo();
        //@ts-ignore
        const bridge = window.webosBridge;
        bridge.onservicecallback = (msg: string) => {
            const response = JSON.parse(msg)
            //errorCode=0 表示没有错误
            const { returnValue, errorCode, errorText, mediaId } = response
            if (returnValue) {
                resolve(mediaId)
            } else {
                reject(errorText)
            }
        }
        var url = "luna://com.webos.media/load"
        var params = JSON.stringify({
            uri,
            type: "media",
            payload: {
                option: {
                    appId: APP_ID,
                    windowId
                }
            }
        })
        bridge.call(url, params)
    })
}
//
export const unLoad = (mediaId: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        
        //@ts-ignore
        const bridge = window.webosBridge;
        bridge.onservicecallback = (msg: string) => {
            const response = JSON.parse(msg)
            //errorCode=0 表示没有错误
            const { returnValue, errorCode, errorText, mediaId } = response
            if (returnValue) {
                resolve(mediaId)
            } else {
                reject(errorText)
            }
        }
        var url = "luna://com.webos.media/unload"
        var params = JSON.stringify({
            mediaId,
        })
        bridge.call(url, params)
    })
}

export const play = (mediaId: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        
        //@ts-ignore
        const bridge = window.webosBridge;
        bridge.onservicecallback = (msg: string) => {
            const response = JSON.parse(msg)
            //errorCode=0 表示没有错误
            const { returnValue, errorText, mediaId } = response
            if (returnValue) {
                resolve(mediaId)
            } else {
                reject(errorText)
            }
        }
        var url = "luna://com.webos.media/play"
        var params = JSON.stringify({
            mediaId,
        })
        bridge.call(url, params)
    })
}