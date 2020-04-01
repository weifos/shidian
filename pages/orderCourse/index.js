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
    cid: 0,
    cname: '',
    tname: '',
    balance: 0,
    //微信支付，还是电子钱包支付
    payType: 0,
    //折扣金额
    discounts: 0,
    orderInfo: {
      course_name: '',
      serial_no: "",
      user_coupon_id: 0,
      coupon_amount: 0,
      vip_dis_amount: 0,
      actual_amount: 0,
      remarks: "",
      details: [],
      course:{
        is_use_coupon:false
      }
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

    //优惠券
    if (opt.cid != undefined && opt.cname != undefined && opt.tname != undefined) {
      this.setData({
        cid: opt.cid
      })
      this.setData({
        cname: opt.cname
      })

      this.setData({
        tname: opt.tname
      })
    }

    this.api_327(opt.no)
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
   * 加载订单信息
   */
  api_327(no) {
    let that = this
    api.post(api.api_327,
      api.getSign({
        OrderNo: no,
        UserCouponId: that.data.cid
      }),
      function(vue, res) {
        if (res.data.Basis.State == api.state.state_200) {

          //加载用户电子钱包余额
          user.methods.login(res.data.Result.user)
          that.setData({
            balance: res.data.Result.user.balance
          })

          let disAmount = 0
          let actual_amount = res.data.Result.order.actual_amount
          if (that.data.tname.indexOf('元') != -1) {
            disAmount = parseFloat(that.data.tname.replace('元'))
            res.data.Result.order.coupon_amount = disAmount
            res.data.Result.order.actual_amount = actual_amount - disAmount
          }

          if (that.data.tname.indexOf('折') != -1) {
            disAmount = parseFloat(that.data.tname.replace('折'))
            res.data.Result.order.coupon_amount = actual_amount * ((10 - disAmount) / 10).toFixed(2)
            res.data.Result.order.actual_amount = actual_amount - res.data.Result.order.coupon_amount
          }

          //订单信息
          that.setData({
            orderInfo: res.data.Result.order
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
        UserCouponId: that.data.cid,
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
   * 微信小程序支付课程订单
   */
  api_338(no) {
    let that = this
    api.post(api.api_338,
      api.getSign({
        OrderNo: that.data.orderInfo.serial_no,
        UserCouponId: that.data.cid
      }),
      function(vue, res) {
        if (res.data.Basis.State == api.state.state_200) {

          wx.requestPayment({
            appId: res.data.Result.wechatpay.appId,
            timeStamp: res.data.Result.wechatpay.timeStamp,
            nonceStr: res.data.Result.wechatpay.nonceStr,
            package: res.data.Result.wechatpay.package,
            signType: res.data.Result.wechatpay.signType,
            paySign: res.data.Result.wechatpay.paySign,
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
      that.api_338()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 选择优惠券
   */
  selectTicket: function() {
    router.goUrl({
      url: '../member/ticketList/index?s=1&m=4&sn=' + this.data.orderInfo.serial_no + '&amount=' + this.data.orderInfo.actual_amount
    })
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
    let that = this
    let path = getCurrentPages()[getCurrentPages().length - 1].route
    //用户中心订单列表过来
    if (path == 'pages/orderCourse/index') {
      router.goUrl({
        url: '../member/orderCourseList/index?tid=' + that.data.orderInfo.type
      })
    } else {
      router.goUrl({
        url: '../member/orderCourseList/index?tid=' + that.data.orderInfo.type
      })
    }
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