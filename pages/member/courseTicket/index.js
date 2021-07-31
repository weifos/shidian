var router = require("../../../modules/router.js")
import QRCode from '../../../modules/weapp-qrcode.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseTicket: 0,
    checkPayInter: null,
    timer: {
      setInter: '',
      num: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    //当前课程票据
    var course_str = wx.getStorageSync('course_ticket')
    var item = JSON.parse(course_str)
    this.setData({ courseTicket: item })
    //创建付款码
    this.createQRCode(item.ticket)
    //打开页面一秒后刷新下付款，兼容华为手机
    setTimeout(() => {
      this.createQRCode(item.ticket)
      this.startSetInter()
    }, 1000)
  },

  /**
   * 开始计时器
   */
  startSetInter: function () {
    let that = this
    //将计时器赋值给setInter
    that.data.setInter = setInterval(() => {
      let numVal = that.data.timer.num + 1
      if (numVal > 60) {
        numVal = 0
        that.createQRCode(that.data.courseTicket.ticket)
      }
      that.setData({
        ['timer.num']: numVal
      })
    }, 1000)
  },

  /**
   * 选择优惠券
   */
  selectTicket: function () {
    router.goUrl({
      url: '../ticketList/index?s=1&isPayCode=true'
    })
  },

  /**
   * 生成二维码
   * 用户ID#优惠券ID#时间戳
   */
  createQRCode(str) {
    //时间戳
    let time_ticket = new Date().getTime()
    new QRCode('myQrcode', {
      text: str + '_' + time_ticket,
      width: 180,
      height: 180,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path)
      }
    })
  },

  /**
   * 查看会员码
   */
  goMemberCode: function () {
    router.goUrl({
      url: '../memberCode/index'
    })
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
    clearInterval(this.data.checkPayInter)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})