// components/SKU/SKU.js
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
      console.log(this.data.pResult)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //是否关闭sku弹框
    close() {
      this.setData({
        showDialog: false
      })

      this.setData({
        ["selectSku.specset"]: ''
      })

      this.setData({
        ["selectSku.sale_price"]: 0
      })

      this.setData({
        ["selectSku.product_id"]: 0
      })
 
    }, 
    //初始化sku
    initSku() {
      let $this = this
      let skus = this.pResult.skus
      let tmp_stock = 0

      //统计全部库存
      this.stock = skus.forEach((item, index) => {
        tmp_stock += item.stock
      })
      this.stock = this.stock == undefined ? 0 : this.stock
      if (tmp_stock > 0) {
        $this.stock = tmp_stock
      }

      $('li[data-v]').removeClass('selected').removeClass('activecss')
      //默认拿第一组做为标准
      $.each($('div.chocolates:eq(0) li[data-v]'), function(i, o) {
        let is_exists = 0
        //当前规格值
        let spec_val = $(o).attr('data-v')
        $.each(skus, function(j, k) {
          $.each(k.specset.split(','), function(l, m) {
            if (m == spec_val) {
              is_exists++
            }
          })
        })

        if (is_exists != 0) {
          //直接找不到，暂时通过属性获取
          //$(o).addClass('activecss')
          $("[data-v=" + $(o).attr("data-v") + "]").addClass('activecss')
        }
      })

      //选择规格
      $('div.Ma_c_title3').on('click', 'li[data-v]', function() {
        if (!$(this).hasClass('activecss')) return
        //样式控制
        $(this)
          .addClass('selected')
          .siblings()
          .removeClass('selected')
        //对应关联下组sku
        $this.nextSkuInit($(this))
        //规格是否全部选中
        if ($('li.selected').length == $('div.chocolates').length) {
          let specVal = $this.getSelectSkuVal()
          $this.pResult.skus.forEach(item => {
            let exists_count = 0
            $.each(item.specset.split(','), function(i, o) {
              $.each(specVal.split(','), function(j, k) {
                if (o == k) {
                  exists_count++
                  return false
                }
              })
            })

            if (exists_count == specVal.split(',').length) {
              $this.$set(item, 'selected', true)
              $this.hasSku = true
              $this.check()
            }
          })
        }
      })
    }, //当前sku关联下组是否可用
    nextSkuInit(obj) {
      let $this = this
      //当前元素索引
      let index = obj
        .parent()
        .parent()
        .index()
      //sku集合
      let skus = this.pResult.skus
      //清除样式
      $('div.chocolates:gt(' + index + ')')
        .find('li')
        .removeClass('activecss')
        .removeClass('selected')
      //下一组对应的规格
      let eles = $('div.chocolates:eq(' + (index + 1) + ')').find('li[data-v]')

      if (eles.length) {
        $.each(eles, function(i, o) {
          let is_enable = false
          //当前规格值
          let spec_val = $this.getSelectSkuVal() + ',' + $(o).attr('data-v')
          skus.forEach(item => {
            let exists_count = 0
            $.each(item.specset.split(','), function(l, m) {
              $.each(spec_val.split(','), function(i, k) {
                if (m == k) {
                  exists_count++
                  return false
                }
              })
            })

            if (exists_count == index + 2) {
              is_enable = true
            }
            //重置选中的sku
            $this.$set(item, 'selected', false)
            $this.hasSku = false
          })

          if (is_enable) {
            $(o).addClass('activecss')
          }
        })
      }
    }, //获取选中的规格值
    getSelectSkuVal() {
      let param = ''
      $.each($('li[data-v].selected'), function(i, o) {
        if (param == '') {
          param += $(o).attr('data-v')
        } else {
          param += ',' + $(o).attr('data-v')
        }
      })
      return param
    }, //处理自定义规格名
    getSpecCustom(name_id, val_id, val) {
      let custom_name = val
      this.result.specCustoms.forEach((item, index) => {
        if (
          name_id == item.specname_id &&
          val_id == item.specvalue_id &&
          item.custom_value != ''
        ) {
          custom_name = item.custom_value
          return
        }
      })
      return custom_name
    }, //是否选中规格
    check() {
      let $this = this
      let isCheck = true
      //购买数量库存判断
      if (this.buyCount > 99 || this.buyCount < 1) return false

      $.each($('div.chocolates'), function(i, o) {
        let isSelected = false
        $.each($(o).find('li[data-v]'), function(j, k) {
          if ($(k).hasClass('selected')) {
            isSelected = true
            return false
          }
        })

        if (!isSelected) {
          $this.$vux.alert.show({
            title: '消息提醒',
            content: '请选择：' + $(o).find('p').attr('title'),
            onShow() {},
            onHide() {}
          })
          isCheck = false
          return false
        }
      })

      if (isCheck) {
        //获取选中的sku
        let spec_val = this.getSelectSkuVal()
        this.pResult.skus.forEach(item => {
          let exists_count = 0
          $.each(item.specset.split(','), function(l, m) {
            $.each(spec_val.split(','), function(i, k) {
              if (m == k) {
                exists_count++
                return false
              }
            })
          })

          if (exists_count == item.specset.split(',').length) {
            $this.selectSku = item
            return false
          }
        })

        //库存校验
        if (this.buyCount > $this.selectSku.stock) {
          $this.$vux.alert.show({
            title: '消息提醒',
            content: '当前库存不足：' + this.buyCount,
            onShow() {},
            onHide() {}
          })
          isCheck = false
        }
      }
      return isCheck
    }, //加
    add() {
      if (this.buyCount >= 99) return
      this.buyCount++
        this.check()
    }, //减
    sub() {
      if (this.buyCount <= 1) return
      this.buyCount--
        this.check()
    }
  }
})