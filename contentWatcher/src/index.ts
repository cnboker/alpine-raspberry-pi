import { IContentWorker } from "./interfaces/IContentWorker";
import { serviceRegister, getService } from "./imps/ServiceProiver";
import { chromiumOpen } from "./chromiumUtil";
import { appCreator } from "./expressApp";
import { instance } from "./configer";

const REACT_APP_LG_URL = "http://127.0.0.1:8000/"
const startWorker = () => {
  var worker = getService("IContentWorker") as IContentWorker;
  worker.execute(() => {
    const url = `${REACT_APP_LG_URL}/index.html?${Date.now()}`
    console.log(url)
    chromiumOpen(url)
  });
}

(async () => {
  serviceRegister();
  appCreator(()=>startWorker());
  instance.read().then(x => {
    startWorker()
  }).catch(() => {
  })
  chromiumOpen(`http://127.0.0.1:8080/`)
})();

