var user = require("../../../modules/userInfo.js")
var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var passport = require("../../../modules/passport.js")
var router = require("../../../modules/router.js")
import QRCode from '../../../modules/weapp-qrcode.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    checkIndex: -1,
    scrollLeft: 0,
    user_code: 0,
    balance: 0,
    serial_no: '',
    amount: '',
    timer: {
      setInter: '',
      num: 0
    },
    tabData: [{
        title: "我的钱包",
        list: []
      },
      {
        title: "付款码",
        list: []
      }
    ]
  },
  bindAmountInput: function(e) {
    this.setData({
      amount: e.detail.value
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /**
   * 选择充值
   */
  rechargeSelect(e) {
    this.setData({
      checkIndex: e.currentTarget.dataset.id
    })
  },

  /**
   * 选择充值
   */
  selectInput(e) {
    let that = this
    console.log(that.data.tabData[0].list.length)
    this.setData({
      checkIndex: that.data.tabData[0].list.length
    })
  },

  /**
   * 电子钱包
   */
  goConsumeList() {
    router.goUrl({
      url: '../../member/consumeList/index'
    })
  },

  /**
   * 绑定储值卡
   */
  goTicketBind() {
    router.goUrl({
      url: '../../member/ticketBind/index'
    })
  },

  /**
   * 立即充值
   */
  goRecharge() {
    let that = this
    if (this.data.checkIndex == that.data.tabData[0].list.length) {
      if (!appG.verifyStr.isLGZeroPrice(that.data.amount)) {
        wx.showToast({
          title: '充值金额范围1至10000',
          icon: 'none',
          duration: 3000
        })
        return
      }
    }

    if (this.data.checkIndex == -1) {
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none',
        duration: 3000
      })
      return
    }

    let item = that.data.tabData[0].list[that.data.checkIndex]
    api.post(api.api_331,
      api.getSign({
        ID: item == undefined ? 0 : item.id,
        Amount: that.data.amount == '' ? 0 : that.data.amount
      }),
      function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {

          that.setData({
            serial_no: res.data.Result.serial_no
          })

          //微信支付
          wx.requestPayment({
            appId: res.data.Result.wechatpay.appId,
            timeStamp: res.data.Result.wechatpay.timeStamp,
            nonceStr: res.data.Result.wechatpay.nonceStr,
            package: res.data.Result.wechatpay.package,
            signType: res.data.Result.wechatpay.signType,
            paySign: res.data.Result.wechatpay.paySign,
            success: function(res) {
              if (res.errMsg = "requestPayment:ok") {
                that.api_332()
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
      })

  },

  /**
   * 加载充值列表
   */
  api_330: function() {
    var that = this;
    api.post(api.api_330, api.getSign(), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        that.setData({
          ['tabData[0].list']: res.data.Result.recharges
        })
        user.methods.login(res.data.Result.user)
        that.setData({
          balance: res.data.Result.user.balance
        })
      }
    })
  },

  /**
   * 立即充值
   */
  api_331(e) {
    let that = this
    if (this.data.checkIndex == -1) {
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none',
        duration: 3000
      })
      return
    }

    let item = that.data.tabData[0].list[that.data.checkIndex]
    api.post(api.api_331,
      api.getSign({
        ID: item.id
      }),
      function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {

          that.setData({
            serial_no: res.data.Result.serial_no
          })

          //微信支付
          wx.requestPayment({
            appId: res.data.Result.wechatpay.appId,
            timeStamp: res.data.Result.wechatpay.timeStamp,
            nonceStr: res.data.Result.wechatpay.nonceStr,
            package: res.data.Result.wechatpay.package,
            signType: res.data.Result.wechatpay.signType,
            paySign: res.data.Result.wechatpay.paySign,
            success: function(res) {
              if (res.errMsg = "requestPayment:ok") {
                that.api_332()
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
      })
  },

  /**
   * 完成充值
   */
  api_332: function() {
    var that = this;
    api.post(api.api_332, api.getSign({
      No: that.data.serial_no
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) { 
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        // if (getCurrentPages().length != 0) {
        //   getCurrentPages()[getCurrentPages().length - 1].onLoad()
        // }
        router.goUrl({
          url: '../../member/index/index'
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    //优惠券
    // let cid = 0
    // if (opt.cid != undefined) {
    //   cid = opt.cid
    // }
    // //获取用户信息
    // let _user = user.methods.getUser()
    // this.setData({
    //   user_code: _user.user_id + '#' + cid + '#'
    // })

    // this.createQRCode(this.data.user_code)
    // this.startSetInter()
    //加载充值项目
    this.api_330()
  },

  /**
   * 开始计时器
   */
  startSetInter: function() {
    let that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function() {
        let numVal = that.data.timer.num + 1
        if (numVal > 30) {
          numVal = 0;
          that.createQRCode(that.data.user_code)
        }
        that.setData({
          ['timer.num']: numVal
        });
      }, 1000);
  },

  /**
   * 开始计时器
   */
  endSetInter: function() {
    let that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },

  /**
   * 生成二维码
   * 用户ID#优惠券ID#时间戳
   */
  createQRCode(str) {
    //时间戳
    let time_ticket = new Date().getTime()
    console.log(str + time_ticket)

    new QRCode('myQrcode', {
      text: str + time_ticket,
      width: 200,
      height: 200,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path)
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
      }
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