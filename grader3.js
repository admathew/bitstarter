#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


var checkHtml = function(htmlString, checkJson){
    $ = htmlString;		
    var checks = checkJson.sort();
	var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
}

function processFile(file,checkJson){
	var html = cheerio.load(fs.readFileSync(assertFileExists(file)));
	processHtmlString(html,checkJson);
//	var out = checkHtml(html, checkJson);
//	var outJson = JSON.stringify(out, null, 4);
//    console.log(outJson);

}

function processUrl(url,checkJson) {
	rest.get(url).on('complete',function(result){
		if(result instanceof Error) {
			console.log("Error reading url: " + url);
			process.exit(1);
		} else {
			//return cheerio.load(result);
			processHtmlString(cheerio.load(result),checkJson);
		}

	})
}

function processHtmlString(html,checkJson){
	var out = checkHtml(html, checkJson);
        var outJson = JSON.stringify(out, null, 4);
     console.log(outJson);
}


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};
var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};
if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html')
 	.option('-u, --url <url>','URL to check ' )
        .parse(process.argv);
      var checks = loadChecks(program.checks);
//console.log(checks);
        if (program.file) {
			processFile(program.file, checks);
		} else {
			processUrl(program.url, checks);
		}

} else {
    exports.checkHtmlFile = checkHtmlFile;
}
