import { IContentNotify } from "../interfaces/IContentWorker";
import EventDispatcher from "./EventDispatcher";
import { SNAPSHOT_EVENT } from '../constants'
import { instance } from "../configer";
import IClientAPI from "../interfaces/IClientAPI";
import { getService } from "./ServiceProiver";
import { IMQTTDispatcher } from "../interfaces/IMQTTDispatcher";
import { screenCapture } from "../webosApis/surfaceservice";
import { readFile, resize } from "./FileService";
export default class ContentNotify implements IContentNotify {
  private timeout: number = 1000 * 30;
  private dispatcher: EventDispatcher;
  private clientAPI: IClientAPI

  onSnapshot(callback: () => void): void {
    this.dispatcher.subscribe(SNAPSHOT_EVENT, callback)
  }

  watch(): void {
    this.dispatcher = new EventDispatcher();
    this.clientAPI = <IClientAPI>getService("IClientAPI");
    const mqttDispather = <IMQTTDispatcher>getService("IMQTTDispatcher");

    mqttDispather.onSubSnapshotNotify = () => {
      this.snapshotProcess();
    }

    setInterval(this.updateBeatheart.bind(this), this.timeout);
  }

  private updateBeatheart() {
    console.log('instance.token',instance.token)
    if (!instance.token) return;
    this.clientAPI.heartbeat(instance.deviceId).then(x => {
      console.log("update beatheart", x.data);
    });
  }

  snapshotProcess(): void {
    console.log("snapshotProcess call...");
    const captureFile = '/tmp/capture.png'

    screenCapture(captureFile).then(res => {
      //read image file
      return resize(captureFile, 800);
    })
      .then(res => {
        this.clientAPI.updateSnapshot(res.payload);
      })
      .catch(error => {
        console.log('scrrencapture', error)
      })
  }

}
