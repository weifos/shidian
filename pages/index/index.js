var api = require("../../modules/api.js") 
var router = require("../../modules/router.js")
 
Page({
  data: {
    banners: [], 
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //this.api_200()
  },
  /**
   * 加载首页数据
   */
  api_200: function () {
    var this_ = this;
    wx.post(api.api_200, wx.GetSign(), function (app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        this_.setData({
          banners: res.data.Result.banners
        })
        this_.setData({
          cat: res.data.Result.stores
        })
      }
    });
  }
})
