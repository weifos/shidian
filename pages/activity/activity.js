// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    TabCur2: 0,
    scrollLeft: 0,
    activityData: [
      {
        title: "活动报名",
        list: [{
          "id": "1",
          "url": "/images/p6.png",
          "title": "老师名字·title",
          "name": "课程名称",
          "address": "这里是该课程上课的门店这里是该课程上课的门店这里是该课程上课的门店这里是该课程上课的门店",
          "time": "2019-07-29"
        }, {
          "id": "2",
          "url": "/images/p6.png",
          "title": "老师名字·title",
          "name": "课程名称",
          "address": "这里是该课程上课的门店",
          "time": "2019-07-29"
        },
        {
          "id": "3",
          "url": "/images/p6.png",
          "title": "老师名字·title",
          "name": "课程名称",
          "address": "这里是该课程上课的门店",
          "time": "2019-07-29"
        }
        ]
      },
      {
        title: "往期活动",
        list: [{
          "month": "1月",
          "list": [{
            "id": "1",
            "url": "/images/p6.png",
            "title": "老师名字·title",
            "name": "课程名称",
            "address": "这里是该课程上课的门店这里是该课程上课的门店这里是该课程上课的门店这里是该课程上课的门店",
            "time": "2019-07-29"
          }, {
            "id": "2",
            "url": "/images/p6.png",
            "title": "老师名字·title",
            "name": "课程名称",
            "address": "这里是该课程上课的门店",
            "time": "2019-07-29"
          },
          {
            "id": "3",
            "url": "/images/p6.png",
            "title": "老师名字·title",
            "name": "课程名称",
            "address": "这里是该课程上课的门店",
            "time": "2019-07-29"
          }],
        }, {
          "month": "2月",
          "list": [{
            "id": "1",
            "url": "/images/p6.png",
            "title": "老师名字·title",
            "name": "课程名称",
            "address": "这里是该课程上课的门店",
            "time": "2019-07-29"
          }, {
            "id": "2",
            "url": "/images/p6.png",
            "title": "老师名字·title",
            "name": "课程名称",
            "address": "这里是该课程上课的门店2",
            "time": "2019-07-29"
          },
          {
            "id": "3",
            "url": "/images/p6.png",
            "title": "老师名字·title",
            "name": "课程名称",
            "address": "这里是该课程上课的门店",
            "time": "2019-07-29"
          }],
        }]
      }
    ]
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  tabSelect2(e) {
    this.setData({
      TabCur2: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
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