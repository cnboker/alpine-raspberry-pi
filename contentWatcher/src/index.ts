import { IContentWorker, LogLevel } from "./interfaces/IContentWorker";
import { serviceRegister, getService } from "./imps/ServiceProiver";
import { chromiumOpen } from "./chromiumUtil";
import { appCreator } from "./expressApp";
import { instance } from "./configer";

const REACT_APP_LG_URL = "http://127.0.0.1:8000/"
const startWorker = () => {
  var worker = getService("IContentWorker") as IContentWorker;
  worker.execute((message: string) => {
    const url = `${REACT_APP_LG_URL}/index.html?${Date.now()}`
    worker.log(LogLevel.INFO, message)
    chromiumOpen(url)
  });
}

(async () => {
  serviceRegister();
  appCreator();

  let timer1 = setInterval(async () => {
    //load config
    try {
      console.log('wait config avaliable')
      await instance.read();
      console.log('config loaded')
      clearInterval(timer1)
      startWorker();
    } catch {

    }
  }, 1000)

  chromiumOpen(`http://127.0.0.1:8080/`)
})();

