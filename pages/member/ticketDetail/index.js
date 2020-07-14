var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js") 
var router = require("../../../modules/router.js") 
import QRCode from '../../../modules/weapp-qrcode.js'
import barCode from '../../../modules/barcodeindex.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketInfo: {
      no: '',
      time: "2019-01-01-2091-06-01",
      condition: "满0.01元可用 ",
      shop: "厦门万象城店",
      range: "咖啡折扣券"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    this.setData({
      ['ticketInfo.no']: opt.no
    })

    this.createQRCode(opt.no)
    this.createBarCode(opt.no)
    setTimeout(() => {
      this.createQRCode(opt.no)
      this.createBarCode(opt.no)
    }, 1000)


    this.api_305(opt.no)
  },

  /**
   * 加载优惠券票据明细
   */
  api_305: function(no) {
    let that = this
      //请求接口数据
      api.post(api.api_305, api.getSign({
        No: no
      }), function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          res.data.Result.expiry_sdate = appG.util.date.dateFormat(res.data.Result.expiry_sdate, 'yyyy-MM-dd hh:mm')
          res.data.Result.expiry_edate = appG.util.date.dateFormat(res.data.Result.expiry_edate, 'yyyy-MM-dd hh:mm')
           
          that.setData({  ticketInfo: res.data.Result })
        }
      })
  },

  /**
   * 生成二维码
   */
  createQRCode(no) {
    new QRCode('ticketQrcode', {
      text: no,
      width: 180,
      height: 180,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => { 
      }
    })
  },

  /**
   * 生成条码
   */
  createBarCode(no) {
    barCode.barcode('barcode', no, 680, 150)
    //barCode.code128('barcode', no, 490, 80)
  },

  /**
   * 会员中心
   */
  goUrl() {
    router.goUrl({
      url: '../../member/index/index'
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