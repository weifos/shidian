// pages/sale/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex:0,
    saleData:[
      {
        "name":"精品咖啡",
        "list":[
          {
            "url":"/images/p5.png",
            "name":"摩卡咖啡",
            "star":5,
            "price":"35",
            "type": ['冷', '热', '加糖', '不加糖']
          },
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": 3,
            "price": "35",
            "type": ['冷', '热']
          },
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": 4,
            "price": "35",
            "type": ['冷', '热']
          },
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": 4,
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      },
      {
        "name": "精品咖啡",
        "list": [
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": "5",
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      },
      {
        "name": "精品咖啡",
        "list": [
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": "5",
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      },
      {
        "name": "精品咖啡",
        "list": [
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": "5",
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      },
      {
        "name": "精品咖啡",
        "list": [
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": "5",
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      },
      {
        "name": "精品咖啡",
        "list": [
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": "5",
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      },
      {
        "name": "精品咖啡",
        "list": [
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": "5",
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      },
      {
        "name": "精品咖啡",
        "list": [
          {
            "url": "/images/p5.png",
            "name": "摩卡咖啡",
            "star": "5",
            "price": "35",
            "type": ['冷', '热']
          }
        ]
      }
    ]
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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