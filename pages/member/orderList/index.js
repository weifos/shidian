var api = require("../../../modules/api.js")
var appG = require("../../../modules/appGlobal.js")
var passport = require("../../../modules/passport.js")
var user = require("../../../modules/userInfo.js")
var router = require("../../../modules/router.js")

Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabCur: 0,
        //每页大小
        pageSize: 5,
        scrollLeft: 0,
        orderData: [{
            title: "全部",
            loading: false,
            loadComplete: false,
            pageIndex: 0,
            list: []
        },
        {
            title: "待付款",
            loading: false,
            pageIndex: 0,
            list: []
        },
        {
            title: "已支付",
            loading: false,
            pageIndex: 0,
            list: []
        }
        ]
    },

    /**
     * 选择查询
     */
    tabSelect(e) {
        this.setData({
            tabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
        this.api_318()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.api_318()
    },

    /**
     * 加载订单数据
     */
    api_318: function () {
        let that = this
        //付款状态
        let isPay = 0
        //当前选中索引
        let index = this.data.tabCur
        //当前选中项
        let curItem = this.data.orderData[index]
        //是否加载中
        let loading = curItem.loading
        //是否加载完成
        let loadComplete = curItem.loadComplete

        if (index == 0) {
            isPay = -1
        } else if (index == 1) {
            isPay = 1
        } else if (index == 2) {
            isPay = 0
        }

        //是否加载中，是否加载完成
        if (!curItem.loading && !curItem.loadComplete) {

            //请求接口数据
            api.post(api.api_318, api.getSign({
                IsPay: isPay,
                Size: that.data.pageSize,
                Index: curItem.pageIndex
            }), function (app, res) {
                if (res.data.Basis.State != api.state.state_200) {
                    wx.showToast({
                        title: res.data.Basis.Msg,
                        icon: 'none',
                        duration: 3000
                    })
                } else {
                    curItem.loading = false
                    curItem.pageIndex = curItem.pageIndex + 1
                    res.data.Result.orders.forEach(function (o, i) {
                        curItem.list.push(o)
                    })
                    that.setData({
                        ['orderData[' + index + ']']: curItem
                    })

                    //是否全部加载完毕
                    if (res.data.Result.orders.length == 0) {
                        curItem.loadComplete = true
                        that.setData({
                            ['orderData[' + index + ']']: curItem
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
    onReachBottom: function (result) {
        this.api_318()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})