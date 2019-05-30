/*
 * Primary file for API
 *
 */

// Dependencies
var http = require( 'http' );
var url = require( 'url' );
var StringDecoder = require( 'string_decoder' ).StringDecoder;
var config = require( './config' );

// Server should respond to all requests with a string
var server = http.createServer( function( req, res ) {
    // Get URL and parse it
    var parsedUrl = url.parse( req.url, true );

    // Get URL path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace( /^\/+|\/+$/g, '' );

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get headers as an object
    var headers = req.headers;

    // Get the payload if any
    var decoder = new StringDecoder( 'utf-8' );
    var buffer = '';
    req.on( 'data', function( data ){
        buffer += decoder.write( data );
    });
    req.on( 'end', function(){
        buffer += decoder.end();

        // Choose handler this request should go to. if one isn't found, use notFound handler
        var chosenHandler = typeof( router[ trimmedPath ] ) !== 'undefined' ? router[ trimmedPath ] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };
    });

    // Log request path
    console.log( 'Request recieved with this payload: ', buffer );
});

// Start server
server.listen( config.port, function() {
    console.log( 'Listening on port ' + config.port + ' in ' + config.envName + ' mode' );
});

// Define handlers
var handlers = {};

// Sample handler
handlers.sample = function ( data, callback ) {
    // Callback an http status code, and a payload object
    callback( 406, { 'name' : 'sample handler' } );
};

// Handler not found
handlers.notFound = function ( data, callback ) {
    callback( 404 );
};

// Define a request router
var router = {
    'sample' : handlers.sample
};
