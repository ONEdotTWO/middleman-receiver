var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* Receive SMS */
router.get('/', function (req, res) {
    // Connect to the db and submit change
    MongoClient.connect("mongodb://onedottwo:maIts5yUb5Thac@ds031531.mongolab.com:31531/middleman", function (err, db) {
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
    res.json({
        status: "received",
        sms: {
            to: req.query.to,
            from: req.query.from,
            message: req.query.content,
            keyword: req.query.keyword,
            msg_id: req.query.msg_id
        }
    });
});

module.exports = router;
