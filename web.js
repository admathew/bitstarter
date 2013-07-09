var express = require('express');
var fs = require('fs'); 

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
//  response.send('Hello World 2!');
 if (fs.existsSync('index.html')) {
      var buf =  fs.readFileSync('index.html');
	response.send(buf.toString());	
 } else {
	response.send("Could not read ndex.html");
 }

 	
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
