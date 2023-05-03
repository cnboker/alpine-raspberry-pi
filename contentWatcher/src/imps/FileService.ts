//const crypto = require("crypto");
const fs = require("fs");

type Message = {
  returnValue?: boolean;
  errorCode?: string;
  errorText?: string;
  payload?: any;
};

export const copyFile = (
  originalPath: string,
  copyPath: string
): Promise<Message> => {
  // createReadStream & createWriteStream
  var inputFile = fs.createReadStream(originalPath);
  var outputFile = fs.createWriteStream(copyPath);
  return new Promise((resolve, reject) => {
    // Error handling
    inputFile.on("error", function (err: string) {
      reject({
        returnValue: false,
        errorCode: "copyFile createReadStream ERROR",
        errorText: err,
      });
    });

    outputFile.on("error", function (err: string) {
      reject({
        returnValue: false,
        errorCode: "copyFile createWriteStream ERROR",
        errorText: err,
      });
    });

    // Do copy & End event
    inputFile.pipe(outputFile).on("close", function (err: string) {
      if (err) {
        reject({
          returnValue: false,
          errorCode: "copyFile createWriteStream ERROR",
          errorText: err,
        });
      } else {
        resolve({
          returnValue: true,
        });
      }
    });
  });
};

export const fileExists = (path: string): boolean => {
  let exists = false;
  try {
    if (fs.existsSync(path)) {
      console.log("The file exists.");
      exists = true;
    }
  } catch (err) {
    console.error(err);
  }
  return exists;
};

export const listFiles = (path: string): Promise<Message> => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, function (err: string, files: any) {
      if (err) {
        reject({
          returnValue: false,
          errorCode: "listFiles ERROR",
          errorText: err,
        });
      } else {
        resolve({
          returnValue: true,
          payload: files,
        });
      }
    });
  });
};

export const mkdir = (path: string): void => {
    fs.mkdirSync(path, { recursive: true })
};

export const rmdir = (path: string): Promise<Message> => {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, function (err: string) {
      if (err) {
        reject({
          returnValue: false,
          errorCode: "rmdir ERROR",
          errorText: err,
        });
      } else {
        resolve({
          returnValue: true,
        });
      }
    });
  });
};

export const moveFile = (
  originalPath: string,
  destinationPath: string
): Promise<Message> => {
  return new Promise((resolve, reject) => {
    fs.rename(originalPath, destinationPath, function (err: string) {
      if (err) {
        reject({
          returnValue: false,
          errorCode: "rename ERROR",
          errorText: err,
        });
      } else {
        resolve({
          returnValue: true,
        });
      }
    });
  });
};

export const resize = (path: string, width: number): Promise<Message> => {
  const resize = require("../utils/imageResize");
  return new Promise((resolve, reject) => {
    resize(path, width)
      .then(function (data: any) {
        resolve({
          returnValue: true,
          payload: data,
        });
      })
      .catch(function (err: string) {
        reject({
          returnValue: false,
          errorText: err,
        });
      });
  });
};

export const readFile = (
  path: string,
  encoding: string = "utf-8"
): Promise<Message> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, function (err: string, data: any) {
      if (err) {
        reject({
          returnValue: false,
          errorCode: "readFile ERROR",
          errorText: err,
        });
      } else {
        resolve({
          returnValue: true,
          payload: data,
        });
      }
    });
  });
};

export const removeFile = (path: string): Promise<Message> => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, function (err: string) {
      if (err) {
        reject({
          returnValue: false,
          errorCode: "removeFile ERROR",
          errorText: err,
        });
      } else {
        resolve({
          returnValue: true,
        });
      }
    });
  });
};

export const unzipFile = (
  zipFilePath: string,
  extractToDirectoryPath: string
): Promise<Message> => {
  var { unzip } = require("../utils/unzip");
  return new Promise((resolve, reject) => {
    unzip(zipFilePath, extractToDirectoryPath, function (err: string) {
      if (err) {
        reject({
          returnValue: false,
          errorText: err,
          path: zipFilePath + "," + extractToDirectoryPath,
        });
      } else {
        resolve({
          returnValue: true,
        });
      }
    });
  });
};

export const writeFile = (path: string, data: any): Promise<Message> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, function (err: string) {
      if (err) {
        reject({
          returnValue: false,
          errorCode: "writeFile ERROR",
          errorText: err,
        });
      } else {
        resolve({
          returnValue: true,
        });
      }
    });
  });
};
