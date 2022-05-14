const http = require('http');
let port = process.env.PORT || 8080
http.createServer(function (req, res) {
    console.log("Url: " + req.url);

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('' +
        '<script src="https://telegram.org/js/telegram-web-app.js"></script>' +
        '<!--suppress JSUnresolvedVariable -->' +
        '<button onclick="window.Telegram.WebApp.sendData(\'kajdfhkjhk\')">жми</button>'
    );
    res.end();
}).listen(port);