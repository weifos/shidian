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
    //1：活动，5：课程
    type_id: 1,
    scrollLeft: 0,
    pageSize: 5,
    orderData: [{
      title: "已报名",
      loading: false,
      loadComplete: false,
      pageIndex: 0,
      list: []
    },
    {
      title: "已参加",
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
  },

  /**
   * 加载订单数据
   */
  api_328: function () {
    let that = this
    //付款状态
    let isPay = 0
    //当前选中索引
    let index = this.data.tabCur
    //当前选中项
    let curItem = this.data.orderData[index]

    if (index == 0) {
      isPay = -1
    } else if (index == 1) {
      isPay = 1
    } else if (index == 2) {
      isPay = 0
    }

    //是否加载中，是否加载完成
    if (!curItem.loading && !curItem.loadComplete) {
      //请求接口数据
      api.post(api.api_328, api.getSign({
        TypeID: that.data.type_id,
        IsPay: isPay,
        Size: that.data.pageSize,
        Index: curItem.pageIndex
      }), function (app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          curItem.loading = false
          curItem.pageIndex = curItem.pageIndex + 1
          res.data.Result.forEach(function (o, i) {
            o.start_date = appG.util.date.dateFormat(o.start_date, 'yyyy-MM-dd hh:mm')
            curItem.list.push(o)
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
   * 查看券码详情
   */
  goDetails: function (e) {
    let url = ''
    let item = e.currentTarget.dataset.item
    //1：活动
    if (item.type == 1) {
      url = '../../courseDetail/courseDetail?id='
      //5：课程
    } else if (item.type == 5) {
      url = '../../courseDetail/courseDetail?id='
    }
    router.goUrl({
      url: url + item.course_id
    })
  },

  /**
   * 查看详情
   */
  goTicket: function (e) {
    router.goUrl({
      url: '../memberTicket/index?id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 去支付
   */
  goPay: function (e) {
    let item = e.currentTarget.dataset.item
    let param = '?no=' + item.serial_no + '&store_id=' + item.store_id
    if (item.type == 5) {
      router.goUrl({
        url: '../../orderCourse/index' + param
      })
    }
  },

  /**
   * 退款申请
   */
  refundApply: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认申请退款吗？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          api.post(api.api_341, api.getSign({
            ID: id
          }), function (app, res) {
            if (res.data.Basis.State == api.state.state_200) {
              that.data.orderData[0].list.forEach(function (item, index) {
                if (item.id == id) {
                  item.refund_status = 2
                  return
                }
              })
              that.setData({
                ["orderData[0].list"]: that.data.orderData[0].list
              })
            } else {
              wx.showToast({
                title: res.data.Basis.Msg,
                icon: 'none',
                duration: 3000
              })
            }
          })
        } else if (res.cancel) { }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    if (opt.tid == 1) {
      wx.setNavigationBarTitle({
        title: '十点书店·我的活动'
      })
    }

    this.setData({
      ['type_id']: opt.tid
    })
    this.api_328()
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