var express = require('express');
var app = express();
var path = require('path');
var bonjour = require('bonjour')();
var dgram = require('dgram');
var os = require('os');

var networkinterfaces = [];

bonjour.find({
  type: 'http'
}, function(service) {
  console.log(JSON.stringify(service.host));
  if (service.name == 'IceBox') {
    app.get('/serviceip', function(req, res) {
      res.json({
        ip: service.host
      })
    });
    app.get('/dostuff/:barcode', function(req, res) {
      var barcode = req.params.barcode;
      console.log(barcode);
      sendUdpMulticast(barcode);
    });
    app.listen(8082);
  }
});

app.get('/', function(req, res) {
  app.use(express.static('./images'));
  res.sendFile(path.join(__dirname + '/test.html'));
});


function sendUdpMulticast(barcode) {
  var interfaces = os.networkInterfaces();
  networkinterfaces = [];
  Object.keys(interfaces).forEach(function(ifname) {
    console.log(ifname);
    networkinterfaces.push(ifname);
  });
  buzz(0, barcode);
}

function buzz(i, barcode) {
  console.log("INTERAFACES:" + networkinterfaces.length);
  var message = createMessage(barcode);
  if (i < networkinterfaces.length) {
    sendMessage(message, networkinterfaces[i], function() {
      buzz(i + 1, barcode);
    });
  } else {

  }
}

function sendMessage(message, networkinterface, callback) {
  console.log(networkinterface);
  var dgramServer = dgram.createSocket('udp6');
  var destination = 'FF02::6006%' + networkinterface;
  console.log(destination);
  dgramServer.send(message, 0, message.length, 6006, destination, function(err, bytes) {
    if (err) {
      console.log("err when sending send UDP Message");
    }
    callback();
    dgramServer.close();
    console.log("server close");
  });
}

function createMessage(barcodex) {
  console.log(barcodex);
  var date = new Date();
  var dateString = date.getTime();
  var event = {
    eventtime: dateString,
    barcode: barcodex,
    eventtype: 'scan'
  };
  var message = new Buffer(JSON.stringify(event));
  //var message = new Buffer("door");
  console.log(message);
  return message;
}
