module.exports = {
  data: {
    openid: wx.getStorageSync('openid'),
    user: {
      token: ''
    }
  },
  methods: {
    /**
     * 登录
     */
    login(result) {
      this.user = result
      try {
        //wx.setStorage 的同步版本
        wx.setStorageSync("user_info", JSON.stringify(result))
      } catch (err) {
        app.showToast({
          title: err,
          icon: 'none',
          duration: 3000
        })
      }
    },
    /**
     * 登出
     */
    loginOut() {
      var that = this;
      wx.removeStorage({
        key: 'user_info',
        success: function(res) {
          that.setData({
            user: null
          })
        }
      })
    },
    /**
     * 是否登录
     */
    isLogin() {
      var that = this;
      var user = that.getUser()
      if (user.token) {
        return true
      }
      return false
    },
    /**
     * 获取用户信息
     */
    getUser() {
      var that = this;
      var user = wx.getStorageSync('user_info')
      if (user.length) {
        return JSON.parse(user)
      }
      return {
        token: ''
      }
    },
    /**
     * 刷新登录
     */
    refreshLogin(cb) {
      let $this = this
      this.post(app_g.api.api_300, this.GetSign(),
        function(vue, res) {
          if (res.data.Basis.State == app_g.state.state_200) {
            $this.login(res.data.Result)
            cb(res.data.Result)
          } else {
            vue.$vux.toast.text(res.data.Basis.Msg, 'default')
          }
        }
      )
    }
  },
  created() {
    let userInfoData = window.localStorage.getItem("user_info")
    if (userInfoData) {
      this.user = JSON.parse(userInfoData)
    }
  }
}