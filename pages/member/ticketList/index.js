var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var user = require("../../../modules/userInfo.js")
var router = require("../../../modules/router.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    scrollLeft: 0,
    pageSize: 5,
    isSelect: false,
    orderData: [{
        type: -1,
        title: "全部",
        loading: false,
        loadComplete: false,
        pageIndex: 0,
        list: []
      },
      {
        type: 0,
        title: "未使用",
        loading: false,
        loadComplete: false,
        pageIndex: 0,
        list: []
      },
      {
        type: 1,
        title: "已使用",
        loading: false,
        loadComplete: false,
        pageIndex: 0,
        list: []
      }
    ]
  },

  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /**
   * 加载订单票据
   */
  api_334: function() {
    let that = this
    //请求接口数据
    api.post(api.api_334, api.getSign(), function(app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {

        let tmpAll = []
        let tmpDisUse = []
        let tmpUse = []
        res.data.Result.forEach(function(o, i) {
          let name = ''
          //课程优惠券
          if (o.module == 1) {
            name = '课程券'
          } else {
            name = '咖啡饮品券'
          }

          let ele = {
            id: o.id,
            name: name,
            type: o.type,
            is_used: false,
            discount: o.amount,
            quota: o.full_amount,
            startTime: appG.util.date.dateFormat(o.expiry_sdate, 'yyyy-MM-dd'),
            endTime: appG.util.date.dateFormat(o.expiry_edate, 'yyyy-MM-dd')
          }

          //支付选择优惠券情况，只能选商品券
          if (that.data.isSelect) {
            if (o.module == 0) {
              if (o.is_used) {
                ele.is_used = true
                tmpUse.push(ele)
              } else {
                tmpDisUse.push(ele)
              }
              tmpAll.push(ele)
            }
          } else {
            if (o.is_used) {
              ele.is_used = true
              tmpUse.push(ele)
            } else {
              tmpDisUse.push(ele)
            }
            tmpAll.push(ele)
          }
        })

        that.setData({
          ['orderData[0].list']: tmpAll
        })
        that.setData({
          ['orderData[1].list']: tmpDisUse
        })
        that.setData({
          ['orderData[2].list']: tmpUse
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    if (opt.s == 1) {
      this.setData({
        ['isSelect']: true
      })
      this.setData({
        ['tabCur']: 1
      })
    }
    //加载数据
    this.api_334()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 菜单跳转
   */
  checkTicket: function(item) {
    let id = item.currentTarget.dataset.item.id
    let name = item.currentTarget.dataset.item.name
    let title = ''
    let type = item.currentTarget.dataset.item.type
    let discount = item.currentTarget.dataset.item.discount
    //1:代金券，5：折扣券
    if (type == 1) {
      title = discount + '元'
    } else if (type == 5) {
      title = discount + '折'
    }

    router.goUrl({
      url: '../memberPayCode/index?cid=' + id + "&cname=" + name + "&tname=" + title
    })
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