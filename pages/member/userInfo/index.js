// pages/member/userInfo/index.js
var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var passport = require("../../../modules/passport.js")
var user = require("../../../modules/userInfo.js")
var router = require("../../../modules/router.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEditBirth:false,
    userInfo: {
      nickname: '',
      birth: '1990-01-01',
      sex: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    let _user = user.methods.getUser()
    if(_user.birth == undefined){
      this.setData({
        isEditBirth: true
      }) 
    }else{
      _user.birth = appG.util.date.dateFormat(_user.birth, 'yyyy-MM-dd')
      this.setData({
        userInfo: _user
      })
    }
  },

  /**
   *  绑定输入框输入
   */
  updateNickName(e) {
    let name = e.detail.value
    this.setData({
      ['userInfo.nickname']: name
    })
  },

  /**
   *  日期选择改变
   */
  dateChange(e) {
    let birth = e.detail.value
    this.setData({
      ['userInfo.birth']: birth
    })
  },

  /**
   *  性别选择改变
   */
  sexChange(e) {
    let sex = e.detail.value
    this.setData({
      ['userInfo.sex']: sex
    })
  },
  /**
    * 加载用户信息
    */
  api_106: function () {
    let that = this
    let userInfo = user.methods.getUser()
    console.log("openid:" + userInfo.openid)
    api.post(api.api_106,
      api.getSign({
        OpenID: userInfo.openid
      }),
      function (app, res) {
        if (res.data.Basis.State == api.state.state_200) {
          user.methods.login(res.data.Result)
          router.goUrl({
            url: '../index/index'
          })
        } else {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        }
      })
  },

  /**
   * 更新用户信息
   */
  api_301: function() {
    var that = this
    //请求接口
    api.post(api.api_301, api.getSign({
        UserDetails: that.data.userInfo
    }), function(app, res) {
      if (res.data.Basis.State == api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 2000
        })

        that.api_106() 
      } else { 
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
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