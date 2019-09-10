//index.js
//获取应用实例
var api = require("../../modules/api.js")
var router = require("../../modules/router.js")

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
    wx.post(api.api_200, wx.GetSign(), function(app, res) {
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
   * 菜单跳转
   */
  goUrl: function(e) {
    //跳转地址
    let url = ''
    let key = e.currentTarget.dataset.key

    switch (key) {
      //咖啡
      case "coffee":
        url = '../coffee/coffee?id=' + key
        break;
      //课程
      case "course":
        url = '../memberWallet/index?id=' + key
        break;
      //活动预约
      case "appt":
        url = '../memberWallet/index?id=' + key
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