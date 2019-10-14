var api = require("../../modules/api.js")
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
      // 调起扫码
      wx.scanCode({
        success(res) {
          if (res.result) {
            //查询对应的吧台和门店信息
            that.api_204(res.result)
          }
        }
      })
    },
    /**
     * 扫码点单
     */
    api_204: function(no) {
      var that = this
      api.post(api.api_204, api.getSign({
        No: no
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
            url: '../coffee/coffee'
          })
        }
      });
    }
  }
})