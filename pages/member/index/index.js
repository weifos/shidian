var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var passport = require("../../../modules/passport.js")
var user = require("../../../modules/userInfo.js")
var router = require("../../../modules/router.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: true,
    refreshImg: '/images/icon/refresh.png',
    userInfo: {
      id: 0,
      nick_name: '未设置',
      login_name: '未登录',
      headimgurl: '/images/user.png',
      card_img_url: '/images/card.png',
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
      "name": "我的课堂",
      "icon": "activity"
    },
    {
      "name": "我的活动",
      "icon": "course"
    }
    ],
    list2: [
      {
        "name": "我的积分",
        "icon": "integral"
      },
      {
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
        "name": "我的优惠券（不与其他优惠叠加）",
        "icon": "ticket",
        "url": ""
      }
      // {
      //   "name": "在线客服",
      //   "icon": "service",
      //   "url": ""
      // },
      // {
      //   "name": "退出登录",
      //   "icon": "loginout",
      //   "url": ""
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let wxUser = user.methods.getUser()
    if (!wxUser.openid || !wxUser.token) {
      //检测成功回调
      passport.checkSession(function (openid) {
        wxUser = user.methods.getUser()
        if (!wxUser.login_name) {
          //加载用户信息
          that.api_106()
        } else {
          that.api_107()
        }
      })
    } else {
      that.api_107()
    }
  },

  /**
   * 获取手机号码
   */
  getMobile: function (e) {
    let that = this
    passport.bindMobile(e, function (code, user) {
      if (code == api.state.state_200) {
        that.setData({
          isLogin: true
        })
        that.setData({
          ['userInfo.login_name']: appG.util.getHideMobile(user.login_name)
        })
      }

      //自动登录成功后的回调地址
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

      router.goUrl({
        url: '../userInfo/index'
      })
    })
  },

  /**
   * 加载微信用户信息
   */
  getWxUser: function (e) {
    let that = this
    wx.getUserProfile({
      // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      desc: '用于完善会员资料',
      success: (e) => {
        passport.getWxUser(e, function (code, res_user) {
          if (code == api.state.state_200) {
            that.bindUser(res_user)
          }
        })
      }
    })
  },

  /**
   * 修改会员资料
   */
  goEdit: function () {
    router.goUrl({
      url: '../userInfo/index'
    })
  },

  /**
   * 加载微信用户信息
   */
  bindUser: function (user) {
    if (user.nickname) {
      this.setData({
        ['userInfo.nick_name']: user.nickname
      })
    }
    this.setData({
      ['userInfo.login_name']: appG.util.getHideMobile(user.login_name)
    })

    if (user.headimgurl) {
      this.setData({
        ['userInfo.headimgurl']: user.headimgurl
      })
    }

    //会员卡背景
    this.setData({
      ['userInfo.cardimgurl']: user.card_img_url
    })

    //等级名称
    if (user.card_name) {
      this.setData({
        ['userInfo.card_name']: user.card_name
      })
    } else {
      this.setData({
        ['userInfo.card_name']: '--'
      })
    }

    //过期时间
    if (user.expire_date) {
      this.setData({
        ['userInfo.expire_date']: user.expire_date
      })
    } else {
      this.setData({
        ['userInfo.expire_date']: '--'
      })
    }

  },

  /**
   * 加载用户信息
   */
  api_107: function () {
    let that = this
    api.post(api.api_107, api.getSign(),
      function (app, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //绑定用户
          that.bindUser(res.data.Result)
          user.methods.login(res.data.Result)
        }
      })
  },

  /**
   * 加载用户信息，刷新Token
   */
  api_106: function () {
    let that = this
    let userInfo = user.methods.getUser()
    api.post(api.api_106,
      api.getSign({
        OpenID: userInfo.openid
      }),
      function (app, res) {
        if (res.data.Basis.State == api.state.state_200) {
          if (res.data.Result.login_name != undefined) {
            //昵称
            res.data.Result.nickname = decodeURI(res.data.Result.nickname)
            //登录
            user.methods.login(res.data.Result)
            //绑定用户
            that.bindUser(res.data.Result)
            //如果存在重定向地址
            let returl = wx.getStorageSync("returl")
            if (returl != "") {
              wx.removeStorage({
                key: 'returl',
                success(res) { }
              })
              //重定向
              router.goUrl({
                url: returl,
              })
            }
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
  openOfflinePayView: function () {
    wx.openOfflinePayView({
      appId: $this.wechatpay.appId,
      timeStamp: $this.wechatpay.timestamp,
      nonceStr: $this.wechatpay.nonceStr,
      package: $this.wechatpay.package,
      signType: $this.wechatpay.signType,
      paySign: $this.wechatpay.paySign,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
    })
  },

  /**
   * 菜单跳转
   */
  goUrl: function (e) {
    //跳转地址
    let url = ''
    let key = e.currentTarget.dataset.key
    switch (key) {
      //购买记录
      case "buy":
        url = '../orderList/index'
        break
      //我的钱包
      case "wallet":
        url = '../memberWallet/index'
        break
      //会员码
      case "code":
        url = '../memberCode/index'
        break
      //付款码
      case "paycode":
        url = '../memberPayCode/index'
        break
      //我的活动
      case "activity":
        url = '../orderCourseList/index?tid=5'
        break
      //我的课程
      case "course":
        url = '../orderCourseList/index?tid=1'
        break
      //我的会员卡
      case "member":
        url = '../memberCard/index'
        break
      //我的积分
      case "integral":
        url = '../memberIntegral/index'
        break
      //我的优惠券
      case "ticket":
        url = '../ticketList/index'
        let tmp_arr = user.methods.getPushMsg()
        if (tmp_arr) {
          wx.requestSubscribeMessage({
            tmplIds: tmp_arr.coupons_tmp_ids,
            success(res) { }
          })
        }
        break

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
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})