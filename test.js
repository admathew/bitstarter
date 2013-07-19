#!/usr/bin/env node

var program = require('commander');
var rest = require('restler');

//rest.get(apiurl).on('complete', response2console);
function showresult(url) {
	rest.get(url).on('complete',function(result){
		if(result instanceof Error) {
			console.log("Error reading url: " + url);
		} else {
			console.log(result);
		}

	})
}

if(require.main == module) {
	//console.log("command");
	program
		.option('-u, --url <url>','URL to check ')
		.parse(process.argv);
		if (program.url){
			showresult(program.url)
		}
} else {
	console.log("module");
}

