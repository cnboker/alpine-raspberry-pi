var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;
//write console.log to debug.log file
console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;