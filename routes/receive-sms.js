var express = require('express');
var router = express.Router();
var http = require('http');

var logic_url_base = "http://ec2-52-17-7-182.eu-west-1.compute.amazonaws.com"

/* Receive SMS */
router.get('/', function(req, res) {

  var options = {
    hostname: logic_url_base,
    port: 5000,
    path: '/logic',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  http.request(options, function(res) {
    console.log("request to LOGIC completed: " + res);
  });

  res.json({ status: "received",
    sms : {
      to : req.query.to,
      from : req.query.from,
      message : req.query.content,
      keyword : req.query.keyword,
      msg_id : req.query.msg_id
    }
  });
});

module.exports = router;
