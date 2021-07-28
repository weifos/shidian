var api = require("../../modules/api.js")
var router = require("../../modules/router.js")
var appG = require("../../modules/appGlobal.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    tabCur2: 0,
    scrollLeft: 0,
    pageSize: 6,
    banners: [],
    catgs: [],
    options: [],
    //选择门店ID
    select_id: -1,
    //查询关键词
    keyword: '',
    def_options: {
      id: '-1',
      name: '请选择门店'
    },
    courseData: [{
      title: "课程报名",
      loading: false,
      pageIndex: 0,
      list: []
    },
    {
      title: "往期课堂",
      list: []
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inItHistoryMonth()
    this.api_205()
  },

  /**
   * 切换当前还是过往
   */
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /**
   * 切换月份
   */
  tabSelect2(e) {
    this.setData({
      tabCur2: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.api_207()
  },

  /**
   * 选择门店
   */
  rechargeSelect(e) {
    this.setData({
      checkIndex: e.currentTarget.dataset.id
    })
  },

  /**
   * 加载今年历史月份
   */
  inItHistoryMonth() {
    let list = []
    let myDate = new Date()
    let tMonth = myDate.getMonth() + 1
    for (let i = 0; i < tMonth; i++) {
      list.push({
        month: i + 1 + "月",
        loadComplete: false,
        items: []
      })
    }
    this.setData({
      ['courseData[1].list']: list
    })
  },

  /**
   * 加载课堂页数据
   */
  api_205: function () {
    var that = this
    //当前选中索引
    let index = this.data.tabCur
    //当前选中项
    let curItem = this.data.courseData[index]

    if (!curItem.loading && !curItem.loadComplete) {
      api.post(api.api_205, api.getSign({
        Type: 5,
        Size: that.data.pageSize,
        StoreID: that.data.select_id,
        KeyWord: that.data.keyword,
        Index: that.data.courseData[0].pageIndex
      }), function (app, res) {

        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {

          //门店数据
          that.setData({
            ['options']: res.data.Result.stores
          })

          //banner数据
          if (that.data.tabCur == 0 && curItem.pageIndex == 0) {
            res.data.Result.banners.map(function (obj, index, arr) {
              obj.type = "image"
              obj.url = obj.imgurl
            })
            //banner数据
            for (let item of res.data.Result.banners) {
              that.data.banners.push(item)
            }
            that.setData({
              banners: that.data.banners
            })

            //将banner数据写入缓存
            appG.storage.swiper.setCourseBanner(res.data.Result.banners)
          }

          curItem.loading = false
          curItem.pageIndex = curItem.pageIndex + 1
          res.data.Result.course.forEach(function (o, i) {
            o.start_date = appG.util.date.dateFormat(o.start_date, 'yyyy-MM-dd hh:mm')
            curItem.list.push(o)
          })
          that.setData({
            ['courseData[' + index + ']']: curItem
          })
          //是否全部加载完毕
          if (res.data.Result.course.length == 0) {
            curItem.loadComplete = true
            that.setData({
              ['courseData[' + index + ']']: curItem
            })
            wx.showToast({
              title: '加载完成',
              icon: 'success',
              duration: 3000
            })
          }
        }
      })
    }
  },

  /**
   * 加载课程历史数据
   */
  api_207: function () {
    var that = this
    //当前选中索引
    let index = this.data.tabCur2
    //当前选中项
    let curItem = this.data.courseData[1].list[index]
    //如果没加载过
    if (!curItem.loadComplete) {
      api.post(api.api_207, api.getSign({
        Type: 5,
        Month: index + 1
      }), function (app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          curItem.loadComplete = true
          res.data.Result.forEach(function (o, i) {
            o.start_date = appG.util.date.dateFormat(o.start_date, 'yyyy-MM-dd hh:mm')
            curItem.items.push(o)
          })
          that.setData({
            ['courseData[1].list[' + index + ']']: curItem
          })
        }
      })
    }
  },

  /**
   * 菜单跳转
   */
  goUrl: function (e) {
    //跳转地址
    let url = '../courseDetail/courseDetail?id=' + e.currentTarget.dataset.id
    //跳转
    router.goUrl({
      url: url
    })
  },
  

  /**
   * banner点击事件
   */
  bannerClick: function (e) {
    let that = this
    let url = '../courseDetail/courseDetail?id=' + item.content_value
    //跳转
    router.goUrl({
      url: url
    })
  },


  /**
   * 门店选择切换
   */
  change: function (e) {
    let that = this

    //设置选择门店ID
    that.setData({
      select_id: e.detail.id
    })

    //当前选中索引
    let index = that.data.tabCur
    let curItem = that.data.courseData[index]
    curItem.pageIndex = 0
    curItem.loadComplete = false
    curItem.list = []
    that.setData({
      ['courseData[' + index + ']']: curItem
    })

    that.api_205()
  },

  /**
   * 门店选择切换
   */
  inputSearch: function (e) {
    let that = this

    //当前选中索引
    let index = that.data.tabCur
    let curItem = that.data.courseData[index]
    curItem.pageIndex = 0
    curItem.loadComplete = false
    curItem.list = []
    that.setData({
      ['courseData[' + index + ']']: curItem
    })

    that.api_205()
  },

  /**
 * 绑定充值输入
 */
  bindInput: function (e) {
    var that = this
    let value = e.detail.value
    that.setData({
      keyword: value
    })
    
    console.log(value)
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
    this.api_205()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})