<template lang="pug">
  .control-entry
    span.auto-text {{name}}
    .input-box(:class="{ number: type === Number && step !== 0}")
      template(v-if="type === Number")
        .icon.add(v-if="step !== 0", @click="changeValue(value + step)") &#xe603;
        input.auto-input(type="number", :value="value", :placeholder="def", @change="updateValue($event)")
        .icon.reduce(v-if="step !== 0", @click="changeValue(value - step)") &#xe7ac;
      input.auto-input(v-else, type="text", :value="value", :placeholder="def", @change="updateValue($event)")
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      default: Number
    },
    max: Number,
    min: Number,
    name: {
      type: String,
      default: ''
    },
    step: {
      type: Number,
      default: 1
    },
    def: [Number, String]
  },
  methods: {
    // 数值变化
    updateValue (event) {
      const value = event.target.value
      // 如果文本框中没有数值 则不做修改
      if (!value) {
        event.target.value = this.value
        event.preventDefault()
        return
      }
      let newData = null
      // 判断设置的数据类型是否为数字
      if (this.type === Number || this.type === 0) {
        newData = Number(value)
        // 如果无法转化为数字则不向上级广播
        if (isNaN(newData)) {
          return
        }
        newData = this.check(newData)
      } else {
        newData = value
      }
      this.$emit('input', newData)
      this.$emit('onClick', newData)
    },
    changeValue (value) {
      if (isNaN(value) && this.def !== undefined) value = this.def
      let newData = null
      // 判断设置的数据类型是否为数字
      if (this.type === Number) {
        newData = parseFloat(value)
        // 如果无法转化为数字则不向上级广播
        if (isNaN(newData)) {
          return
        }
        newData = this.check(newData)
      } else {
        newData = value
      }
      this.$emit('input', newData)
      this.$emit('onClick', newData)
    },
    check (number) {
      let newNumber = number
      if (this.max < newNumber) newNumber = this.max
      if (this.min > newNumber) newNumber = this.min
      // 保留一位小数
      if (!/^\d+$/.test(newNumber)) return Number(newNumber.toFixed(1))
      return newNumber
    }
  }
}
</script>

<style scoped>
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
  .auto-text {
    width: 100px;
    overflow: hidden;
    height: 40px;
  }
  .input-box {
    background: #FFFFFF;
    border: 1px solid #E9E9E9;
    display: flex;
    justify-content: space-between;
    width: 118px;
    height: 30px;
    line-height: 30px;
    box-shadow: inset 0 1px 3px 0 rgba(235, 235, 235, 0.50);
    border-radius: 2px;
    overflow: hidden;
    color: #333;
    
  }
  .auto-input {
    width: 100%;
    position: relative;
    background: transparent;
    border: 0;
    outline: none;
    text-align: center;
    font-size: 12px;
    color: #333333;
  }
  .icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    color: #999999;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
  }
</style>