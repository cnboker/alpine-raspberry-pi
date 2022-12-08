const fs = require("fs");
const unzip = require("unzip-stream");

module.exports.unzip = function (zipFilePath, extractToDirectoryPath, close) {
  // createReadStream
  //   fs.createReadStream(zipFilePath)
  //     .pipe(unzip.Extract({ path: extractToDirectoryPath }))
  //     .on("close", function (err) {
  //       close(err);
  //     });

  fs.createReadStream(zipFilePath).pipe(
    unzip
      .Extract({
        path: extractToDirectoryPath,
      })
      .end(() => {
        console.log('wirete end....')
        close();
      })
  );
};
