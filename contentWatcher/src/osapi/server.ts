import deviceapi from "./deviceapi";
import networkapi from './networkapi'

export const appCreator = (configWriteSuccess?: () => void) => {
  const express = require('express')
  var bodyParser = require('body-parser');
  var cors = require('cors')
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json())
  app.use(cors())
  const port = 3000

  deviceapi(app)
  networkapi(app)
  
  const server = app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })

  return { app, server };
}