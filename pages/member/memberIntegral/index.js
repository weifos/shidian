// pages/member/memberIntegral/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    integralData: [
      {
        title: "全部",
        list: [
        //   {
        //   "id": "1",
        //   "status": "已过期",
        //   "name": "这里是订单名称",
        //   "value": "+30",
        //   "time": "2019.05.05"
        // }
        ]
      },
      {
        title: "收入",
        list: [
        //   {
        //   "id": "1",
        //   "status": "收入",
        //   "name": "这里是订单名称",
        //   "value": "+30",
        //   "time": "2019.05.05"
        // }
        ]
      },
      {
        title: "支出",
        list: [
        //   {
        //   "id": "2",
        //   "status": "兑换成功",
        //   "name": "这里是订单名称",
        //   "value": "-30",
        //   "time": "2019.05.05"
        // }
        ]
      },
      {
        title: "已过期",
        list: [
          // {
          //   "id": "2",
          //   "status": "已过期",
          //   "name": "这里是订单名称",
          //   "value": "-30",
          //   "time": "2019.05.05"
          // }
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