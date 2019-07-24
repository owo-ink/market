<template lang="pug">
  .json-entry
    .title {{name}}
    Highlight(:contenteditable="true" v-model="inputText")
</template>

<script>
import Highlight from '@puge/highlight'
export default {
  props: {
    value: [Array, Object],
    name: String
  },
  data: function () {
    return {
      inputText: ''
    }
  },
  components: {
    Highlight
  },
  created () {
    this.inputText = this.value
  },
  methods: {
    updateValue (data) {
      this.showText = data
      this.$emit('input', String(data))
    },
    delate (ind) {
      let newValue = this.value
      newValue.splice(ind, 1)
      this.$emit('input', newValue)
    },
    add () {
      // 判断待添加项是否不合法（为空）
      if (!this.inputText) {
        alert('待添加值不能为空！')
        return null
      }
      let newValue = this.value
      newValue.push(this.inputText)
      this.$emit('input', newValue)
    }
  }
}
</script>

<style scoped>
  .json-entry {
    margin: 0 10px;
    padding: 0 10px;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #686868;
    border-bottom: 1px solid #ccc;
  }
  .highlighter {
    height: 300px;
  }
</style>