var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var user = require("../../../modules/userInfo.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    scrollLeft: 0,
    pageIndex: 0,
    pageSize: 10,
    //交易类型
    tradeType: 0,
    //用户积分余额
    point: 0,
    //第一次加载查询用户最新积分
    loadPoint: true,
    loading: false,
    loadComplete: false,
    pointData: [{
        type: 0,
        title: "全部",
        pageIndex: 0,
        loading: false,
        firstLoad: true,
        loadComplete: false,
        totalPage: 0,
        list: []
      },
      {
        type: 1,
        title: "收入",
        pageIndex: 0,
        loading: false,
        firstLoad: true,
        loadComplete: false,
        totalPage: 0,
        list: []
      },
      {
        type: -1,
        title: "支出",
        pageIndex: 0,
        loading: false,
        firstLoad: true,
        loadComplete: false,
        totalPage: 0,
        list: []
      },
      {
        type: 2,
        title: "已过期",
        pageIndex: 0,
        loading: false,
        firstLoad: true,
        loadComplete: false,
        totalPage: 0,
        list: []
      }
    ]
  },

  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.api_340()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.api_340()
  },

  /**
   * 加载交易列表
   */
  api_340: function() {
    let that = this
    //当前选中索引
    let index = this.data.tabCur
    //查询条件对象数组
    let curItem = this.data.pointData[index]
    //是否加载中，是否加载完成
    if (!curItem.loading && !curItem.loadComplete && curItem.pageIndex < curItem.totalPage || curItem.firstLoad) {
      api.post(api.api_340, api.getSign({
        LoadPoint: that.data.loadPoint,
        Size: that.data.pageSize,
        Index: curItem.pageIndex,
        TradeType: curItem.type
      }), function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          if (that.data.loadPoint) {
            that.setData({
              loadPoint: false
            })

            that.setData({
              point: res.data.Result.point
            })
          }

          curItem.loading = false
          curItem.firstLoad = false

          //设置当前分类对应商品总行数
          let totalRow = res.data.Result.totalRow
          curItem.pageIndex = curItem.pageIndex + 1
          curItem.totalPage = parseInt(totalRow / that.data.pageSize) + (totalRow % that.data.pageSize == 0 ? 0 : 1)
          res.data.Result.dt.forEach(function(o, i) {
            curItem.list.push(o)
          })

          that.setData({
            ['pointData[' + index + ']']: curItem
          })

          //是否全部加载完毕
          if (res.data.Result.dt.length == 0) {
            curItem.loadComplete = true
            that.setData({
              ['orderData[' + index + ']']: curItem
            })
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
    this.api_340()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})