var api = require("../../modules/api.js")
var appG = require("../../modules/appGlobal.js")
var user = require("../../modules/userInfo.js")
var router = require("../../modules/router.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId: "",
    balance: 0,
    //微信支付，还是电子钱包支付
    payType: 0,
    orderInfo: {
      course_name: '',
      serial_no: "",
      user_coupon_id: 0,
      coupon_amount: 0,
      vip_dis_amount: 0,
      actual_amount: 0,
      remarks: "",
      details: []
    },
    //微信支付参数
    wechatPay: {},
    ticketInfo: [{
      id: 0,
      key: "",
      name: "",
      startTime: "",
      endTime: "",
      discount: "",
      quota: ""
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    //跳转地址 
    this.api_327(opt.no)
  },

  /**
   * 选择优惠券
   */
  checkTicket: function() {

  },

  /**
   * 选择支付方式
   */
  checkedPay: function(e) {
    this.setData({
      payType: e.currentTarget.dataset.id
    })
  },

  /**
   * 微信小程序预支付订单
   */
  api_327(no) {
    let that = this
    let store = user.methods.getStore()
    api.post(api.api_327,
      api.getSign({
        OrderNo: no,
        StoreID: store.store_id
      }),
      function(vue, res) {
        if (res.data.Basis.State == api.state.state_200) {

          //订单信息
          that.setData({
            orderInfo: res.data.Result.order
          })

          that.setData({
            wechatPay: res.data.Result.wechatpay
          })

          user.methods.login(res.data.Result.user)
          that.setData({
            balance: res.data.Result.user.balance
          })

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
   * 电子钱包支付
   */
  api_335() {
    let that = this
    api.post(api.api_335,
      api.getSign({
        No: that.data.orderInfo.serial_no
      }),
      function(vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          setTimeout(function() {
            router.goUrl({
              url: '../member/orderCourseList/index?tid=' + that.data.orderInfo.type
            })
          }, 1000)
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
    //电子钱包支付
    if (that.data.payType == 1) {
      that.api_335()
    } else {
      wx.requestPayment({
        appId: that.data.wechatPay.appId,
        timeStamp: that.data.wechatPay.timeStamp,
        nonceStr: that.data.wechatPay.nonceStr,
        package: that.data.wechatPay.package,
        signType: that.data.wechatPay.signType,
        paySign: that.data.wechatPay.paySign,
        success: function(res) {
          if (res.errMsg = "requestPayment:ok") {
            //跳转地址 
            router.goUrl({
              url: '../member/orderCourseList/index?tid=' + that.data.orderInfo.type
            })
          }
        },
        fail: function(res) {
          //console.log(res)
        },
        complete: function(res) {
          //console.log(res)
        }
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