var api = require("../../modules/api.js")
var user = require("../../modules/userInfo.js")
var router = require("../../modules/router.js")
var appGlobal = require("../../modules/appGlobal.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //对应的门店信息
    store_id: 0,
    //订单信息
    order: {
      store_id: 0,
      remarks: '',
      details: []
    },
    //购物车列表
    result: [],
    //总计
    totalPrice: 0
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },
  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },
  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  //加载购物车
  api_302() {
    let that = this
    this.post(app_g.api.api_302, api.getSign({
      StoreID: that.data.order.store_id
    }), function(vue, res) {
      if (res.data.Basis.State == app_g.state.state_200) {
        that.setData({
          result: res.data.Result
        })
        that.checkUpdate()
      } else {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  //更新购物车
  api_303(item, num, cb) {
    let that = this
    api.post(api.api_303, api.getSign({
      CID: item.id,
      Count: num,
      StoProductID: item.sto_product_id,
      SpecSet: item.specset,
      StoreID: that.data.order.store_id
    }), (wx, res) => {
      cb()
    })
  },
  //删除购物车
  api_304(e) {
    let that = this
    //数据
    let item = e.currentTarget.dataset.item
    //请求接口删除
    api.post(api.api_304, api.getSign({
      CID: item.id
    }), function(wx, res) {
      if (res.data.Basis.State == api.state.state_200) {
        that.data.result.forEach((ele, index) => {
          if (ele.id === item.id) {
            that.data.result.shift(index, 1)
          }
        })

        that.setData({
          ["result"]: that.data.result
        })

        that.checkUpdate()
        wx.showToast({
          title: "删除成功",
          icon: 'none',
          duration: 3000
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
  //勾选改变更新小计
  checkUpdate(ele) {
    //总计临时变量
    let total = 0

    this.data.result.map((item, index) => {
      //更新修改
      if (ele != null && ele != undefined && item.specset == ele.specset && item.product_id == ele.product_id) {
        item = ele
      }
      //当前小计 
      item.subtotal = item.product_price * item.count
      //更新购物车
      this.setData({
        ["result[" + index + "]"]: item
      })
      //总计
      total += item.subtotal
    })
    this.setData({
      totalPrice: total
    })

    //更新购物车信息
    user.methods.setShoppingCart(this.data.result)
  },
  //加
  add(e) {
    let item = e.currentTarget.dataset.item
    //不能大于99
    if (item.count > 99) return
    let num = item.count + 1
    this.api_303(item, num, () => {
      if (item.count > 100) {
        item.count = 100
      } else {
        item.count++
      }
      this.checkUpdate(item)
    })
  },
  //减
  sub(e) {
    let item = e.currentTarget.dataset.item
    //不能小于1
    if (item.count <= 1) return
    let num = item.count - 1
    this.api_303(item, num, () => {
      if (item.count < 1) {
        item.count = 1
      } else {
        item.count--
      }
      this.checkUpdate(item)
    })
  },

  //提交购物车
  submit() {
    if (!this.data.result.length) {
      return
    }

    let data = {
      IsShoppingCart: true,
      Order: this.data.order
    }

    //此处为桌号
    data.Order.bar_no = user.methods.getStore().bar_counter_no

    //处理提交失败，重复点击，会附加多条数据
    data.Order.store_details = []
    //组装商品详情数据   
    this.data.result.forEach((item, index) => {
      let detail = {
        product_id: item.product_id,
        sto_product_id: item.sto_product_id,
        specset: item.specset,
        spec_msg: item.spec_msg,
        count: item.count
      }
      data.Order.store_details.push(detail)
    })
  
    //提交购物车
    api.post(api.api_314, api.getSign(data), function(th, res) {
      if (res.data.Basis.State == api.state.state_200) {
        wx.showToast({
          title: "提交成功",
          icon: 'none',
          duration: 3000
        })

        router.goUrl({
          url: '../orderCheck/index?no=' + res.data.Result
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
   * 购买数量
   */
  textAreaBInput(e) {
    this.setData({
      ["order.remarks"]: e.detail.value
    })
  },

  /**
   * 订单备注
   */
  onInput(e) {
    let num = e.detail.value
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    if (num > 0 && num <= 99) {
      item.count = num
      //更新购物车
      this.setData({
        ["order.details[" + index + "]"]: item
      })
      //console.log(this.data.order.details[index].count)
      this.checkUpdate(item)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let store = user.methods.getStore()
    this.setData({
      ['order.store_id']: store.store_id
    })

    //本地存储更新购物车
    let shoppingCart = user.methods.getShoppingCart()
    this.setData({
      result: shoppingCart
    })
    this.checkUpdate()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // let pages = getCurrentPages(); //页面栈
    // let beforePage = pages[pages.length - 2]
 
    // wx.navigateTo({       //非tabBar页面的跳转
    //   url: '/' + beforePage.route,
    //   success: function () {
    //     if (beforePage.route == 'pages/sale/index') {
    //       beforePage.api_302()
    //     }
    //   },
    //   fail: (err) => {
    //     console.log(err)
    //   }
    // })
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