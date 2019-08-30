var router = require("../../modules/router.js")

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 查看门店详情
     */
    nav: function (e) { 
      router.goUrl({
        url: e.currentTarget.dataset.url
      })
    }
  }
})
