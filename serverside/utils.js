'use strict';

const http = require("http");
const https = require('http-debug').https;
const url = require('url');

https.debug = 0;


exports.getHTTP = function(options, onResult)
{
    console.log("rest::getJSON");

    const port = options.port || 80;
    const prot = port == 443 ? https : http;
    
    if (!options.method)
        options.method = 'GET';
    if (!options.headers)
        options.headers = {'Content-Type': 'application/json'};
        
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            if (options.headers['Content-Type'] == 'application/json')
            {
                try {
                    var obj = JSON.parse(output);
                    onResult(res.statusCode, obj);

                }catch(e) {
                    console.log(e.message);
                    onResult(res.statusCode, e);
                }
                
                return;
            }
            onResult(res.statusCode, output);
        });
    });

    req.on('error', function(err) {
        console.log(err.message)
        //res.send('error: ' + err.message);
    });

    req.end();
};


exports.postString = function(host, port, path, headers, strBody, callback) 
{
    const options = { 
        hostname: host, 
        port: port, 
        path: path, 
        method: 'POST', 
        headers: headers
    }; 
    
    var proto = port == 443 ? https : http;
        
    var req = proto.request(options, function(res) { 
        console.log('Status: ' + res.statusCode); 
        console.log('Headers: ' + JSON.stringify(res.headers)); 
        
        res.setEncoding('utf8'); 
        
		var res_data = '';
		res.on('data', function (chunk) {
			res_data += chunk;
		});
		res.on('end', function() {
			callback({status: true, 'data': res_data});
		});	
    }); 
    
    req.on('error', function(e) { 
        console.log('problem with request: ' + e.message); 
        callback({status: false, message: 'problem with request: ' + e.message});
    }); 
    
    // write data to request body 
    req.end(strBody);    
};
