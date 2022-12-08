import { IContentWorker } from "./interfaces/IContentWorker";
import { serviceRegister, getService } from "./imps/ServiceProiver";
import { chromiumOpen } from "./chromiumUtil";
import { runProxyServer } from "./httpServer";
import { APP_DIR } from "./configer";
import { fileExists } from "./imps/FileService";

//设备配置文件如果不存在，则说明没有激活
const deviceisActived = (): boolean => {
  return fileExists(`${APP_DIR}/app.config`)
}

(() => {
  console.log('start..')
  runProxyServer();
  return;
  const REACT_APP_LG_URL = "http://localhost:8000/"
  serviceRegister();
  var worker = getService("IContentWorker") as IContentWorker;0
  worker.log(0, "client started ...");
  if (deviceisActived()) {
    worker.execute(() => {
      const url = `${REACT_APP_LG_URL}index.html?${Date.now()}`
      console.log(url)
      chromiumOpen(url)
    });
  } else {
    runProxyServer();
  }

})();