var api = require("../../modules/api.js")
var user = require("../../modules/userInfo.js")
var router = require("../../modules/router.js")
var appG = require("../../modules/appGlobal.js")
var wxParse = require('../../modules/wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    //已报名数量
    reg_num: 0,
    imgurl: "",
    //单价
    price: 0,
    applyIng: false,
    totalPrice: 0,
    ladder_prices: [],
    isOverdue: false,
    result: {
      title: "",
      startTime: "",
      endTime: "",
      address: "",
      sale_price: 0,
      up_limit: 0,
      detail: ""
    }
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //勾选改变更新小计
  checkUpdate() {
    let total = 0

    //开启阶梯价
    if (this.data.result.is_ladder) {
      let that = this
      //购买数量
      let num = this.data.num
      //阶梯最大数量
      let max_num = this.data.ladder_prices[0].count
      //阶梯最大金额
      let max_amount = this.data.ladder_prices[0].amount

      if (num > 1) {
        //超出最大数量，根据规则计算
        if (num > max_num) {
          this.setData({
            totalPrice: parseFloat(max_amount / max_num).toFixed(2) * num
          })
        } else {
          for (var i = 0; i < that.data.ladder_prices.length; i++) {
            var o = that.data.ladder_prices[i]
            if (num > o.count) {
              that.setData({
                totalPrice: parseFloat(o.amount / o.count).toFixed(2) * num
              })
              return
            } else if (num == o.count) {
              that.setData({
                totalPrice: o.amount
              })
              return
            }
          }
        }
      } else {
        //如果存在会员价
        if (this.data.result.vip_sale_price > 0) {
          this.setData({
            totalPrice: this.data.result.vip_sale_price
          })
        } else {
          that.setData({
            totalPrice: this.data.result.sale_price
          })
        }
      }
    } else {

      //如果存在会员价
      if (this.data.result.vip_sale_price > 0) {
        this.setData({
          totalPrice: this.data.result.vip_sale_price * this.data.num
        })
      } else {
        this.setData({
          totalPrice: this.data.result.sale_price * this.data.num
        })
      }

    }
  },

  onInput: function (e) {
    var tmp = parseInt(e.detail.value)
    //不能小于1
    if (tmp <= 1) {
      this.setData({
        num: 0
      })
      return
    }
    //不能大于99,或者当前报名人数加上已报名人数大于该课程报名上限
    if (tmp > 99 || tmp + 1 + this.data.reg_num > this.data.result.up_limit) return
    this.setData({
      num: tmp
    })
    this.checkUpdate()
  },


  //加
  add(e) {
    let tmp = this.data.num
    //不能大于99,或者当前报名人数加上已报名人数大于该课程报名上限
    if (tmp > 99 || tmp + 1 + this.data.reg_num > this.data.result.up_limit) return
    this.setData({
      num: tmp + 1
    })
    this.checkUpdate()
  },

  //减
  sub(e) {
    let tmp = this.data.num
    //不能小于1
    if (tmp <= 1) return
    let num = this.data.num - 1
    this.setData({
      num: tmp - 1
    })
    this.checkUpdate()
  },

  /**
   * 加载课堂详情页数据
   */
  api_206: function (opt) {
    var that = this
    let id = 0
    if (opt.id != undefined) {
      id = opt.id
    } else {
      const scene = decodeURIComponent(opt.scene)
      id = appG.util.getRequestId(scene, "id")
    }

    api.post(api.api_206, api.getSign({
      ID: id
    }), function (app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        that.setData({
          imgurl: res.data.Result.imgurl
        })

        //appG.util.date.dateFormat
        let dateNow = appG.util.date.getDateTimeNow()

        //是否过期
        if (appG.util.date.compareDate(dateNow, res.data.Result.course.start_date)) {
          that.setData({
            isOverdue: true
          })
        }

        //已报名人数
        that.setData({
          reg_num: res.data.Result.reg_num
        })

        res.data.Result.course.start_date = appG.util.date.dateFormat(res.data.Result.course.start_date, 'yyyy-MM-dd hh:mm')
        res.data.Result.course.end_date = appG.util.date.dateFormat(res.data.Result.course.end_date, 'yyyy-MM-dd hh:mm')
        that.setData({
          result: res.data.Result.course
        })

        //阶梯价
        let arr = JSON.parse(res.data.Result.course.ladder_prices)
        //如果开启阶梯价
        if (res.data.Result.course.is_ladder) {
          that.setData({
            ladder_prices: arr.sort(that.desc("count"))
          })
        }

        //如果存在会员价
        if (res.data.Result.course.vip_sale_price > 0) {
          that.setData({
            totalPrice: res.data.Result.course.vip_sale_price
          })
        } else {
          that.setData({
            totalPrice: res.data.Result.course.sale_price
          })
        }

        if (res.data.Result.course.details != undefined) {
          wxParse.wxParse('details', 'html', res.data.Result.course.details, that, 5)
        }
      }
    })
  },

  /**
   * 提交课程订单
   */
  api_326: function () {
    //剩余可报名人数
    let residue_num = this.data.result.up_limit - this.data.reg_num
    if (this.num - residue_num > 0) {
      return;
    }

    var that = this
    var order = {
      course_id: that.data.result.id,
      details: []
    }

    for (let i = 0; i < that.data.num; i++) {
      order.details.push({
        id: 0
      })
    }

    if (that.data.num == 0) {
      wx.showToast({
        title: '报名人数不能为0',
        icon: 'none',
        duration: 3000
      })
      return
    }

    if (that.data.num > that.data.result.single_limit) {
      wx.showToast({
        title: '每人报名人数不能超过' + that.data.result.single_limit,
        icon: 'none',
        duration: 3000
      })
      return
    }

    if (that.data.applyIng) return
    this.setData({ applyIng: true })

    api.post(api.api_326, api.getSign({
      Order: order
    }), function (app, res) {
      if (res.data.Basis.State != api.state.state_200) {
        wx.showToast({
          title: res.data.Basis.Msg,
          icon: 'none',
          duration: 3000
        })
      } else {
        let tmp_arr = user.methods.getPushMsg()
        let param = '?no=' + res.data.Result.serial_no + '&store_id=' + res.data.Result.store_id
        //课程
        if (that.data.result.type == 5) {
          router.goUrl({
            url: '../orderCourse/index' + param
          })
        } else {
          if (tmp_arr) {
            wx.requestSubscribeMessage({
              tmplIds: tmp_arr.aty_tmp_ids,
              success(res) { }
            })
          }
          router.goUrl({
            url: '../member/orderCourseList/index' + param + "&tid=" + that.data.result.type
          })
        }
      }
    })
  },

  /**
   * 数组降序
   */
  desc: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1
    }
  },

  /**
   * 数组升序
   */
  asc: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.api_206(opt)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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