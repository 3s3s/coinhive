'use strict';

const utils = require("./utils");

exports.handle = function(app)
{
    app.get('/', onMain);
    app.get('/auth', onAuth);
    app.get('/balance', onBalance);
}

function onMain(req, res)
{
    res.render('index');
}

function onAuth(req, res)
{
    const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://authedmine.com/authenticate.html?key=uL9bpLiA9CN0ohXna3YTPY4wiCB89JDu&domain=coinhive-kzv.c9users.io',
        }

    utils.postString("authedmine.com", 443, '/auth/', headers, 'auth&key=uL9bpLiA9CN0ohXna3YTPY4wiCB89JDu', (status) => {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(status));
    });
    
}

function onBalance(req, res)
{
    const options = {
        host: 'api.coinhive.com',
        port: 443,
        path: '/user/balance?name='+'test-user&secret='+'lCwAeF0d7E4mLRzMLnvqcqNlSfjSONd0',
        method: 'GET',
    };

    utils.getHTTP(options, (status, data) =>{
        res.writeHead(status, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    });
}
