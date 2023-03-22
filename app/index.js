const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    switch (req.url) {
        case "/app.js":
            fs.readFile('app.js', function(err, data) {
                res.write(data);
                return res.end();
            });
            break
        default:
            fs.readFile('index.html', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            });
            break
    }
}).listen(5500);