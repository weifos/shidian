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
    //选择优惠券时是否达到使用条件
    useFullAmount: 0,
    //满减金额
    amount: 0,
    //每页大小
    pageSize: 5,
    //流水号
    serial_no: '',
    //是否选中优惠券
    isSelect: false,
    //是否是扫码场景
    isPayCode: false,
    //门店ID
    store_id: 0,
    //支付时指定查看的优惠券类型
    module: -1,
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
   * 加载用户优惠券数据
   */
  api_334: function () {
    let that = this
    //请求接口数据
    api.post(api.api_334, api.getSign(), function (app, res) {
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
        res.data.Result.forEach(function (o, i) {
          let ele = {
            id: o.id,
            name: o.name,
            type: o.type,
            serial_no: o.serial_no,
            is_used: o.is_used,
            discount: o.amount,
            quota: o.full_amount,
            remark: o.remark,
            startTime: appG.util.date.dateFormat(o.expiry_sdate, 'yyyy-MM-dd'),
            endTime: appG.util.date.dateFormat(o.expiry_edate, 'yyyy-MM-dd')
          }

          if (o.module == 0) {
            ele.remark = '通用券'
          } else if (o.module == 1) {
            ele.remark = '图书优惠券'
          } else if (o.module == 2) {
            ele.remark = '咖啡饮品券'
          } else if (o.module == 3) {
            ele.remark = '好物优惠券'
          } else if (o.module == 4) {
            ele.remark = '课堂优惠券'
          }

          ele.module = o.module
          //支付选择优惠券情况，只能选商品券
          if (that.data.isSelect) {
            if (o.module == ele.module) {
              if (o.is_used) {
                tmpUse.push(ele)
              } else {
                tmpDisUse.push(ele)
              }
              tmpAll.push(ele)
            }
          } else {
            if (ele.is_used) {
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
  onLoad: function (opt) {

    if (opt.s == 1) {
      this.setData({
        isSelect: true
      })
    }

    this.setData({
      tabCur: 1
    })

    //流水号
    if (opt.sn != undefined) {
      this.setData({
        serial_no: opt.sn
      })
    }

    //付款码使用的场景，课堂券不能用
    if (opt.isPayCode != undefined) {
      this.setData({
        isPayCode: opt.isPayCode
      })
    }

    //优惠券商品线类型
    if (opt.m != undefined) {
      this.setData({
        module: opt.m
      })
    }

    //金额
    if (opt.amount != undefined) {
      this.setData({
        useFullAmount: opt.amount
      })
    }

    //加载数据
    this.api_334()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 菜单跳转
   */
  checkTicket: function (e) {
    //小程序内部选择使用
    if (this.data.isSelect) {
      //未达到金额使用条件
      if (this.data.useFullAmount < e.currentTarget.dataset.item.quota) {
        wx.showToast({ title: '未达到使用金额', duration: 2000, mask: true,icon:'none' })
        return
      }
      let id = e.currentTarget.dataset.item.id
      let name = e.currentTarget.dataset.item.name
      let title = ''
      let type = e.currentTarget.dataset.item.type
      let discount = e.currentTarget.dataset.item.discount

      //1:代金券，5：折扣券
      if (type == 1) {
        title = discount + '元'
      } else if (type == 5) {
        title = discount + '折'
      } else if (type == 10) {
        title = '买一赠一'
      } else if (type == 15) {
        title = '免费券'
      }

      //付款码场景
      if (this.data.isPayCode) {
        router.goUrl({
          url: '../memberPayCode/index?cid=' + id + "&cname=" + name + "&tname=" + title
        })
      } else {
        //课程支付页面跳转
        if (this.data.module == 4) {
          let param = '?no=' + this.data.serial_no + '&cid=' + id + "&cname=" + name + "&tname=" + title
          router.goUrl({
            url: '../../orderCourse/index' + param
          })

          //咖啡饮品
        } else if (this.data.module == 2) {
          let param = '?no=' + this.data.serial_no + '&cid=' + id + "&cname=" + name + "&tname=" + title
          router.goUrl({
            url: '../../orderCheck/index' + param
          })
        }
      }

      //小程序外部扫码使用
    } else {
      let item = e.currentTarget.dataset.item
      if (!item.is_used) {
        router.goUrl({
          url: '../ticketDetail/index?no=' + item.serial_no
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})