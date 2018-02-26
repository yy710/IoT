'use strict';

/**
 * 初始化微信公众号API接口
 */
let WechatAPI = require('wechat-api');
let iotAPI = new WechatAPI('wx8cdc02fdb60db8ed', '54a427d0eebeeba112a2a2015f27b512');


/*
const util = require('util');
employeeAPI.getMenu(function (err, result) {
    console.log('result: %j', result);
});
*/


let menu = {
    "button": [
        {
            "type": "click",
            "name": "打开门锁",
            "key": "openKey"
        },
        {
            "type": "click",
            "name": "关闭门锁",
            "key": "closeKey"
        },
        {
            "type": "click",
            "name": "门锁状态",
            "key": "keyStatus"
        }
    ]
};

createMenu(iotAPI, menu);

//-----------------------------------------------------------------
function createMenu(api, menu){
    api.createMenu(menu, function(err, result){
        if(err)throw err;
        console.log(result);
    });
}