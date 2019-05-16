<template>
  <div class="template-card">
    <div class="title-bar">
      <div class="name">{{data.name}}</div>
      <div class="url">{{getUrl(data)}}</div>
      <div class="icon-bar" v-once>
        <!-- 新窗口打开 -->
        <div class="icon copy" :data-clipboard-text="getCopyUrl(data)">&#xe800;</div>
        <a class="icon preview" target="_blank" :href="getShowUrl(data)">&#xe604;</a>
        <div class="icon config-icon" @click.stop="$emit('changeConfig')">&#xe68d;</div>
        <div class="icon config-icon" @click.stop="$emit('changeAttribute')">&#xe63d;</div>
        <div class="icon edit-icon" @click="edit(data.id)">&#xe64f;</div>
      </div>
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
import ClipboardJS from 'clipboard'
export default {
  props: {
    data: Object
  },
  created: function () {
    new ClipboardJS('.copy')
  },
  methods: {
    getUrl: (data) => {
      return 'https://' + window.location.host + '/public/' + data.template + '.page'
    },
    getShowUrl: (data) => {
      return 'https://' + window.location.host + '/public/' + data.template + '/index.html'
    },
    edit: function (id) {
      this.$router.push(`/edit/${id}`)
    },
    getCopyUrl: function (data) {
      console.log(data)
      const control = JSON.parse(data.control)
      let parameter = ''
      if (control) {
        for (let ind = 0; ind < control.length; ind++) {
          const item = control[ind]
          parameter += `${item.name}=${JSON.stringify(item.value)} `
        }
      }
      const temp = `<temple name="${data.templateFile}" ${parameter} src="https://${window.location.host}/public/${data.template}.page"></temple>`
      return temp
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
  .icon-bar {
    position: absolute;
    right: 0;
  }
  .icon-bar .icon {
    width: 25px;
    line-height: 25px;
    font-size: 1.4em;
  }
  .edit-icon {
    color: darkgreen;
    
  }
</style>