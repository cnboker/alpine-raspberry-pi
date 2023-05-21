require("dotenv").config();
import { readFile, writeFile, removeFile, fileExists, mkdir } from "./imps/FileService";
import { ConfigModel } from "./dataModels/ConfigModel"
import { EventEmitter } from "fbemitter";
import { APP_ID, REACT_APP_AUTH_URL, REACT_APP_SERVICE_URL } from "./constants";

class Configer {
  private static _instance: Configer;
  _configInstance: ConfigModel;
  _emitter: EventEmitter;

  private constructor() {
    this._emitter = new EventEmitter();
    this._configInstance = <ConfigModel>{

    }
    this._emitter.addListener("log", (type: EventType, message: string) => {
      console.log(`${type},${message}`);
    });

  }

  read(): Promise<ConfigModel> {
    return new Promise((resolve, reject) => {
      readFile(`${APP_DIR}/config.json`)
        .then(msg => {
          if (msg.returnValue) {
            this._configInstance = JSON.parse(msg.payload);
            resolve(this._configInstance);
          } else {
            reject(msg)
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  reset() {
    removeFile(`${APP_DIR}/config.json`);
  }

  async write(config: ConfigModel): Promise<boolean> {
    this._configInstance = config;
    await this.rootDirReady();
    const msg = await writeFile(
      `${APP_DIR}/config.json`,
      JSON.stringify(config)
    );
    return msg.returnValue!;
  }

  rootDirReady = async () => {
   
    if (!fileExists(APP_DIR)) {
      console.log('APP_DIR',APP_DIR)
      await mkdir(APP_DIR)
    }
  };

  get deviceId(): string {
    return this._configInstance.deviceId;
  }

  get token(): string {
    return this._configInstance.token;
  }

  get fileServer(): string {
    return this._configInstance.fileServer
  }

  get mqttServer(): string {
    return this._configInstance.mqttServer
  }

  get emitter() {
    return this._emitter;
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}
const os = require("os");
const HOME = os.homedir();
export const APPID = "com.ioliz.dc.app";
export const APP_DIR = `./`;
export const APP_DOWNLOAD_DIR = `../downloads`;
export const USB_ROOT = "/tmp/usb/sda/sda1";
export const instance: Configer = Configer.instance;
export const Service_Server = REACT_APP_SERVICE_URL;
export const Auth_Server = REACT_APP_AUTH_URL;
//是否是单元测试
export const isInTest = typeof global.it === 'function';
//事件类型
export enum EventType {
  FileDownload
}