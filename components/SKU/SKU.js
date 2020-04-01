var api = require("../../modules/api.js")
var appGlobal = require("../../modules/appGlobal.js")
var user = require("../../modules/userInfo.js")

Component({

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: '',
    store_id: 0,
    hasSku: false,
    //是否加入购物车
    isJoinSCart: false,
    //显示sku模态框
    showDialog: false,
    stock: 0,
    selectSku: {
      stock: 0,
      specset: '',
      sale_price: 0,
      product_id: 0
    },
    buyCount: 1,
    specSet: [],
    pResult: {}
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //false加入购物车，true立即购买
    type: Boolean,
    result: Object,
    isShow: Boolean,
    storeId: Number
  },
  observers: {
    'isShow': function(field) {
      this.setData({
        showDialog: field
      })
    },
    'result': function(field) {
      this.setData({
        pResult: field
      })
      this.init()
    },
    'type': function(field) {
      this.setData({
        isJoinSCart: field
      })
    },
    'storeId': function(field) {
      this.setData({
        store_id: field
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化
    init: function() {
      if (this.data.pResult.product.id != undefined) {
        if (this.data.pResult.product.product_type_id > 0) {
          if (this.data.pResult.specNames.length == 0) return
          //获取首行规格名称id
          let one_name_id = this.data.pResult.specNames[0].id
          //绑定首行状态
          this.bindSKU(one_name_id)
        } else {
          this.setData({
            selectSku: this.data.pResult.skus[0]
          }) 
        }
      }
    },
    //规格选中事件
    check(e) {
      let that = this
      //当前选择的sku
      let item = e.currentTarget.dataset.item
      //是否可用点击
      if (!item.is_enable) return
      //当前索引      
      var i = this.data.pResult.specNames.findIndex((val) => val.id == item.specname_id)
      //设置点击状态
      this.data.pResult.specValues.filter(val => val.specname_id == item.specname_id).map(function(obj, index, arr) {
        obj.checked = false
        if (item.id == obj.id) {
          obj.checked = true
        }
      })
      this.setData({
        pResult: this.data.pResult
      })
       
      //判断下一行索引是否大于数组总长度 
      if (i + 1 > this.data.pResult.specNames.length - 1) {
        //全部选中
        this.getSelectSkuVal()
      } else {
        //清除未选择的状态
        let clearSpecNames = this.data.pResult.specNames.filter((val, index) => index > i)
        clearSpecNames.forEach(function(item, index) {
          that.data.pResult.specValues.map(function(obj, i) {
            if (obj.specname_id == item.id) {
              obj.checked = false
              obj.is_enable = false
            }
          })
        })

        //绑定下一行
        this.bindSKU(this.data.pResult.specNames[i + 1].id, item)
      }
    },
    //绑定每行sku状态
    bindSKU(spec_name_id, specVal) {
      //SKU集合
      let skus = this.data.pResult.skus
      let checkedVal = this.data.pResult.specValues.filter(val => val.checked).map(item => item.specname_id + "_" + item.id).join(',')

      //处理规格值
      this.data.pResult.specValues.filter(val => val.specname_id == spec_name_id).map(function(obj, index) {
        obj.checked = false
        obj.is_enable = false

        //在sku集合里面获取首行可点的规格
        skus.forEach(function(item, index) {
          if (item.stock <= 0) {
            obj.is_enable = false
            return
          }
          let exist = 0
          let pass = false
          let arr = checkedVal.split(',')
          let arr1 = item.specset.split(',')
          arr.forEach(function(o, i) {
            arr1.forEach(function(oo, ii) {
              if (oo == o) {
                exist++
              }
            })
          })

          //是否是第一次加载
          if (checkedVal.length) {
            pass = exist == arr.length
          } else {
            pass = true
          }

          item.specset.split(',').forEach(function(o, i) {
            if (pass && o.split('_')[0] == spec_name_id && obj.specname_id + "_" + obj.id == o) {
              obj.is_enable = true
              return
            }
          })
        })

        if (specVal != undefined && specVal.id == obj.id) {
          obj.checked = true
        }
      })

      this.setData({
        pResult: this.data.pResult
      })
    },
    //获取选中完成的sku
    getSelectSkuVal() {
      let items = this.data.pResult.specValues.filter(val => val.checked == true)
      if (items.length < this.data.pResult.specNames.length) {
        let name = this.data.pResult.specNames[items.length].name
        wx.showToast({
          title: "请选择" + name,
          icon: 'none',
          duration: 3000
        })
        return null
      }

      let data = null
      //获取选中数据
      let sku_id = items.map(item => item.specname_id + "_" + item.id).join(',')
      //在当前sku集合中获取
      this.data.pResult.skus.forEach(function(item, index) {
        if (appGlobal.util.compareSku(sku_id, item.specset)) {
          data = item
          return
        }
      })

      this.setData({
        selectSku: data
      })

      return data
    },
    //提交
    submit(is_hide_dialog) {
      is_hide_dialog = undefined != is_hide_dialog.xx
      //获取选中数据
      let result = this.getSelectSkuVal()
      //设置选中
      this.setData({
        selectSku: result
      })
      //加入购物车
      this.api_306(is_hide_dialog)
    },
    //是否关闭sku弹框
    close() {
      this.setData({
        showDialog: false
      })
      this.setData({
        ["selectSku.specset"]: '',
        ["selectSku.sale_price"]: 0,
        ["selectSku.product_id"]: 0
      })
    },
    //加
    add() {
      if (this.data.buyCount >= 99) return
      let num = this.data.buyCount + 1
      this.setData({
        buyCount: num
      })
    },
    //减
    sub() {
      if (this.data.buyCount <= 1) return
      let num = this.data.buyCount - 1
      this.setData({
        buyCount: num
      })
    },
    //处理输入方式
    handleInput() {
      let value = this.validateNumber(e.detail.value)
      val.replace(/\D/g, '')
      this.setData({
        value
      })
    },
    /**
     * 加入购物车
     */
    api_306: function(is_hide_dialog) {

      var that = this
      //是否包邮
      let is_postage = this.data.pResult.product.is_postage == undefined ? false : this.data.pResult.product.is_postage
      //立即购买
      if (this.data.isJoinSCart) {
        let list = [{
          store_id: this.data.store_id,
          product_id: this.data.selectSku.product_id,
          sto_product_id: this.data.selectSku.sto_product_id,
          is_postage: is_postage,
          specset: this.data.selectSku.specset,
          img_url: this.data.pResult.product.img_url,
          product_name: this.data.selectSku.product_name,
          product_en_name: this.data.selectSku.product_en_name,
          product_price: this.data.selectSku.sale_price,
          subtotal: this.data.selectSku.sale_price * this.data.buyCount,
          count: this.data.buyCount
        }]

        //提交到本地存储临时数据
        user.methods.buyNow(list)
        //加入购物车
      } else {
        let that = this
        api.post(api.api_306,
          api.getSign({
            StoreId: this.data.store_id,
            SPID: this.data.selectSku.sto_product_id,
            PID: this.data.pResult.product.product_id,
            SpecSet: this.data.selectSku.specset,
            Count: this.data.buyCount
          }),
          function(vue, res) {
            if (res.data.Basis.State == api.state.state_200) {
              that.setData({
                showDialog: is_hide_dialog
              })
              //更新父级页面事件
              that.triggerEvent('updateSCart', res.data)
            } else {
              wx.showToast({
                title: res.data.Basis.Msg,
                icon: 'none',
                duration: 3000
              })
            }
          }
        )
      }
    },
    /**
     * 提交订单
     */
    api_314: function() {
      var that = this;
      api.post(api.api_314, api.getSign({}), function(app, res) {
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
    }
  }
})