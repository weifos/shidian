module.exports = {

  goUrl(object) {
    if (getCurrentPages().length > 4) {
      //会将旧页面出栈，再将需要跳转到的页面入栈
      this.redirectTo(object)
    } else {
      //不会将旧页面出栈
      wx.navigateTo(object)
    }
    
    //wx.reLaunch(object)
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