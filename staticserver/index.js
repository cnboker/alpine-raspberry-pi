const mime = require('./mime');
const http = require("http");
const { stat, createReadStream, existsSync } = require("fs");
const { promisify } = require("util");
const { pipeline } = require("stream");
const url = require("url"),
  fileInfo = promisify(stat);
const path = require("path");
const { resolve } = require('path')

const request = (root) => {
  console.log('request root',root)
  return async (req, res) => {
    var uri = url.parse(req.url).pathname;
    if (uri === '/') {
      uri = 'index.html'
    }
    var filename = path.join(root, uri);
    console.log('uri', uri, filename)
    if (!existsSync(filename)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 Not Found\n");
      //res.end();
      return;
    }
    var fileType = mime.lookup(filename);
    //console.log('fileType', fileType)
    /** Calculate Size of file */
    const { size } = await fileInfo(filename);
    const range = req.headers.range;
    //console.log("range", range, size, filename);
    /** Check for Range header */

    if (range) {
      /** Extracting Start and End value from Range Header */
      let [start, end] = range.replace(/bytes=/, "").split("-");
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : size - 1;

      if (!isNaN(start) && isNaN(end)) {
        start = start;
        end = size - 1;
      }
      if (isNaN(start) && !isNaN(end)) {
        start = size - end;
        end = size - 1;
      }

      // Handle unavailable range request
      if (start >= size || end >= size) {
        // Return the 416 Range Not Satisfiable.
        res.writeHead(416, {
          "Content-Range": `bytes */${size}`
        });
        return res.end();
      }
      //console.log("range-content", `bytes ${start}-${end}/${size}`);
      /** Sending Partial Content With HTTP Code 206 */
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": fileType,
        "Access-Control-Allow-Origin": "*"
      });

      let fileStream = createReadStream(filename, { start: start, end: end });
      pipeline(fileStream, res, err => { });

      // })
    } else {
      res.writeHead(200, {
        "Content-Length": size,
        "Content-Type": `${fileType}`,
        "Access-Control-Allow-Origin": "*"
      });

      let fileStream = createReadStream(filename);

      pipeline(fileStream, res, err => { });
    }
  }
}

const server = (root, port) => {
  http
    .createServer(request(root))
    .listen(port, () => console.log(`Running on ${port} port`));
}

//console.log('current path', process.cwd())
//console.log("Current directory:", __dirname);
const rootDir = require('path').resolve(__dirname, '..')
//app server
server(resolve(rootDir,'app'), 8080)
//download resource server
server(resolve(rootDir,'downloads'), 8000)