

module.exports.unzip = function (zipFilePath, extractToDirectoryPath, close) {
  const fs = require("fs");
  const unzip = require("unzip-stream");
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
