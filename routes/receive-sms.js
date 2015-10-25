var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var http = require('http');

var logic_host = "ec2-52-17-7-182.eu-west-1.compute.amazonaws.com";

/* Receive SMS */
router.get('/', function(req, res) {
  console.log('/receive-sms ENTER');

  var msg = JSON.stringify({
    'to': req.query.to,
    'from': req.query.from,
    'content': req.query.content,
    'msg_id': req.query.msg_id
  });

  console.log('POST /logic with Body:');
  console.log(msg);

  console.log('  constructed msg');
  
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
