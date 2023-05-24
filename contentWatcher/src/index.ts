import { IContentWorker } from "./interfaces/IContentWorker";
import { serviceRegister, getService } from "./imps/ServiceProiver";
import { appCreator } from "./expressApp";
import { instance } from "./configer";
import { writeFile } from "./imps/FileService";
import { APP_DOWNLOAD_DIR } from "./configer";
import './logger'

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
      var worker = getService("IContentWorker") as IContentWorker;
      worker.execute(async (message: string) => {
        console.log(message)
        await writeFile(
          `${APP_DOWNLOAD_DIR}/timestamp`,
          Date.now().toString()
        );
      });
    } catch {

    }
  }, 1000)

})();

