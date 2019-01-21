<template>
  <div class="template-card" @click.stop="$emit('onClick')">
    <div class="title-bar">
      <div class="name">{{data.name}}</div>
      <div class="url">{{'http://127.0.0.1:8000/static/' + data.template + '.page'}}</div>
    </div>
    <div class="attribute-bar">
      <span class="attribute-bar-item">{{data.browser}}</span>
      <span class="attribute-bar-item" v-for="item in data.scriptList" :key="item">item</span>
      <span class="attribute-bar-item" v-for="item in data.styleList" :key="item">item</span>
    </div>
    <div class="template-view">
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
  .template-card {
    margin: 10px;
    font-size: 12px;
    width: calc(100% - 320px);
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  .attribute-bar {
    background-color: #f8f8f8;
    border-top: 1px solid #ccc;
  }
  .attribute-bar-item {
    width: 100px;
    text-align: center;
    font-size: 12px;
    line-height: 25px;
    display: inline-block;
    border-right: 1px solid #ccc;
  }
  .template-view {
    height: 300px;
    width: 100%;
    border-top: 1px solid #ccc;
    text-align: center;
    line-height: 300px;
    color: #ccc;
    font-size: 30px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .title-bar {
    display: flex;
    text-align: center;
    line-height: 25px;
    background-color: #f8f8f8;
  }
  .title-bar .name {
    width: 100px;
    border-right: 1px solid #ccc;
  }
  .title-bar .url {
    width: calc(100% - 100px);
  }
</style>