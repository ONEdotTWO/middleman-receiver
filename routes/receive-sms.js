var express = require('express');
var router = express.Router();

/* Receive SMS */
router.post('', function(req, res) {
  res.json({ status: "received", sms : {
    to : req.query.to,
    from : req.query.from,
    message : req.query.content,
    keyword : req.query.keyword,
    msg_id : req.query.msg_id
  }});
});

module.exports = router;
