//身份认证脚本
var passport = require("./modules/passport.js")
//用户信息脚本
var userInfo = require("./modules/userInfo.js")
//版本更新对象
const updateManager = wx.getUpdateManager()
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
     
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    
  },
  //全局变量
  data: {
    //底部选中索引
    btIndex: 0,
    //用户信息
    userInfo: userInfo
  }
})