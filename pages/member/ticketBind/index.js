var api = require("../../../modules/api.js")
var router = require("../../../modules/router.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: '',
    psw: ''
  },


  /**
   * 绑定输入
   */
  onInput(e) {
    this.setData({
      ["no"]: e.detail.value
    })
  },

  /**
   * 绑定输入
   */
  pswInput(e) {
    this.setData({
      ["psw"]: e.detail.value
    })
  },

  /**
   * 加载订单数据
   */
  api_337: function() {
    let that = this
    //储值卡编号
    if (!that.data.no.length) {
      wx.showToast({
        title: '请输入储值卡编号',
        icon: 'none',
        duration: 3000
      })
      return
    }
    //储值卡密码
    if (!that.data.psw.length) {
      wx.showToast({
        title: '请输入储值卡密码',
        icon: 'none',
        duration: 3000
      })
      return
    }
 
    //请求接口数据
    api.post(api.api_337, api.getSign({
      No: that.data.no,
      Psw: that.data.psw
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
         
        router.goUrl({
          url: '../index/index'
        })
    
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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