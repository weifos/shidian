var api = require("../../modules/api.js")
var user = require("../../modules/userInfo.js")
var router = require("../../modules/router.js")
var appGlobal = require("../../modules/appGlobal.js")

Page({
    /**
     * 页面的初始数据
     */
    data: {
        //门店ID
        store_id: 0,
        //banner集合
        banners: [],
        //是否提交订单
        isSubmit: false,
        //选择sku弹框
        isSelectSKU: false,
        //商品详情
        productDetails: {
            product: {
                name: ''
            },
            skus: [],
            specNames: [],
            specValues: [],
            specCustoms: []
        },
        //每页大小
        pageSize: 10,
        //购物车总金额
        totalPrice: 0,
        //分类ID
        catgId: 0,
        //当前分类选中=索引
        curIndex: 0,
        //页面数据
        result: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (opt) {
        //banner数据
        this.setData({
            banners: appGlobal.storage.swiper.getCoffeeBanner()
        })

        let store = user.methods.getStore()
        this.setData({
            store_id: store.store_id
        })
        //加载购物车
        this.api_302()
        //加载数据
        this.api_202(opt.id)
    },

    /**
     * 初始化加载获
     */
    api_202: function (catg_id) {
        var that = this;
        api.post(api.api_202, api.getSign({
            StoreID: that.data.store_id,
            CatgID: catg_id,
            Size: that.data.pageSize
        }), function (app, res) {
            if (res.data.Basis.State != api.state.state_200) {
                wx.showToast({
                    title: res.data.Basis.Msg,
                    icon: 'none',
                    duration: 3000
                })
            } else {
                that.setData({
                    result: res.data.Result.catgs
                })

                //初始化数据
                that.initData(res.data.Result.catgs, res.data.Result.productList)
                //设置选中类别
                that.setCatgId(catg_id)
            }
        })
    },

    /**
     * 取购物车信息
     */
    api_302: function () {
        var that = this;
        api.post(api.api_302, api.getSign({
            StoreID: that.data.store_id
        }), function (app, res) {
            if (res.data.Basis.State != api.state.state_200) {
                wx.showToast({
                    title: res.data.Basis.Msg,
                    icon: 'none',
                    duration: 3000
                })
            } else {
                //小计
                let total_price = 0
                res.data.Result.forEach((item, index, arr) => {
                    total_price += item.count * item.product_price
                })
                that.setData({
                    totalPrice: total_price
                })

                //设置购物车信息
                user.methods.setShoppingCart(res.data.Result)
            }
        })
    },

    /**
     * 加载商品详情
     */
    api_203: function (item) {
        let that = this
        api.post(api.api_203, api.getSign({
            StoreId: that.data.store_id,
            ID: item.id,
            TID: item.product_type_id
        }), function (app, res) {
            if (res.data.Basis.State != api.state.state_200) {
                wx.showToast({
                    title: res.data.Basis.Msg,
                    icon: 'none',
                    duration: 3000
                })
            } else {
                //设置商品集合
                that.setData({
                    //门店商品ID
                    ["productDetails.product.id"]: item.id,
                    //平台商品ID
                    ["productDetails.product.product_id"]: item.product_id,
                    ["productDetails.product.name"]: item.name,
                    ["productDetails.product.img_url"]: item.img_url,
                    ["productDetails.skus"]: res.data.Result.skus,
                    ["productDetails.specNames"]: res.data.Result.specNames,
                    ["productDetails.specValues"]: res.data.Result.specValues,
                    ["productDetails.specCustoms"]: res.data.Result.specCustoms
                })
            }
        })
    },

    /**
     * 设置类别ID
     */
    setCatgId: function (catg_id) {

        let that = this
        //初始化选中的类别ID
        this.setData({
            catgId: catg_id
        })

        //更新结果集合
        this.setData({
            result: this.data.result
        })

        //设置选中索引
        this.data.result.forEach(function (o, i, a) {
            if (o.id == catg_id) {
                that.setData({
                    curIndex: i
                })
                return
            }
        })
    },

    /**
     * 绑定商品数据
     */
    initData: function (catgs, pdtList) {
        //obj.pdtList = []
        this.data.result.map(function (obj, index, arr) {
            //分类对应的商品集合
            obj.pdtList = []
            //商品对应分类
            pdtList.forEach(function (o, i, a) {
                if (obj.id == o.gcatg_id) {
                    obj.pdtList.push(o)
                }
            })
        })

        //更新结果集合
        this.setData({
            result: this.data.result
        })

    },

    /**
     * 设置选择类别
     */
    selectCatg: function (e) {
        //类别id
        let catg_id = e.currentTarget.dataset.id
        //设置选中类别
        this.setCatgId(catg_id)
    },
    /**
     * 选择商品SKU
     */
    showModal(e) {
        //商品信息 
        let item = e.currentTarget.dataset.item
        //加载商品SKU
        this.api_203(item)
        //弹出目标
        this.setData({
            isSelectSKU: true
        })
    },
    /**
     * 更新购物车
     */
    updateSCart(e) {
        console.log(e.detail)
        this.api_302()
    },
    /**
     * 菜单跳转
     */
    goUrl: function () {
        router.goUrl({
            url: '../shoppingCart/index'
        })
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