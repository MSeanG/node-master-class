/*
 * Primary file for the API
 *
 */

// Dependencies
var http = require('http');

var url = require('url');

// Server should respond to all requests with a string
var server = http.createServer(function (req, res) {
    // Get URL and parse it
    var parsedUrl = url.parse(req.url, true);
  
    // Get URL path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get headers as an object
    var headers = req.headers;
  
    // Send response
    res.end('Hello there.\n');

    // Log request
    //console.log('Request received on path: ' + trimmedPath + ' with method: ' + method + ' and with these query string parameters', queryStringObject);
    console.log('Request recieved with these headers: ', headers);
});

// Start server and have it listen on port 3000
server.listen(3000, function () {
  console.log('Listening on port 3000');
});
