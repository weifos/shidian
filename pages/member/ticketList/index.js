var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var user = require("../../../modules/userInfo.js")
var router = require("../../../modules/router.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    scrollLeft: 0,
    pageSize: 5,
    orderData: [{
        type: -1,
        title: "全部",
        loading: false,
        loadComplete: false,
        pageIndex: 0,
        list: []
      },
      {
        type: 0,
        title: "未使用",
        loading: false,
        loadComplete: false,
        pageIndex: 0,
        list: []
      },
      {
        type: 1,
        title: "已使用",
        loading: false,
        loadComplete: false,
        pageIndex: 0,
        list: []
      }
    ]
  },

  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.api_334()
  },

  /**
   * 加载订单票据
   */
  api_334: function() {
    let that = this
    //是否使用
    let type = -1
    //当前选中索引
    let index = this.data.tabCur
    //当前选中项
    let curItem = this.data.orderData[index]
    //是否加载中
    let loading = curItem.loading
    //是否加载完成
    let loadComplete = curItem.loadComplete

    if (index == 0) {
      type = -1
    } else if (index == 1) {
      type = 0
    } else if (index == 2) {
      type = 1
    }
    if (!curItem.loading && !curItem.loadComplete) {
      //请求接口数据
      api.post(api.api_334, api.getSign({
        IsUse: type,
        Size: that.data.pageSize,
        Index: curItem.pageIndex
      }), function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          curItem.loading = false
          curItem.pageIndex = curItem.pageIndex + 1

          res.data.Result.forEach(function(o, i) {
            let name = ''
            //课程优惠券
            if (o.module == 1) {
              name = '课程券'
            } else {
              name = '咖啡饮品券'
            }

            //discount
            curItem.list.push({
              name: name,
              type: o.type,
              discount: o.amount,
              quota: o.full_amount,
              startTime: o.expiry_sdate,
              endTime: o.expiry_edate
            })
          })

          that.setData({
            ['orderData[' + index + ']']: curItem
          })

          //是否全部加载完毕
          if (res.data.Result.length == 0) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.api_334()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 菜单跳转
   */
  goUrl: function() {
    router.goUrl({
      url: '../shoppingCart/index'
    })
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