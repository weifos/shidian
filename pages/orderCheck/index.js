var api = require("../../modules/api.js")
var appG = require("../../modules/appGlobal.js")
var user = require("../../modules/userInfo.js")
var router = require("../../modules/router.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {
      no: "653178123470509056",
      name: "摩卡咖啡*1 备",
      desc: "这里是订单备注的内容",
      details: []
    },
    //微信支付参数
    wechatPay: {

    },
    ticketInfo: [{
      key: "653178123470509056",
      name: "咖啡券",
      startTime: "2019-06-01",
      endTime: "2019-06-30",
      discount: "5",
      quota: "0.01"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    //console.log(opt.no) 
    this.api_317(opt.no)
  },

  //提交订单
  api_314() {

    //支付方式,微信浏览器里面默认微信支付
    let pay_method = 1
    if (app_g.util.isWeixinBrowser()) {
      //app里面默认微信app支付
      pay_method = 5
    }

    wx.post(
      app_g.api.api_314,
      wx.GetSign({
        Order: {
          //配送还是自提
          logistic_method: this.selectedTab ? 0 : 1,
          user_coupon_id: this.userCoupon.id,
          pay_method: pay_method
        },
        Products: this.products,
        AddressID: this.defaultAddress.id,
        IsShoppingCart: this.isShoppingCart
      }),
      function(vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          vue.$router.push({
            path: '/order/payOrder',
            query: {
              no: res.data.Result
            }
          })
        } else {
          vue.$vux.toast.text(res.data.Basis.Msg)
        }
      }
    )
  },

  /**
   * 微信小程序预支付订单
   */
  api_317(no) {
    let that = this
    wx.post(api.api_317,
      wx.GetSign({
        OrderNo: no
      }),
      function(vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //订单信息
          that.setData({
            orderInfo: res.data.Result.order
          })

          //支付参数加载是否正常
          if (res.data.Result.wechatpay_jsapi.State == api.state.state_200) {
            that.setData({
              wechatPay: JSON.parse(res.data.Result.wechatpay_jsapi.Data)
            })
          } else {
            wx.showToast({
              title: "支付加载失败",
              icon: 'none',
              duration: 2000
            })
          }

        } else {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        }
      }
    )
  },

  /**
   * 立即支付
   */
  goPay: function() {
    let that = this
    wx.requestPayment({
      'timeStamp': that.data.wechatPay.timestamp,
      'nonceStr': that.data.wechatPay.nonceStr,
      'package': that.data.wechatPay.package,
      'signType': that.data.wechatPay.signType,
      'paySign': that.data.wechatPay.paySign,
      'success': function(res) {},
      'fail': function(res) {},
      'complete': function(res) {}
    })
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