var api = require("../../modules/api.js")
var appGlobal = require("../../modules/appGlobal.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //banner集合
    banners: [],
    //每页大小
    pageSize: 10,
    //分类ID
    catgId: 0,
    //当前分类选中=索引
    curIndex: 0,
    //页面数据
    result: []
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    //banner数据
    this.setData({
      banners: appGlobal.storage.swiper.getCoffeeBanner()
    })

    //初始化选中的类别ID
    this.setData({
      catgId: opt.id
    })

    this.api_202()
  },

  /**
   * 加载数据
   */
  api_202: function() {
    var that = this;
    wx.post(api.api_202, wx.GetSign({
      CatgID: that.data.catgId,
      Size: that.data.pageSize
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        that.setData({
          result: res.data.Result.productList
        })

        that.bindPdtList(res.data.Result.catgs, res.data.Result.productList)
      }
    })
  },

  /**
   * 绑定商品数据
   */
  bindPdtList: function(catgs, pdtList) {
    //obj.pdtList = "image"
    debugger
    this.data.result.map(function(obj, index, arr) {
      pdtList.forEach(function(o, i, a) {
        if (obj.id == o.parent_id) {

        }
      })
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