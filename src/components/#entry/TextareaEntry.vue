<template lang="pug">
  .textarea-entry
    .lable {{name}}
    textarea(:value="value", @blur="updateValue($event.target.value)")
</template>

<script>
export default {
  props: ['name', 'value'],
  methods: {
    updateValue (data) {
      this.$emit('input', data)
    }
  }
}
</script>

<style scoped>
  .textarea-entry {
    margin: 0 10px;
    padding: 0 10px;
  }
  textarea {
    width: 100%;
    height: 100px;
    padding: 5px;
    background-color: #fff;
    color: #aaa;
    border: 1px solid #ddd;
    resize: none;
  }
  .lable {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #686868;
  }
</style>