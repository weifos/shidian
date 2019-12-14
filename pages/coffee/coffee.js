var api = require("../../modules/api.js")
var router = require("../../modules/router.js")
var user = require("../../modules/userInfo.js")
var appGlobal = require("../../modules/appGlobal.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    catgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    this.api_201(opt.store_id, opt.bar_counter_id)
  },

  /**
   * 加载首页数据
   */
  api_201: function (sId, barId) {
    var this_ = this
    let store = user.methods.getStore()
    api.post(api.api_201, api.getSign({
      StoreId: sId
    }), function(app, res) {
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

        //banner数据
        this_.setData({
          banners: res.data.Result.banners
        })
        //将banner数据写入缓存
        appGlobal.storage.swiper.setCoffeeBanner(res.data.Result.banners)
        //咖啡分类
        this_.setData({
          catgs: res.data.Result.catgs
        })
      }
    });
  },

  /**
   * 菜单跳转
   */
  goUrl: function(e) {
    //跳转地址
    let url = '../sale/index?id=' + e.currentTarget.dataset.id
    //跳转
    router.goUrl({
      url: url
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