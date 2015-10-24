var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var querystring = require('querystring');
var http = require('http');

var logic_host = "ec2-52-17-7-182.eu-west-1.compute.amazonaws.com";
var mongoUser = "onedottwo";
var mongoPassword = "maIts5yUb5Thac";

/* Receive SMS */
router.get('/', function(req, res) {
  console.log('/receive-sms ENTER');

  var msg = querystring.stringify({
    'to': req.query.to,
    'from': req.query.from,
    'content': req.query.content,
    'msg_id': req.query.msg_id
  });

  console.log('  constructed msg');
  // Connect to the db and submit change
  MongoClient.connect("mongodb://" + mongoUser + ":" + mongoPassword
      + "@ds031531.mongolab.com:31531/middleman",
      function (err, db) {
    if (!err) {
      var collection = db.collection('messages');
      var document = {'to': req.query.to, 'from': req.query.from, 'message': req.query.content};
      collection.insert(document, {w: 1}, function (err, result) {
        if (err) {
          console.log("Couldn't send to database");
        }
      });
    } else {
      console.log("ERROR: Couldn't connect to remote mongo");
    }
  });
  
  var options = {
    hostname: logic_host,
    port: 5000,
    path: '/logic',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': msg.length
    }
  };

  var logic_req = http.request(options, function(res) {
    console.log("request to LOGIC completed: " + res);
  });
  
  logic_req.on("error", function(e) {
    console.log("error making request to LOGIC: " + e.message);
  });
  
  logic_req.write(msg);
  logic_req.end();

  res.json(msg);
});

module.exports = router;
