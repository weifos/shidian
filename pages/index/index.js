var api = require("../../modules/api.js")
var appG = require("../../modules/appGlobal.js")
var router = require("../../modules/router.js")
var user = require("../../modules/userInfo.js")

Page({
  data: {
    banners: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(opt) {
    if (!opt.store_id) {
      var result = {
        store_id: opt.store_id,
        bar_counter_id: opt.bar_counter_id
      }
    }
    this.api_200()
  },
  /**
   * 加载首页数据
   */
  api_200: function() {
    var this_ = this;
    api.post(api.api_200, api.getSign(), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {

        //返回的数组扩展属性
        res.data.Result.banners.map(function(obj, index, arr) {
          obj.type = "image"
        })

        this_.setData({
          banners: res.data.Result.banners
        })

      }
    });
  },
  /**
   * 扫码点单
   */
  api_204: function (result) {
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
          url: '/pages/coffee/coffee?store_id=' + res.data.Result.store_id + "&bar_counter_id=" + res.data.Result.bar_counter_id + "&scan=1"
        })
      }
    });
  },

  /**
   * 扫码点单
   */
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
              if (res.path) {
                let store_id = appG.util.getUrlParam(res.path, "store_id")
                let bar_counter_id = appG.util.getUrlParam(res.path, "bar_counter_id")
                //查询对应的吧台和门店信息
                that.api_204({
                  store_id: store_id,
                  bar_counter_id: bar_counter_id
                })
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 菜单跳转
   */
  goUrl: function(e) {
    //跳转地址
    let url = ''
    let key = e.currentTarget.dataset.key

    switch (key) {
      //咖啡
      case "coffee":
        url = '../coffee/coffee'
        break;
        //课程
      case "course":
        url = '../course/course'
        break;
        //活动预约
      case "appt":
        url = '../activity/activity'
        break;

      default:
        break;
    }

    if (url.length > 0) {
      router.goUrl({
        url: url
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "十点书店会员服务",
      path: "pages/index/index",
      imageUrl: 'http://res.sdibook.com/DefaultRes/Images/mini_share.png'
    }
  }
})