var http = require('http'),
    net = require('net'),
    httpProxy = require('http-proxy'),
    URL = require('url').URL,
    util = require('util');

var proxy = httpProxy.createServer();

var server = http.createServer(function (req, res) {
  console.log('A Receiving reverse proxy request for:' + req.url);
  var parsedUrl = new URL(req.url);
  var host = parsedUrl.hostname == 'blog.localdev' ? '192.168.33.10' : parsedUrl.hostname;
  var port = parsedUrl.hostname == 'blog.localdev' ? '3333' : '80';
  var target = parsedUrl.protocol + '//' + host + ':' + port;
  proxy.web(req, res, {target: target, secure: false});
}).listen(8213);

server.on('connect', function (req, socket) {
  console.log('B Receiving reverse proxy request for: ' + req.url)
  var host = req.url.split(':')[0]
  var port = req.url.split(':')[1]

  var srvSocket = net.connect(port, host, function() {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
    'Proxy-agent: Node-Proxy\r\n' +
    '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});

// curl -vv -x http://127.0.0.1:8213 http://192.168.33.10:3333
// chrome --proxy-server=http://127.0.0.1:8213  