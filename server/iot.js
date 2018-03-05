/**
 * create by yy710
 * @param router
 * @returns {*}
 */


const net = require('net');
const server = net.createServer();

let container = new Map();
// 'connection' listener
server.on('connection', (socket) => {
    //debug
    console.log(socket);

    server.getConnections((err, counts) => console.log("client connected, total counts: ", counts));

    socket.on('end', () => {
        console.log('client disconnected');
        container.delete("key0");
    });

    socket.on('data', (data) => {
        let res = data.toString();
        console.log("recived: ", res);
        if (res.includes("end")) socket.end();

        //check heartPacket, update stateMeching to mongoDB


        //get keyID then add to stack

    });

    socket.on('error', (err)=>{
        console.log(err);
        container.delete("key0");
    });

    socket.write('hello\r\n');
    container.set("key0", socket);
    //socket.pipe(socket);

});

server.on('error', (err) => {
    throw err;
});

server.listen(8124, () => {
    console.log('TCP server is running on port 8124');
});

//****************************************************************


let wechat = require('wechat');
const nengzhuConfig = {
    token: 'nengzhuIoT',
    //appid: 'wx8cdc02fdb60db8ed',
    //appsecret: '54a427d0eebeeba112a2a2015f27b512'
    appid: 'wx2b31185490a27e64',
    appsecret: '7d7cab5a3cae63a80c98dc3267843fa2'
};

exports.setRouter = function (router) {

    let _router = router;

    //_router.use('/weapp', express.static('./'));

    _router.use('/weapp', wechat(nengzhuConfig, (req, res, next)=>{}));

    /**
     * nengzhu IoT wechat server auth
     */
    _router.use('/wechat', wechat(nengzhuConfig, function (req, res, next) {
        // 微信输入信息都在req.weixin上
        const message = req.weixin;
        let db = req.data.db;
        //res.reply("auth ok!");
        console.log("req.weixin: ", message);//debug

        if (message.MsgType === "event") {
            if (message.Event === "CLICK") {
                switch (message.EventKey) {
                    case 'openKey':
                        db.collection("wechatkey")
                            .updateOne({keyid: 0}, {$set: {on: true}}, {upsert: false, w: 1})
                            .then(r => {
                                container.get("key0").write("open\n");
                                res.reply("开锁成功！");
                            })
                            .catch(r => res.reply("开锁失败！"));
                        break;
                    case 'closeKey':
                        db.collection("wechatkey")
                            .updateOne({keyid: 0}, {$set: {on: false}}, {upsert: false, w: 1})
                            .then(r => {
                                container.get("key0").write("close\n");
                                res.reply("锁已关闭！");
                            })
                            .catch(r => res.reply("操作失败！"));
                        break;
                    case 'keyStatus':
                        db.collection("wechatkey")
                            .findOne({keyid: 0})
                            .then(doc => res.reply(doc.on))
                            .catch(err => res.reply("操作失败！"));
                        break;
                }
            }
        }
    }));

    _router.use('/setKey', (req, res, next) => {

        let db = req.data.db;

        db.collection("wechatkey")
            .findOne({keyid: 0})
            .then(doc => res.send(doc.on))
            .catch(err => res.send("error"));

    });

    return _router;
};
