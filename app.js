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
  onLaunch: function () {
    //检查登录态是否过期
    passport.checkSession(() => { })
  },
  data: {
    userInfo: userInfo
  }
})

/**
 * 全局提交方式
 */
wx.post = function (url, data, cb, ch) {
  wx.showLoading({
    title: '请求中',
    mask: true
  });
  wx.request({
    url: url,
    data: data,
    method: "post",
    header: {
      //'content-type': methonType,
      //'token': requestHandler.token // 默认值
    },
    success: (res) => {
      wx.hideLoading()
      if (res.data.Basis != undefined && res.data.Basis.State == 205 || res.data.Basis.State == 211) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })

        //删除用户信息
        wx.removeStorageSync('user_info')
        var pages = appG.util.getUrl()
        wx.setStorageSync("returl", pages)
        router.goUrl({
          url: "/pages/user/index/index",
        })
      } else {
        cb(this, res)
      }
    },
    fail: (res) => {
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      wx.showToast({
        title: JSON.stringify(res),
        icon: 'none',
        duration: 3000
      })
      if (ch != undefined) {
        ch(err)
      }
    }
  })
}


//获取签名
wx.GetSign = function (obj = {}) {
  //获取token
  let {
    token
  } = userInfo.methods.getUser()

  function sort(obj) {

    if (obj instanceof Array) {
      //如果数组里面存放的为对象,通过map更改数组结构，排序
      obj = obj.map((ele, index) => {
        if (ele instanceof Object) {
          var newObj = {}
          Object.keys(ele).sort().forEach(function (key) {
            var o = ele[key]
            if (o instanceof Object) {
              o = sort(o)
            }
            newObj[key] = o
          })
          ele = newObj
        }
        return ele
      })
      return obj
    }

    var newObj = {}
    Object.keys(obj).sort().forEach(function (key) {
      var o = obj[key]
      if (o instanceof Object) {
        o = sort(o)
      }
      newObj[key] = o
    })
    return newObj
  }

  const sign_data = {
    Data: obj,
    Global: {
      IMEI: "",
      IMSI: "",
      IP: "",
      OS: 3,
      Sign: "",
      Token: token
    }
  }


  return {
    Data: obj,
    Global: {
      IMEI: "",
      IMSI: "",
      IP: "",
      OS: 3,
      Sign: md5.md5(JSON.stringify(sort(sign_data)) + ')(4AzEdr5J6a`@#$*%'),
      Token: token
    }
  }
}