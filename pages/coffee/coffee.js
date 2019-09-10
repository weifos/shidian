var api = require("../../modules/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    catgs: [{
      "id": "1",
      "title": "精品咖啡",
      "desc": "摩卡咖啡豆平均颗粒较小，带有生姜的狂野泼辣气息、明亮独特的滋味摩卡咖啡豆平均颗粒较小，带有生姜的狂野泼辣气息、明亮独特的滋味",
      "url": "/images/p5.png"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.api_201()
  },
  /**
   * 加载首页数据
   */
  api_201: function() {
    var this_ = this;
    wx.post(api.api_201, wx.GetSign(), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        //返回的数组扩展属性
        res.data.Result.banners.map(function(obj, index, arr) {
          obj.type = "image"
          obj.url = obj.imgurl
        })
        console.log(res.data.Result.banners)
        this_.setData({
          banners: res.data.Result.banners
        })
        // this_.setData({
        //   itemData: res.data.Result.banners
        // })
      }
    });
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