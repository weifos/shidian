var api = require("../../modules/api.js")
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
  onLoad: function() {
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
              if (res.result) {
                //查询对应的吧台和门店信息
                that.api_204(res.result)
              }
            }
          })
        } else if (res.cancel) {
        }
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
  }
})