var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var user = require("../../../modules/userInfo.js")
var router = require("../../../modules/router.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    result: []
  },

  /**
   * 加载订单票据
   */
  api_329: function(id) {
    let that = this
    //请求接口数据
    api.post(api.api_329, api.getSign({
      ID: id
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        //课程信息
        let course = res.data.Result.orderCourse
        res.data.Result.tickets.forEach(function(o, i) {
          that.data.result.push({
            id:o.id,
            name: course.course_name,
            startTime: appG.util.date.dateFormat(course.start_date, 'yyyy-MM-dd hh:mm'),
            endTime: appG.util.date.dateFormat(course.end_date, 'yyyy-MM-dd hh:mm')
          })
        })
   
        that.setData({
          ['result']: that.data.result
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    this.api_329(opt.id)
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