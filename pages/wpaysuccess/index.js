var user = require("../../modules/userInfo.js")
var router = require("../../modules/router.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    paySuccess: {
      url: '',
      no: '--',
      balance: 0,
      point: 0,
      amount: 0,
      //0：微信支付，1：电子钱包支付
      type: 0,
      created_time: '--'
    },
    iconSuccess: '../../images/success.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //支付成功对象
    let data = user.methods.getPaySuccess()

    this.setData({
      paySuccess: data
    })
  },
  /**
    * 生命周期函数--监听页面加载
    */
  goUrl: function () {
    let that = this
    router.goUrl({
      url: that.data.paySuccess.url
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

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
  onShareAppMessage: function () { },
})
