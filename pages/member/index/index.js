// pages/member/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      "login":1,
      "name":"Cpandd",
      "intro":"我超喜欢十点书店的"
    },
    list1:[
      {
        "name":"我的会员",
        "icon":"member"
      },
      {
        "name": "付款码",
        "icon": "paycode"
      },
      {
        "name": "我的活动",
        "icon": "activity"
      },
      {
        "name": "我的积分",
        "icon": "integral"
      }
    ],
    list2: [
      {
        "name": "购买记录",
        "icon": "buy",
        "url": ""
      },
      {
        "name": "我的钱包",
        "icon": "wallet",
        "url": ""
      },
      {
        "name": "我的优惠券",
        "icon": "ticket",
        "url": ""
      },
      {
        "name": "在线客服",
        "icon": "service",
        "url": ""
      },
      {
        "name": "退出登录",
        "icon": "loginout",
        "url": ""
      }
    ],
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