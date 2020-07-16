//身份认证脚本
var passport = require("./modules/passport.js")
//用户信息脚本
var userInfo = require("./modules/userInfo.js")
//全局工具类
var appG = require("./modules/appGlobal.js")
//md5加密
var md5 = require("./modules/md5.js")
//md5加密
var router = require("./modules/router.js")
//var md5 = require("./modules/cryptojs/lib/MD5.js")

App({
  onLaunch: function(opt) {
    if(opt.query.store_id != undefined){
      var result = {
        store_id: opt.query.store_id,
        bar_counter_id: opt.query.bar_counter_id == undefined ? 0 : opt.query.bar_counter_id
      }
      userInfo.methods.setStore(result)
    }

    //检查登录态是否过期
    passport.checkSession(() => {})
  },
  //全局变量
  data: {
    //底部选中索引
    btIndex: 0,
    //用户信息
    userInfo: userInfo
  }
})