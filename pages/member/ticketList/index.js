// pages/member/ticketList/index.js
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
        list: [
          {
          "key":"0001",
          "name":"咖啡券",
          "startTime":"2019-06-01",
          "endTime":"2019-06-30",
          "discount":"5",
          "quota":"0.01"
          },
          {
            "key": "0001",
            "name": "咖啡券",
            "startTime": "2019-06-01",
            "endTime": "2019-06-30",
            "discount": "5",
            "quota": "0.01"
          }
        ]
      },
      {
        title: "待付款",
        list: []
      },
      {
        title: "已支付",
        list: [
          // {
          // "key":"0001",
          // "name":"咖啡券",
          // "startTime":"2019-06-01",
          // "endTime":"2019-06-30",
          // "discount":"5",
          // "quota":"0.01"
          // },
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