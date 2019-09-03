<template lang="pug">
  .color-selection.control-entry
    span.control-text {{name}}
    .input-box
      .color-input
        .input-color(:style="{background: value || def}")
          input(type="color", :value="value || def ", @input="updateValue($event.target.value)")
      input.text(type="text", :value="value || ''", :placeholder="def", @blur="updateValue($event.target.value)")
</template>

<script>
export default {
  props: {
    value: String,
    name: String,
    emit: String,
    def: {
      type: String,
      default: '#333333'
    }
  },
  data: function () {
    return {
      showText: null
    }
  },
  created () {
    const copy = this.value
    if (copy) {
      if (copy.indexOf('url') >= 0) {
        this.showText = '图片'
      } else {
        this.showText = copy
      }
    }
  },
  methods: {
    updateValue (data) {
      this.showText = data
      this.$emit('input', String(data))
    }
  }
}
</script>

<style lang="less" scoped>
  .control-entry {
    border-bottom: 1px solid #e9e9e9;
    height: 40px;
    line-height: 40px;
    align-items: center;
    font-size: 12px;
    color: #333333;
    display: flex;
    margin: 0 10px;
    padding: 0 10px;
    justify-content: space-between;
  }
    

  .control-text, .auto-text {
    width: 100px;
    overflow: hidden;
    height: 40px;
  }
    
  .input-box {
    width: 118px;
    height: 30px;
    line-height: 30px;
    background: #FFFFFF;
    border: 1px solid #E9E9E9;
    display: flex;
    overflow: hidden;
    .text {
      width: 84px;
      height: 30px;
      text-indent: 10px;
      background: transparent;
      line-height: 30px;
      font-size: 12px;
      color: #333333;
      outline: none;
      border: none;
    }
    .color-input {
      border-right: 1px solid #e9e9e9;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: relative;
      .input-color {
        width: 16px;
        height: 16px;
      }
      input {
        opacity: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }  
  }
</style>