import {
  IContentWorker,
  IContentNotify,
  IResourceInfo,
  IFileDownloader,
} from "../interfaces/IContentWorker";
import { readFile, fileExists, unzipFile } from "./FileService";
import { getService } from "./ServiceProiver";
import { IMQTTDispatcher } from "../interfaces/IMQTTDispatcher";
import { APP_DIR, APP_DOWNLOAD_DIR, instance, isInTest } from "../configer";
import IClientAPI from "../interfaces/IClientAPI";

//main
export default class ContentWorker implements IContentWorker {
  contentNotify: IContentNotify;
  fileDownloader: IFileDownloader;
  mqttDispather: IMQTTDispatcher;
  clientAPI: IClientAPI;

  log(level: number, message: string): void {
    const clientAPI = <IClientAPI>getService("IClientAPI");
    clientAPI.log(instance.deviceId, level, message);
  }

  //callback defined
  execute(cb: { (): void }): void {
    this.contentNotify = <IContentNotify>getService("IContentNotify");
    this.fileDownloader = <IFileDownloader>getService("IFileDownloader");
    this.mqttDispather = <IMQTTDispatcher>getService("IMQTTDispatcher");
    this.mqttDispather.connect(instance.mqttServer, instance.deviceId);

    this.mqttDispather.onSubContentNotify = (data) => {
      //fileServer:http://ip:port/scott
      //发布目录/dist/index.html
      var fileList = data.files.map(
        (x) =>
          <IResourceInfo>{
            resourceUrl: `${x}`,
            status: 0,
          }
      );
      //this.download(fileList, cb)
      this.download(fileList, () => {
        this.zipPipe(fileList).then(() => {
          cb && cb();
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
          this.zipPipe(fileList).then(() => {
            cb && cb();
          });
        });
      })
      .catch((e) => {
        console.log("read downloadlist.json", e);
      });
    //检查index.html是否存在，如果存在则加载
    if (fileExists(`${APP_DOWNLOAD_DIR}/index.html`)) {
      cb && cb();
    }

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
