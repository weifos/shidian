Component({
  properties: {
    options: {
      type: Array,
      value: []
    },
    defaultOption: {
      type: Object,
      value: {
        id: '0',
        name: '请选择'
      }
    },
    key: {
      type: String,
      value: 'id'
    },
    text: {
      type: String,
      value: 'name'
    }
  },
  observers: { 
    'options': function(field) {
      this.setData({
        _result: field
      }) 
    }
  },
  data: {
    _result: [],
    isShow: false,
    current: {}
  },
  methods: {
    optionTap(e) {
      let dataset = e.target.dataset
      this.setData({
        current: dataset,
        isShow: false
      });

      // 调用父组件方法，并传参
      this.triggerEvent("change", { ...dataset
      })
    },
    openClose() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    // 此方法供父组件调用
    close() {
      this.setData({
        isShow: false
      })
    }
  },
  lifetimes: {
    attached() {
      // 属性名称转换, 如果不是 { id: '', name:'' } 格式，则转为 { id: '', name:'' } 格式
      let result = []
      if (this.data.key !== 'id' || this.data.text !== 'name') {
        for (let item of this.data._result) {
          let {
            [this.data.key]: id, [this.data.text]: name
          } = item
          result.push({
            id,
            name
          })
        }
      } else {
        result = this.data._result
      }

      this.setData({
        current: Object.assign({}, this.data.defaultOption),
        result: result
      })
    }
  }
})