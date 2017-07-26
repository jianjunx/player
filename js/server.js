// http
let info = require('./songInfo');

let http = require('http').createServer;


let send = (request, response)=> {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    })
    response.write(info)
    response.end()
};

http(send).listen(8080);

