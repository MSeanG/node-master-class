/*
 * Primary file for API
 *
 */

// Dependencies
var http            = require( 'http' );
var https           = require( 'https' );
var url             = require( 'url' );
var StringDecoder   = require( 'string_decoder' ).StringDecoder;
var config          = require( './config' );
var fs              = require( 'fs' );

// Instantiate the HTTP server
var httpServer = http.createServer( function( req, res ) {
    unifiedServer( req, res );
});

// Start the HTTP server
httpServer.listen( config.httpPort, function() {
    console.log( 'Listening on port ' + config.httpPort );
});

// Instantiate the HTTPS server
var httpsServer = https.createServer( htttpsServerOptions, function( req, res ) {
    unifiedServer( req, res );
});

// Start the HTTPS server
var htttpsServerOptions = {
    'key' : fs.readFileSync( './https/key.pem' ),
    'cert' : fs.readFileSync( './https/cert.pem' )
};

httpsServer.listen( config.httpsPort, function() {
    console.log( 'Listening on port ' + config.httpsPort );
});

// All the server logic for both the http and https server
var unifiedServer = function( req, res ) {
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

    // Route the request to the handler specified in the router
    chosenHandler( data, function( statusCode, payload ) {
        // Use the status code called back by the handler, of default to 200
        statusCode = typeof( statusCode ) == 'number' ? statusCode : 200;

        // Use the payload called back by the handler, or default to an empty object
        payload = typeof( payload ) == 'object' ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify( payload );

        // Return response
        res.setHeader( 'Content-Type', 'application/json' );
        res.writeHead( statusCode );
        res.end( payloadString );

        // Log request path
        consonle.log( 'Returning this response: ', statusCode, payloadString );
    });
};

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
