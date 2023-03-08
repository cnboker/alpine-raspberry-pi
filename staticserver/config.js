const path = require('path');
const dclientDir = path.resolve(__dirname, '..')
const appdir = path.join(dclientDir,'app')
const config = {
    //root:`/srv/dclient/app`,
    root:appdir,
    port:8000
  }
  module.exports = config;
