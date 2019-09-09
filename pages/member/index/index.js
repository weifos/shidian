var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var passport = require("../../../modules/passport.js")
var user = require("../../../modules/userInfo.js")
var router = require("../../../modules/router.js")
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    userInfo: {
      id: 0, 
      nick_name: '未设置',
      login_name: '未登录',
      headimgurl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg',
    },
    list1: [{
        "name": "我的会员",
        "icon": "member"
      },
      {
        "name": "付款码",
        "icon": "paycode"
      },
      {
        "name": "我的活动",
        "icon": "activity"
      },
      {
        "name": "我的积分",
        "icon": "integral"
      }
    ],
    list2: [{
        "name": "购买记录",
        "icon": "buy",
        "url": ""
      },
      {
        "name": "我的钱包",
        "icon": "wallet",
        "url": ""
      },
      {
        "name": "我的优惠券",
        "icon": "ticket",
        "url": ""
      },
      {
        "name": "在线客服",
        "icon": "service",
        "url": ""
      },
      {
        "name": "退出登录",
        "icon": "loginout",
        "url": ""
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    //检测成功回调
    passport.checkSession(function(openid) {
      let wxUser = user.methods.getUser()
      if (!wxUser.login_name) {
        //加载用户信息
        that.api_106()
      } else {
        that.bindUser(wxUser)
      }
    })
  },
  /**
   * 获取手机号码
   */
  getMobile: function(e) {
    let that = this
    passport.bindMobile(e, function(code, user) {
      if (code == api.state.state_200) {
        that.setData({
          isLogin: true
        })
        that.setData({
          ['userInfo.login_name']: appG.util.getHideMobile(user.login_name)
        })
      }

      wx.getStorage({
        key: 'returl',
        success(res) {
          if (res.data) {
            router.goUrl({
              url: res.data
            })
          }
          wx.removeStorageSync('returl')
        }
      })
    })
  },
  /**
   * 加载微信用户信息
   */
  getWxUser: function(e) {
    let that = this
    passport.getWxUser(e, function(code, user) {
      if (code == api.state.state_200) {
        that.setData({
          ['userInfo.img']: appG.util.getHideMobile(user.avatarUrl)
        })
      }
    })
  },
  /**
   * 加载微信用户信息
   */
  bindUser: function(user) {
    this.setData({
      ['userInfo.login_name']: appG.util.getHideMobile(user.login_name)
    })
  },
  /**
   * 加载用户信息
   */
  api_106: function() {
    let that = this
    let userInfo = user.methods.getUser()
    console.log("openid:" + userInfo.openid)
    wx.post(api.api_106,
      wx.GetSign({
        OpenID: userInfo.openid
      }),
      function(app, res) {
        if (res.data.Basis.State == api.state.state_200) {
          if (res.data.Result.login_name != undefined) {
            //登录
            user.methods.login(res.data.Result)
            //绑定用户
            that.bindUser(res.data.Result)
          } else {
            //弹出手机号码授权
            that.setData({
              isLogin: false
            })
          }
        } else {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        }
      })
  },
  /**
   * 打开微信付款码
   */
  openOfflinePayView: function() {
    wx.openOfflinePayView({
      appId: $this.wechatpay.appId,
      timeStamp: $this.wechatpay.timestamp,
      nonceStr: $this.wechatpay.nonceStr,
      package: $this.wechatpay.package,
      signType: $this.wechatpay.signType,
      paySign: $this.wechatpay.paySign,
      success: function(res) {

      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    })
  },
  /**
   * 菜单跳转
   */
  goUrl: function(e) {
    //跳转地址
    let url = ''
    let key = e.currentTarget.dataset.key
    switch (key) {
      //购买记录
      case "buy":
        url = '../memberWallet/index?id=' + key
        break;
        //我的钱包
      case "wallet":
        url = '../memberWallet/index?id=' + key
        break;

      default:
        break;
    }

    if (url.length > 0) {
      router.goUrl({
        url: url
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})