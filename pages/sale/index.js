var api = require("../../modules/api.js")
var appGlobal = require("../../modules/appGlobal.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //banner集合
    banners: [],
    //是否提交订单
    isSubmit: false,
    //选择sku弹框
    isSelectSKU: false,
    //商品详情
    productDetails: {
      product: {
        name: ''
      },
      skus: [],
      specNames: [],
      specValues: [],
      specCustoms: []
    },
    //每页大小
    pageSize: 10,
    //分类ID
    catgId: 0,
    //当前分类选中=索引
    curIndex: 0,
    //页面数据
    result: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    //banner数据
    this.setData({
      banners: appGlobal.storage.swiper.getCoffeeBanner()
    })
    //加载数据
    this.api_202(opt.id)
  },

  /**
   * 初始化加载
   */
  api_202: function(catg_id) {
    var that = this;
    wx.post(api.api_202, wx.GetSign({
      CatgID: catg_id,
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
          result: res.data.Result.catgs
        })

        //初始化数据
        that.initData(res.data.Result.catgs, res.data.Result.productList)
        //设置选中类别
        that.setCatgId(catg_id)
      }
    })
  },

  /**
   * 加载商品详情
   */
  api_203: function(id, tid, name) {
    let that = this
    wx.post(api.api_203, wx.GetSign({
      ID: id,
      TID: tid
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        //设置商品集合
        that.setData({
          ["productDetails.product.name"]: name,
          ["productDetails.skus"]: res.data.Result.skus,
          ["productDetails.specNames"]: res.data.Result.specNames,
          ["productDetails.specValues"]: res.data.Result.specValues,
          ["productDetails.specCustoms"]: res.data.Result.specCustoms
        }) 

      }
    })
  },

  /**
   * 设置类别ID
   */
  setCatgId: function(catg_id) {

    let that = this
    //初始化选中的类别ID
    this.setData({
      catgId: catg_id
    })

    //更新结果集合
    this.setData({
      result: this.data.result
    })

    //设置选中索引
    this.data.result.forEach(function(o, i, a) {
      if (o.id == catg_id) {
        that.setData({
          curIndex: i
        })
        return
      }
    })
  },

  /**
   * 绑定商品数据
   */
  initData: function(catgs, pdtList) {
    //obj.pdtList = []
    this.data.result.map(function(obj, index, arr) {
      //分类对应的商品集合
      obj.pdtList = []
      //商品对应分类
      pdtList.forEach(function(o, i, a) {
        if (obj.id == o.gcatg_id) {
          obj.pdtList.push(o)
        }
      })
    })

    //更新结果集合
    this.setData({
      result: this.data.result
    })

  },

  /**
   * 设置选择类别
   */
  selectCatg: function(e) {
    //类别id
    let catg_id = e.currentTarget.dataset.id
    //设置选中类别
    this.setCatgId(catg_id)
  },
  /**
   * 选择商品SKU
   */
  showModal(e) {
    //商品ID
    let id = e.currentTarget.dataset.id
    //商品类型ID
    let tid = e.currentTarget.dataset.tid
    //商品名称
    let name = e.currentTarget.dataset.name
    //弹出目标
    this.setData({
      isSelectSKU: true
    })
     
    //加载商品SKU
    this.api_203(id, tid, name)
  },
  /**
   * 关闭商品SKU
   */
  hideModal() {
    this.setData({
      isSelectSKU: false
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