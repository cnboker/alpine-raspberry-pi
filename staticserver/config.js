const os = require("os");
const HOME = os.homedir();
const APP_DIR = `${HOME}/dclient/app`;
const config = {
  root: APP_DIR,
  port: 8000
}
module.exports = config;
