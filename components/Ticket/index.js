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
     * 申请退款
     */
    appRefund: function() {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确认申请退款吗？',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确认',
        success: function(res) {
          // 确认
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
    }
  }

})