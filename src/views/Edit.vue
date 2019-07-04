<template lang="pug">
  .edit-box
    input.text-input(type="text", placeholder="请输入模板名称!", v-model="name")
    input.text-input(type="text", placeholder="请输入文件名称!", v-model="templateFile")
    select(v-model="browser")
      option(value ="兼容各种浏览器") 兼容各种浏览器
      option(value ="兼容现代浏览器") 兼容现代浏览器
    select(v-model="type")
      option(v-for="item in info.type", :value="item.value") {{item.name}}
    .check-box
      .check-item(v-for="(item, ind) in info.style")
        input(type="checkbox", :id="'style' + ind" :value="item.name", v-model="checkStyle")
        label.text(:for="'style' + ind") {{item.name}}
      .clear
    .check-box
      .check-item(v-for="(item, ind) in info.script")
        input(type="checkbox", :id="'script' + ind" :value="item.name", v-model="checkScript")
        label.text(:for="'script' + ind") {{item.name}}
      .clear
    textarea.edit(v-model="value")
    WaterRipple.send(text="发布", @onClick="send")
</template>

<script>
import axios from 'axios'
import WaterRipple from 'waterripple'
export default {
  name: 'edit',
  data: function () {
    return {
      info: {},
      name: "",
      templateFile: "",
      browser: "兼容各种浏览器",
      type: "header",
      value: "",
      checkStyle: [],
      checkScript: []
    }
  },
  components: {
    WaterRipple
  },
  beforeCreate: function () {
    // 判断是修改还是新增
    if (this.$route.params.id === 'new') {
      // 获取分组信息
      axios.get('https://owo.ink/getInfo').then((response) => {
        this.info = response.data.data
      })
    } else {
      axios.get(`https://owo.ink/getInfo?id=${this.$route.params.id}`).then((response) => {
        const value = response.data
        this.info = value.data
        // 处理模板信息
        if (value.templateInfo) {
          this.name = value.templateInfo.name
          this.checkStyle = JSON.parse(value.templateInfo.styleList)
          this.checkScript = JSON.parse(value.templateInfo.scriptList)
          this.templateFile = value.templateInfo.templateFile
          this.value = value.fileData
          this.type = value.templateInfo.type
        }
      })
    }
  },
  methods: {
    send: function () {
      const sendData = {
        id: this.$route.params.id,
        name: this.name,
        templateFile: this.templateFile,
        styleList: this.checkStyle.length > 0 ? `["${this.checkStyle.join('","')}"]` : '[]',
        scriptList: this.checkScript.length > 0 ? `["${this.checkScript.join('","')}"]` : '[]',
        browser: this.browser,
        control: '[]',
        type: this.type,
        value: this.value
      }
      // console.log(this.checkStyle)
      if (this.$route.params.id === 'new') {
        axios.post('https://owo.ink/saveTemplateFile', sendData).then((response) => {
          // 添加成功跳转页面
          if (response.data.err === 0) {
            this.$router.push(`/`)
          }
        })
      } else {
        axios.post('https://owo.ink/updataTemplateFile', sendData).then((response) => {
          // 添加成功跳转页面
          if (response.data.err === 0) {
            this.$router.push(`/`)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="sass">
.edit-box
  width: 100%
  height: 100%
.text-input
  width: calc(100% - 20px)
  border: none
  height: 40px
  background-color: white
  padding: 0 10px
  font-size: 1rem
  border-bottom: 1px solid #ccc
.edit
  overflow-x: hidden
  overflow-y: auto
  height: calc(100% - 292px)
  border: none
  width: calc(100% - 10px)
  resize: none
  padding: 5px
  display: block
select
  width: 100%
  border: none
  height: 40px
  border-bottom: 1px solid #ccc
  padding: 0 7px
  color: #333
  font-size: 1rem
.send
  width: 100%
  text-align: center
  background-color: #009fe9
  color: white
  line-height: 40px
.check-box
  height: 40px
  overflow-y: hidden
  overflow-x: scroll
  .check-item
    line-height: 40px
    float: left
    margin: 0 10px
.clear
  clear: both
</style>
