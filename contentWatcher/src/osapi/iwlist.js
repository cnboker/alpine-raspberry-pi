var exec    = require("child_process").exec;

/*****************************************************************************\
    Return a function which is responsible for using "iwlist scan" to figure
    out the list of visible SSIDs along with their RSSI (and other info)
\*****************************************************************************/
module.exports = function(cmd_options, callback) {
    // Handle case where no options are passed in
    if (typeof(cmd_options) == "function" && typeof(callback) == "undefined") {
        callback    = cmd_options;
        cmd_options = "";
    }

    
    exec("iwlist wlan0 scan |  grep  'ESSID:'", function(error, stdout, stderr) {
        // Handle errors from running "iwlist scan"
        if (error) {
            return callback(error, output)
        }
        
        /* The output structure looks like this:
        ESSID:"aoruite"
        ESSID:"ChinaNet-52Wu"
        ESSID:"aoruite"
        ESSID:"\xE4\xBA\x94\xE6\x9D\xBF\xE9\x85\x92\xE4\xB8\x9A_5G"
        ESSID:"\xE4\xBA\x94\xE6\x9D\xBF\xE9\x85\x92\xE4\xB8\x9A"
        ESSID:"ChinaNet-tShh"
         */
        var output = []
        // Parse the result, build return object
        lines = stdout.split("\n");
        for (var idx in lines) {
            line = lines[idx].trim();
            if(line === 'ESSID:""')continue;
            output.push(line)
        }
        return callback(null, output);
    });

}

module.exports = function(ssid,pwd,callback){
    exec(`iwctl station wlan0 connect ${ssid} --passphrase ${pwd}`,(error,stdout,stderr)=>{
        if (error) {
            return callback(error, callback)
        }
        return callback(stdout,callback)
    })
}