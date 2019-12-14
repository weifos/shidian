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
  },


  /**
   * 生成二维码
   */
  createQRCode(no) {
    new QRCode('myQrcode', {
      text: no,
      width: 180,
      height: 180,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path)
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
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