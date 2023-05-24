import {
  IContentWorker,
  IContentNotify,
  IResourceInfo,
  IFileDownloader,
  LogLevel,
} from "../interfaces/IContentWorker";
import { readFile, fileExists, unzipFile } from "./FileService";
import { getService } from "./ServiceProiver";
import { IMQTTDispatcher } from "../interfaces/IMQTTDispatcher";
import { APP_DIR, APP_DOWNLOAD_DIR, instance } from "../configer";
import IClientAPI from "../interfaces/IClientAPI";

//main
export default class ContentWorker implements IContentWorker {
  contentNotify: IContentNotify;
  fileDownloader: IFileDownloader;
  mqttDispather: IMQTTDispatcher;
  clientAPI: IClientAPI;

  log(level: LogLevel, message: string): void {
    this.clientAPI.log(instance.deviceId, level, message)
      .then(() => console.log('log...'))
      .catch((e) => console.log('write log error', e))
  }

  //callback defined
  execute(cb: { (message: string): void }): void {
    this.contentNotify = <IContentNotify>getService("IContentNotify");
    this.fileDownloader = <IFileDownloader>getService("IFileDownloader");
    this.mqttDispather = <IMQTTDispatcher>getService("IMQTTDispatcher");
    this.clientAPI = <IClientAPI>getService("IClientAPI");
    this.mqttDispather.connect(instance.mqttServer, instance.deviceId);

    this.mqttDispather.onSubContentNotify = (data) => {
      //fileServer:http://ip:port/scott
      //发布目录/dist/index.html
      console.log('data is ready', data)
      var fileList = data.files.map(
        (x) =>
          <IResourceInfo>{
            resourceUrl: `${x}`,
            status: 0,
          }
      );

      this.download(fileList, () => {
        this.zipPipe(fileList).then(() => {
          cb && cb('download finished notify.');
        });
      });
    };

    //如果上次下载未完成，读未下载数据继续下载
    readFile(`${APP_DIR}/downloadlist.json`)
      .then((msg) => {
        if (msg.returnValue) {
          return JSON.parse(msg.payload);
        }
      })
      .then((fileList) => {
        this.download(fileList, () => {
          //下载完成
          this.zipPipe(fileList).then(() => {
            cb && cb('检查是否包含zip文件，如果包含做解压操作');
          });
        });
      })
      .catch((e) => {
        console.log("downloadlist.json not exist");
      });


    this.contentNotify.watch();
  }
  //

  zipPipe(fileList: IResourceInfo[]): Promise<IResourceInfo[]> {
    if (fileList.length === 0) return Promise.resolve(fileList);
    const item = fileList[0];
    if (item.resourceUrl.lastIndexOf(".zip") > 0) {
      const fileName = new URL(item.resourceUrl).pathname;
      console.log("zip file path", fileName);
      return new Promise((resolve, reject) => {
        unzipFile(`${APP_DOWNLOAD_DIR}${fileName}`, APP_DOWNLOAD_DIR)
          .then(() => {
            console.log(`${fileName} unzip is ok`);
            resolve(fileList);
          })
          .catch((e) => {
            console.log("unzip error", e);
            reject(e);
          });
      });
    }
    return Promise.resolve(fileList);
  }

  download(fileList: IResourceInfo[], cb: { (): void }) {
    if (fileList.length > 0) {
      if (this.fileDownloader) {
        this.fileDownloader.cancel();
      }
      this.fileDownloader.onDownloadComplete = (fileList: IResourceInfo[]) => {
        this.diskClean(fileList);
        if (cb) {
          cb();
        }
      };
      this.fileDownloader.download(fileList);
    }
  }

  diskClean(data: IResourceInfo[]) {
    //const ONE_HOUR = 3600 * 1000;
    // var timer = setTimeout(() => {
    //   clearTimeout(timer);
    //   var clear = new DiskClear(data);
    //   clear.clean();
    // }, 6000);
  }
}
