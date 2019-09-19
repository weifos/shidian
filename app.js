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
  onLaunch: function() {
    //检查登录态是否过期
    passport.checkSession(() => {})
  },
  data: {
    userInfo: userInfo
  }
})

/**
 * 全局提交方式
 */
wx.post = function(url, data, cb, ch) {
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
        //当前页面路径
        var returl = appG.util.getUrl()
        //存储到缓存
        wx.setStorageSync("returl", returl)
        router.goUrl({
          url: "/pages/member/index/index?backUrl=" + returl,
        })
      } else {
        cb(this, res)
      }
    },
    fail: (res) => {
      setTimeout(function() {
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
wx.GetSign = function(obj = {}) {

  //获取token,变量解构
  let {
    token
  } = userInfo.methods.getUser()

  function sort(obj) {

    if (obj instanceof Array) {
      //如果数组里面存放的为对象,通过map更改数组结构，排序
      obj = obj.map((ele, index) => {
        if (ele instanceof Object) {
          var newObj = {}
          Object.keys(ele).sort().forEach(function(key) {
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
    //默认情况下，对字符串排序，是按照ASCII的大小比较的，现在，我们提出排序应该忽略大小写，按照字母序排序。要实现这个算法，
    //不必对现有代码大加改动，只要我们能定义出忽略大小写的比较算法就可以
    Object.keys(obj).sort((s1, s2) => {
      let x1 = s1.toUpperCase()
      let x2 = s2.toUpperCase()
      if (x1 < x2) {
        return -1
      }
      if (x1 > x2) {
        return 1
      }
      return 0
    }).forEach(function(key) {
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