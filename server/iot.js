/**
 * create by yy710
 * @param router
 * @returns {*}
 */

let wechat = require('wechat');
const nengzhuConfig = {
    token: 'nengzhuIoT',
    appid: 'wx8cdc02fdb60db8ed',
    appsecret: '54a427d0eebeeba112a2a2015f27b512'
};

exports.setRouter = function (router) {

    let _router = router;

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
                            .then(r => res.reply("开锁成功！"))
                            .catch(r => res.reply("开锁失败！"));
                        break;
                    case 'closeKey':
                        db.collection("wechatkey")
                            .updateOne({keyid: 0}, {$set: {on: false}}, {upsert: false, w: 1})
                            .then(r => res.reply("锁已关闭！"))
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
