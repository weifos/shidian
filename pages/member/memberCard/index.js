var api = require("../../../modules/api.js")
var user = require("../../../modules/userInfo.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      card_no: '',
      card_img_url: '/images/card.png',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.api_106() 
    let wxUser = user.methods.getUser()
    this.setData({
      ['userInfo']: wxUser
    })
  },

  /**
      * 加载用户信息
      */
  api_106: function () {
    let that = this
    let userInfo = user.methods.getUser()
    console.log("openid:" + userInfo.openid)
    api.post(api.api_106,
      api.getSign({
        OpenID: userInfo.openid
      }),
      function (app, res) {
        if (res.data.Basis.State == api.state.state_200) {
          user.methods.login(res.data.Result)
          // router.goUrl({
          //   url: '../index/index'
          // })
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