var api = require("./api.js")
var app_g = require("./appGlobal.js")
var WXBizDataCrypt = require('./WXBizDataCrypt.js')
var user = require("./userInfo.js")

module.exports = {

  /**
   * 检查登录态是否过期
   */
  checkSession(func) {
    let that = this
    //获取用户信息
    let userInfo = user.methods.getUser()
    //检查登录
    wx.checkSession({
      //未过期
      success() {
        wx.getSetting({
          success: res => {
            if (!wx.getStorageSync('session_key') || !userInfo.openid) {
              that.wxLogin(func)
            } else {
              func(userInfo.openid)
            }
          },
          fail: res => {
            console.log(res, "失败回调")
          }
        })
      },
      //已经过期
      fail() {
        that.wxLogin(func)
      }
    })
  },

  /**
   * 用户数据初始化
   */
  wxLogin(func) {
    let wxuser = user.methods.getUser()
    wx.login({
      //调用接口获取登录凭证（code），包含openid，session_key
      success: function (res) {
        if (res.code) {
          let store = user.methods.getStore()
          let store_id = 0
          if(store != null){
            store_id = store.store_id
          }
           
          api.post(api.api_103, api.getSign({
            Code: res.code,
            StoreId: store_id
          }), function (app, res) {
            if (res.data.Basis.State == api.state.state_200) {
              //session_key 写入缓存
              wx.setStorage({
                key: "session_key",
                data: res.data.Result.session_key
              })
              wxuser.openid = res.data.Result.openid
              user.methods.login(wxuser)
              func(res.data.Result.openid)
            } else {
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                duration: 3000
              })
            }
          })
        }
      }
    })
  },

  /**
   * 绑定手机号码
   */
  bindMobile: function (e, func) {
    var this_ = this
    var userInfo = user.methods.getUser()
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      //小程序appId
      let appId = wx.getAccountInfoSync().miniProgram.appId
      //解密数据
      var pc = new WXBizDataCrypt(appId, wx.getStorageSync('session_key'))
      //获取手机号码数据包
      var wx_result = pc.decryptData(e.detail.encryptedData, e.detail.iv)
      //获取手机号码
      var mobile = wx_result.phoneNumber
      //请求服务器
      api.post(api.api_104,
        api.getSign({
          OpenID: userInfo.openid,
          Mobile: mobile
        }),
        function (app, res) {
          if (res.data.Basis.State == api.state.state_200) {
            userInfo = res.data.Result
            user.methods.login(userInfo)
            wx.showToast({
              title: res.data.Basis.Msg,
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.data.Basis.Msg,
              icon: 'none',
              duration: 3000
            })
          }
          func(res.data.Basis.State, userInfo)
        })
    }
  },
  /**
   * 获取小程序用户信息
   */
  getWxUser(e, func) {
    let that = this
    var userInfo = user.methods.getUser()
    if (e.detail.errMsg == 'getUserInfo:ok') {
      var wxuser = {}
      wxuser.openid = userInfo.openid
      wxuser.headimgurl = e.detail.userInfo.avatarUrl
      wxuser.nickname = e.detail.userInfo.nickName
      wxuser.nickname = wxuser.nickname.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5|,]+/g, "*")
      //wxuser.nickname = encodeURI(wxuser.nickname)
      wxuser.language = e.detail.userInfo.language
      wxuser.country = e.detail.userInfo.country
      wxuser.province = e.detail.userInfo.province
      wxuser.city = e.detail.userInfo.city
      wxuser.sex = e.detail.userInfo.gender
      api.post(api.api_105, api.getSign({
          WeChatUser: wxuser
        }),
        function (app, res) {
          if (res.data.Basis.State == api.state.state_200) {
            userInfo.img = wxuser.headimgurl
            userInfo.nickname = decodeURI(wxuser.nickname)
            user.methods.login(userInfo)
            wx.showToast({
              title: res.data.Basis.Msg,
              duration: 2000
            })

          } else {
            wx.showToast({
              title: res.data.Basis.Msg,
              icon: 'none',
              duration: 3000
            })
          }
          func(res.data.Basis.State, e.detail.userInfo)
        })
    }
  },

  /**
   * 用户授权页面
   */
  toAuth() {
    wx.redirectTo({
      url: '../../passport/authorize/authorize'
    })
  }

}