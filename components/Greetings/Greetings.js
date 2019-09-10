// components/Greetings/Greetings.js
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
    //标题
    title: ""
  },
  /**
   * 生命周期函数--在组件实例刚刚被创建时执行
   */
  created: function(options) { 
  },
  /**
   * 生命周期函数--在组件实例进入页面节点树时执行
   */
  ready() {
    let title = this.getTitle()
    this.setData({
      title: title
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 上午好,下午好,傍晚好,晚上好
     */
    getTitle: function(options) {
      let now = new Date(),
        hour = now.getHours()
      if (hour < 6) {
        return "凌晨好！"
      } else if (hour < 9) {
        return "早上好！"
      } else if (hour < 12) {
        return "上午好！"
      } else if (hour < 14) {
        return "中午好！"
      } else if (hour < 17) {
        return "下午好！"
      } else if (hour < 19) {
        return "傍晚好！"
      } else if (hour < 22) {
        return "晚上好！"
      } else {
        return "夜里好！"
      }
    }

  }
})