var api = require("../../modules/api.js")
var router = require("../../modules/router.js")
var appG = require("../../modules/appGlobal.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    useFullAmount: Number,
    ticketInfo: Object,
    type: String,
    used: Boolean
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击使用
     */
    toUse: function (e) {
      var that = this
      let item = e.currentTarget.dataset.item
      //将当前票据写入到本地缓存中
      wx.setStorageSync("course_ticket", JSON.stringify(item))
      //跳转到课程票据详情页
      router.goUrl({ url: '../courseTicket/index' })
    },
    /**
     * 申请退款
     */
    appRefund: function () {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确认申请退款吗？',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确认',
        success: function (res) {
          // 确认
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
    }



  }

})