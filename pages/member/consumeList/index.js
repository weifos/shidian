var api = require("../../../modules/api.js")
var user = require("../../../modules/userInfo.js")
var appGlobal = require("../../../modules/appGlobal.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 10,
    loading: false,
    loadComplete: false,
    list: []
  },

  /**
   * 加载订单数据
   */
  api_333: function() {
    let that = this
    //是否加载中
    let loading = that.data.loading
    //是否加载完成
    let loadComplete = that.data.loadComplete
    //是否加载中，是否加载完成
    if (!that.data.loading && !that.data.loadComplete) {
      //请求接口数据
      api.post(api.api_333, api.getSign({
        Size: that.data.pageSize,
        Index: that.data.pageIndex
      }), function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          that.data.loading = false
          that.data.pageIndex = that.data.pageIndex + 1
          res.data.Result.forEach(function(o, i) {
            that.data.list.push(o)
          })
 
          that.setData({
            list: that.data.list
          })
 
          //是否全部加载完毕
          if (res.data.Result.length == 0) {
            that.data.loadComplete = true
            wx.showToast({
              title: '加载完成',
              icon: 'success',
              duration: 3000
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.api_333()
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
    this.api_333()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})