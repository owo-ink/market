<template>
  <div class="template-card">
    <div class="title-bar" :class="{compatible: data.browser === '兼容所有浏览器'}">
      <div class="name">{{data.name}}</div>
      <a class="url" title="预览模板" target="_blank" :href="getShowUrl()">{{getShowUrl()}}</a>
      <div class="icon-bar">
        <!-- 新窗口打开 -->
        <div class="icon set-default" title="设置为默认模板" @click.stop="setDefault()">&#xe795;</div>
        <div class="icon copy" title="复制模板代码" :data-clipboard-text="getCopyUrl()">&#xe800;</div>
        <div class="icon config-icon" title="配置管理" @click.stop="$emit('changeConfig')">&#xe68d;</div>
        <div class="icon edit-icon" title="编辑模板" @click="edit(data.id)">&#xe64f;</div>
      </div>
    </div>
    <div class="attribute-bar">
      <span class="attribute-bar-item">{{data.browser}}</span>
      <span class="attribute-bar-item attribute-script" v-for="item in JSON.parse(data.scriptList)" :key="'script' + item.name">{{item.name}}</span>
      <span class="attribute-bar-item attribute-style" v-for="item in JSON.parse(data.styleList)" :key="'style' + item.name">{{item.name}}</span>
    </div>
    <div v-if="data.height" class="template-view">
      <slot></slot>
    </div>
    <div v-else class="template-view">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ClipboardJS from 'clipboard'

export default {
  props: {
    data: Object
  },
  created: function () {
    new ClipboardJS('.copy')
  },
  methods: {
    getShowUrl: function () {
      // return 'https://' + window.location.host + '/public/' + this.data.template
      return 'http://template.owo.ink/' + this.data.template
    },
    edit: function (id) {
      this.$router.push(`/edit/${id}`)
    },
    getCopyUrl: function () {
      // console.log(typeof this.data.control)
      const control = typeof this.data.control === 'string' ? JSON.parse(this.data.control) : this.data.control
      let parameter = ''
      if (control) {
        for (let ind = 0; ind < control.length; ind++) {
          const item = control[ind]
          // 判断不是模板插值情况
          if (item.model !== 'template') {
            // console.log(item)
            parameter += `${item.name}=${JSON.stringify(item.value)} `
          }
        }
      }
      // 判断是否为pug代码
      if (!window.localStorage.getItem("usePug")) {
        return `<plug _name="${this.data.templateFile}" ${parameter}_src="https://template.owo.ink/${this.data.template}.owo"></plug>`
      } else {
        return `plug(_name="${this.data.templateFile}" ${parameter}_src="https://template.owo.ink/${this.data.template}.owo")`
      }
    },
    setDefault: function () {
      axios.get(`https://owo.going.run/setDefault?id=${this.data.id}&template=${this.data.template}`).then((response) => {
        if (response.data.err === 0) {
          alert('更新成功!')
        } else {
          alert('更新失败!')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .template-card {
    margin: 10px;
    font-size: 12px;
    border: 1px solid #ccc;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    height: 300px;
    box-shadow: 1px 1px 3px #d4c6c6;
  }
  .attribute-bar {
    height: 25px;
    background-color: white;
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
    height: calc(100% - 50px);
    position: relative;
  }
  .title-bar {
    display: flex;
    text-align: center;
    line-height: 25px;
    position: relative;
    background-color: antiquewhite;
  }
  .title-bar .name {
    width: 140px;
    border-right: 1px solid #ccc;
  }
  .title-bar .url {
    overflow: hidden;
    width: calc(100% - 240px);
  }
  .title-bar .url:hover {
    color: cornflowerblue;
  }
  .icon-bar {
    position: absolute;
    right: 0;
  }
  .icon-bar .icon {
    width: 25px;
    line-height: 25px;
    font-size: 1.4em;
    color: dimgray;
  }
  .icon-bar .icon:hover {
    color: skyblue;
  }
  .compatible {
    .title-bar {
      background-color: lightgreen;
    }
  }
</style>