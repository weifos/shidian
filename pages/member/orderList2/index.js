// pages/member/orderList2/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    orderData: [
      {
        title: "全部",
        list: [{
          "id": "1",
          "url":"/images/p9.png",
          "status": "在线支付 | 已付款",
          "statusCode":0,
          "name": "这里是订单名称这里是订单名称",
          "no":"订单编号：1234567",
          "price": "33.25",
          "time": "2019-05-05 14:48:42"
        }, {
            "id": "2",
            "url": "/images/p9.png",
            "status": "在线支付 | 已付款",
            "statusCode": 1,
            "name": "这里是订单名称这里是订单名称",
            "no": "订单编号：1234567",
            "price": "33.25",
            "time": "2019-05-05 14:48:42"
        },
        ]
      },
      {
        title: "待付款",
        list: []
      },
      {
        title: "已支付",
        list: [
          {
            "id": "2",
            "url": "/images/p9.png",
            "status": "在线支付 | 已付款",
            "statusCode": 1,
            "name": "这里是订单名称这里是订单名称",
            "no": "订单编号：1234567",
            "price": "33.25",
            "time": "2019-05-05 14:48:42"
          }
        ]
      }
    ]
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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