module.exports = {
  data: {
    openid: wx.getStorageSync('openid'),
    user: {
      token: ''
    },
    //购物车信息
    sCartOrder: {},
    //立即购买
    buyNowOrder: {}
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
    },
    /**
     * 设置门店信息
     */
    setStore(result) {
      //写入本地缓存
      wx.setStorageSync("store", JSON.stringify(result))
    },
    /**
     * 获取门店信息
     */
    getStore() {
      let item = wx.getStorageSync('store')
      if (item.length) {
        return JSON.parse(item)
      }
      return null
    },
    /**
     * 设置购物车
     */
    setShoppingCart(result) {
      wx.setStorageSync("sCartOrder", JSON.stringify(result))
    },
    /**
     * 提交立即购买
     */
    buyNow(result) {
      //写入本地缓存
      wx.setStorageSync("buyNowOrder", JSON.stringify(result))
    },
    /**
     * 获取缓存购物车
     */
    getShoppingCart() {
      let item = wx.getStorageSync('sCartOrder')
      if (item.length) {
        return JSON.parse(item)
      }  
      return null
    }
  },
  created() {
    //登录用户信息
    let userInfoData = wx.getStorageSync("user_info")
    if (userInfoData) {
      that.setData({
        user: userInfoData
      })
    }
 
    //提交购物车
    let sCOrder = wx.getStorageSync("sCartOrder")
    if (sCOrder) {
      that.setData({
        sCartOrder: sCOrder
      })
    }

    //立即购买
    let buyNow = wx.getStorageSync("buyNowOrder")
    if (buyNow) {
      that.setData({
        buyNowOrder: sCOrder
      })
    }

  }
}