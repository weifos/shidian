var api = require("../../modules/api.js")
var appG = require("../../modules/appGlobal.js")
var router = require("../../modules/router.js")
var user = require("../../modules/userInfo.js")
var app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: Number
  },
  observers: {
    'index': function(field) {
      this.setData({
        tabIndex: field
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    headimgurl: user.methods.getUser().headimgurl == undefined ? "/images/user.png" : user.methods.getUser().headimgurl,
    tabIndex: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 查看门店详情
     */
    nav: function(e) {
      router.goUrl({
        url: e.currentTarget.dataset.url
      })
      app.data.btIndex = e.currentTarget.dataset.index
      this.setData({
        ['app.data.btIndex']: app.data.btIndex
      })
    },
    scanCode: function() {
      var that = this
      wx.showModal({
        title: '提示',
        content: '请扫描门店二维码确定您所在门店',
        showCancel: true,
        cancelText: '取消',
        //cancelColor: '取消按钮的文本颜色，默认#000000',
        confirmText: '确认',
        //confirmColor: '却惹按钮的文本颜色，默认#000000',
        success: function(res) {
          if (res.confirm) {
            // 调起扫码
            wx.scanCode({
              success(res) {
                let store_id = appG.util.getUrlParam(res.path, "store_id")
                let bar_counter_id = appG.util.getUrlParam(res.path, "bar_counter_id")
                that.api_204({
                  store_id: store_id,
                  bar_counter_id: bar_counter_id
                })
              }
            })
          } else if (res.cancel) {}
        }
      })
    },
    /**
     * 扫码点单
     */
    api_204: function(result) {
      var that = this
      api.post(api.api_204, api.getSign({
        StoreID: result.store_id,
        BarCounterID: result.bar_counter_id
      }), function(app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          //设置扫码门店信息
          user.methods.setStore(res.data.Result)
          router.goUrl({
            url: '/pages/coffee/coffee'
          })
        }
      });
    }
  }
})