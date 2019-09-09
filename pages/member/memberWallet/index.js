var user = require("../../../modules/userInfo.js")
import QRCode from '../../../modules/weapp-qrcode.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    user_code: 0,
    timer: {
      setInter: '',
      num: 0
    },
    tabData: [{
        title: "我的钱包",
        list: [{
            "value": 100,
            "discount": "赠送30元"
          },
          {
            "value": 100,
            "discount": "赠送30元"
          },
          {
            "value": 100,
            "discount": "赠送30元"
          },
          {
            "value": 100,
            "discount": "赠送30元"
          },
          {
            "value": 100,
            "discount": "赠送30元"
          }
        ]
      },
      {
        title: "付款码",
        list: []
      }
    ]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    //优惠券
    let cid = 0
    if (opt.cid != undefined) {
      cid = opt.cid
    }

    //获取用户信息
    let _user = user.methods.getUser()
    this.setData({
      user_code: _user.user_id + '#' + cid + '#'
    })

    this.createQRCode(this.data.user_code)
    this.startSetInter()
  },
  /**
   * 开始计时器
   */
  startSetInter: function() {
    let that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function() {
        let numVal = that.data.timer.num + 1
        if (numVal > 30) {
          numVal = 0;
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
   * 生成二维码
   * 用户ID#优惠券ID#时间戳
   */
  createQRCode(str) {
    //时间戳
    let time_ticket = new Date().getTime()
    console.log(str + time_ticket)

    new QRCode('myQrcode', {
      text: str + time_ticket,
      width: 200,
      height: 200,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path)
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
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