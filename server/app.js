"use strict";

let assert = require('assert');
let xml2js = require('xml2js');//use to wechat moudle
let https = require('https');
let http = require("http");
let fs = require('fs');
let express = require('express');
let app = express();
//let location = require('./location.js').location;
let EventProxy = require('eventproxy');
let wechat = require('wechat');
//let session = require('./session.js').session;
let MongoClient = require('mongodb').MongoClient;
let WechatAPI = require('wechat-api');

//全局路由
app.use(function (req, res, next) {
    //debug req mothed
    console.log("req.path: ", req.path);
    console.log("req.query: ", req.query);
    //console.log("req.url: ", req.url);

    //define req.data use by next middleware
    req.data = {};
    req.data.sid = req.query.sid || 0;

    next();
});

//静态路由
app.use('/iot/weapp', express.static('./'));
//app.use('/admin', express.static('admin'));

//管理界面 API 路由
//let routerAdmin = require('./admin.js').setRouter(express.Router());
//app.use('/admin', initDb('mongodb://travel:daydayUp@localhost:30000/trip'), routerAdmin);

let routerIoT = require('./iot.js').setRouter(express.Router());
app.use('/iot', initDb('mongodb://iot:alwaysPrepare@localhost:30000/iot'), routerIoT);


//---------------------------------------------------------------------------------------
const options = {
    key: fs.readFileSync('./ssl/214230172760996.key'),
    //ca: [fs.readFileSync('./ca/ca.crt')],
    cert: fs.readFileSync('./ssl/214230172760996.pem')
};
const port = 443;
let server = https.createServer(options, app);
server.listen(port, function () {
    console.log('https server is running on port ', port);
});

http.createServer(app).listen(80, ()=>{
   console.log('http server is running on port 80');
});


//---------------------------------------------------------------------------------------
/**
 * promise pip log
 * @param res
 * @returns {Promise}
 */
function log(res) {
    return new Promise(function (resolve, reject) {
        console.log(res);
        resolve(res);
    });
}

/**
 * middleware for mongodb
 * @param dbUrl
 * @returns {Function}
 */
function initDb(dbUrl) {
    return function (req, res, next) {
        MongoClient.connect(dbUrl, function (err, db) {
            assert.equal(null, err);
            //req.db = db;//deprecated
            req.data.db = db;//approve
            next();
        });
    };
}