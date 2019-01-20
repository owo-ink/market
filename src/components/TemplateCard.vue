<template>
  <div class="template-card">
    <div class="title-bar">
      <span class="title-bar-item">{{data.browser}}</span>
    </div>
    <div class="template-view" @click.stop="$emit('onClick')">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
}
</script>

<style scoped>
  .title-bar-item {
    background-color: #009fe9;
    padding: 0 5px;
    color: white;
    border-radius: 6px;
    font-size: 12px;
    line-height: 25px;
    display: inline-block;
  }
  .template-view {
    height: 300px;
    width: 800px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 300px;
    color: #ccc;
    font-size: 30px;
    margin: 5px 0;
    cursor: pointer;
  }
</style>