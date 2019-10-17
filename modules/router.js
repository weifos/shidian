module.exports = {

  goUrl(object) {
    if (getCurrentPages().length > 9) {
      //会将旧页面出栈，再将需要跳转到的页面入栈
      if (object.url == '/pages/index/index') {
        //wx.reLaunch(object)
        wx.navigateTo(object)
      } else {
        wx.redirectTo(object)
      }
    } else {
      //不会将旧页面出栈
      if (object.url == '/pages/index/index') {
        wx.reLaunch(object)
      } else {
        wx.navigateTo(object)
      }
    }
  },

  // 其他跳转不处理
  navigateBack(object) {
    wx.navigateBack(object)
  },

  switchTab(object) {
    wx.switchTab(object)
  },

  redirectTo(object) {
    wx.redirectTo(object)
  },

  reLaunch(object) {
    wx.reLaunch(object)
  }

}