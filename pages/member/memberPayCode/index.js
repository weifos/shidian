var user = require("../../../modules/userInfo.js")
var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var passport = require("../../../modules/passport.js")
var router = require("../../../modules/router.js")
import QRCode from '../../../modules/weapp-qrcode.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: 0,
    cname: '',
    tname: '',
    userInfo: {
      id: 0,
      nick_name: '未设置',
      login_name: '未登录',
      headimgurl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg',
    },
    user_code: 0,
    timer: {
      setInter: '',
      num: 0
    }
  },

  /**
   * 开始计时器
   */
  startSetInter: function() {
    let that = this
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function() {
        let numVal = that.data.timer.num + 1
        if (numVal > 30) {
          numVal = 0
          that.createQRCode(that.data.user_code)
        }
        that.setData({
          ['timer.num']: numVal
        });
      }, 1000);
  },

  /**
   * 开始计时器
   */
  endSetInter: function() {
    let that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },

  /**
   * 选择优惠券
   */
  selectTicket: function() {
    router.goUrl({
      url: '../ticketList/index?s=1&isPayCode=true'
    })
  },

  /**
   * 生成二维码
   * 用户ID#优惠券ID#时间戳
   */
  createQRCode(str) {
    //时间戳
    let time_ticket = new Date().getTime()
    //console.log(str + time_ticket)
    new QRCode('myQrcode', {
      text: str + time_ticket,
      width: 180,
      height: 180,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path)
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    //优惠券
    if (opt.cid != undefined && opt.cname != undefined && opt.tname != undefined) {
      this.setData({
        cid: opt.cid
      })
      this.setData({
        cname: opt.cname
      })
      this.setData({
        tname: opt.tname
      })
    }

    //获取用户信息
    let _user = user.methods.getUser()
    //获取用户ID信息
    let str1 = appG.util.getPlaceholder('000000000000000', _user.user_id)
    //let str1 = appG.util.getPlaceholder('000000000000000', 71349)
    //获取用户优惠券
    let str2 = appG.util.getPlaceholder('000000000000000', this.data.cid)

    //设置付款码
    this.setData({
      user_code: str1 + str2
    })
    this.bindUser(_user)
 
    this.createQRCode(this.data.user_code)
    //this.startSetInter()

    setTimeout(() => {
      this.createQRCode(this.data.user_code)
      this.startSetInter()
    }, 1000)

  },
  
  /**
   * 加载微信用户信息
   */
  bindUser: function(user) {

    if (user.nickname) {
      this.setData({
        ['userInfo.nick_name']: user.nickname
      })
    }

    this.setData({
      ['userInfo.login_name']: appG.util.getHideMobile(user.login_name)
    })

    this.setData({
      ['userInfo.headimgurl']: user.headimgurl
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