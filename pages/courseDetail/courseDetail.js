var api = require("../../modules/api.js")
var router = require("../../modules/router.js")
var appG = require("../../modules/appGlobal.js")
var wxParse = require('../../modules/wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    imgurl: "",
    totalPrice: 0,
    result: {
      title: "",
      startTime: "",
      endTime: "",
      address: "",
      sale_price: 0,
      detail: ""
    }
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
  //勾选改变更新小计
  checkUpdate() {
    let total = 0
    this.setData({
      totalPrice: this.data.result.sale_price * this.data.num
    })
  },
  //加
  add(e) {
    let tmp = this.data.num
    //不能大于99
    if (tmp > 99) return
    this.setData({
      num: tmp + 1
    })
    this.checkUpdate()
  },
  //减
  sub(e) {
    let tmp = this.data.num
    //不能小于1
    if (tmp <= 1) return
    let num = this.data.num - 1
    this.setData({
      num: tmp - 1
    })
    this.checkUpdate()
  },
  /**
   * 加载课堂详情页数据
   */
  api_206: function(opt) {
    var that = this
    api.post(api.api_206, api.getSign({
      ID: opt.id
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        that.setData({
          imgurl: res.data.Result.imgurl
        })

        res.data.Result.course.start_date = appG.util.date.dateFormat(res.data.Result.course.start_date, 'yyyy-MM-dd hh:mm')
        res.data.Result.course.end_date = appG.util.date.dateFormat(res.data.Result.course.end_date, 'yyyy-MM-dd hh:mm')
        that.setData({
          result: res.data.Result.course
        })

        that.setData({
          totalPrice: res.data.Result.course.sale_price
        })

        if (res.data.Result.course.details != undefined) {
          wxParse.wxParse('details', 'html', res.data.Result.course.details, that, 5)
        }
      }
    })
  },
  /**
   * 提交课程订单
   */
  api_326: function() {
    var that = this
    var order = { 
      course_id: that.data.result.id,
      details: []
    }

    for (let i = 0; i < that.data.num; i++) {
      order.details.push({
        id: 0
      })
    }
 
    api.post(api.api_326, api.getSign({
      Order: order
    }), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        router.goUrl({
          url: '../orderCourse/index?no=' + res.data.Result
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    this.api_206(opt)
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