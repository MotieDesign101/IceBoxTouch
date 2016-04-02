var express = require('express');
var app = express();
var path = require('path');
var bonjour = require('bonjour')();

bonjour.find({
    type: 'http'
  }, function(service) {
    console.log(JSON.stringify(service.host));
    if (service.name == 'IceBox') {
      app.get('/serviceip', function(req, res) {
        res.json({ ip: service.host })
      });
      app.listen(8082);
    }
  });

  app.get('/', function(req, res) {
    app.use(express.static('./images'));
    res.sendFile(path.join(__dirname + '/test.html'));
  });
