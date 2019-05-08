<template>
  <div class="template-card">
    <div class="title-bar">
      <div class="name">{{data.name}}</div>
      <div class="url">{{getUrl(data)}}</div>
      <div class="icon config-icon" @click.stop="$emit('onClick')">&#xe68d;</div>
      <div class="icon edit-icon" @click="edit(data.id)">&#xe64f;</div>
    </div>
    <div class="attribute-bar">
      <span class="attribute-bar-item">{{data.browser}}</span>
      <span class="attribute-bar-item attribute-script" v-for="item in JSON.parse(data.scriptList)" :key="'script' + item">{{item}}</span>
      <span class="attribute-bar-item attribute-style" v-for="item in JSON.parse(data.styleList)" :key="'style' + item">{{item}}</span>
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
  },
  methods: {
    getUrl: (data) => {
      return 'https://' + window.location.host + '/public/' + data.template + '.page'
    },
    edit: function (id) {
      this.$router.push(`/edit/${id}`)
    }
  }
}
</script>

<style scoped>
  .template-card {
    margin: 10px;
    font-size: 12px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
  }
  .attribute-bar {
    background-color: white;
    border-top: 1px solid #ccc;
  }
  .attribute-bar-item {
    width: 140px;
    text-align: center;
    font-size: 12px;
    line-height: 25px;
    display: inline-block;
    border-right: 1px solid #ccc;
  }
  .template-view {
    width: 100%;
    border-top: 1px solid #ccc;
    text-align: center;
    color: #ccc;
    font-size: 30px;
    cursor: pointer;
    box-sizing: border-box;
    background-color: #f2f2f2;
    height: 300px;
    position: relative;
  }
  .title-bar {
    display: flex;
    text-align: center;
    line-height: 25px;
    background-color: white;
    position: relative;
  }
  .title-bar .name {
    width: 140px;
    border-right: 1px solid #ccc;
  }
  .title-bar .url {
    width: calc(100% - 140px);
  }
  .edit-icon {
    width: 25px;
    line-height: 25px;
    position: absolute;
    right: 10px;
    color: darkgreen;
    font-size: 1.4em;
  }
</style>