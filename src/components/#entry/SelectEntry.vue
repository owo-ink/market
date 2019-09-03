<template>
  <div class="control-entry">
    <span class="control-text">{{text}}</span>
    <select class="control-select" :value="value || def" v-on:input="updateValue($event.target.value)">
      <template v-if="typeof(option) === 'number'">
        <option v-for="item in option" :value="item - 1" :key="item - 1">图表{{item}}</option>
      </template>
      <template v-else>
        <option v-for="(item, ind) in option" :value="item.value" :key="ind">{{item.text}}</option>
      </template>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    option: [Array, Number],
    text: String,
    def: String
  },
  methods: {
    updateValue (data) {
      if (typeof (this.option) === 'number') data = parseInt(data, 10)
      this.$emit('onChoice', data)
      this.$emit('input', data)
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
    
  select {
    text-align: center;
    text-align-last: center;
  }
  select {
    width: 120px;
    height: 30px;
    color: #333;
    text-align: center;
    background-color: white;
    border: 1px solid #E9E9E9;
    box-shadow: inset 0 1px 30px 0 rgba(235,235,235,0.50);
    border-radius: 2px;
  }
</style>