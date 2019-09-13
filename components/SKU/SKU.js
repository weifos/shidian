var appGlobal = require("../../modules/appGlobal.js")

Component({

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: '',
    hasSku: false,
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
    isShow: Boolean
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
    'selectSku.sale_price': function(field) {
      // this.setData({
      //   ["selectSku.sale_price"]: appGlobal.util.formaToMoney(field, 2)
      // })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化
    init: function() {
      if (this.data.pResult.specNames.length == 0) return
      //获取首行规格名称id
      let one_name_id = this.data.pResult.specNames[0].id
      //绑定首行状态
      this.bindSKU(one_name_id)
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

      let result = {
        stock: data.stock,
        specset: data.specset,
        sale_price: data.sale_price,
        product_id: data.product_id
      }

      this.setData({
        selectSku: result
      })

      return result
    },
    //提交
    submit() {
      //获取选中的集合
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
      //获取选中数据
      let result = items.map(item => item.specname_id + "_" + item.id).join(',')
      //console.log(result)
      return result
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
      let d = this.data.buyCount + 1
      this.setData({
        buyCount: d
      })

      this.submit()
    },
    //减
    sub() {
      if (this.buyCount <= 1) return
      this.setData({
        buyCount: this.data.buyCount--
      })

      this.submit()
    },
    //处理输入方式
    handleInput() {
      let value = this.validateNumber(e.detail.value)
      val.replace(/\D/g, '')
      this.setData({
        value
      })
    }
  }
})