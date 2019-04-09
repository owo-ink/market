<template lang="pug">
  .edit-box
    input(type="text", placeholder="请输入模板名称!", v-model="name")
    input(type="text", placeholder="请输入文件名称!", v-model="templateFile")
    select(v-model="browser")
      option(value ="兼容各种浏览器") 兼容各种浏览器
      option(value ="兼容现代浏览器") 兼容现代浏览器
    select(v-model="type")
      option(v-for="item in info.type", :value="item.value") {{item.name}}
    input(type="text", placeholder="请输入文件名称!")
    input(type="text", placeholder="请输入文件名称!")
    .edit(contenteditable="true", @input="value = $event.target.innerText") {{fileContent}}
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
      fileContent: "",
      value: ""
    }
  },
  components: {
    WaterRipple
  },
  created: function () {
    axios.get('http://127.0.0.1:8000/getInfo').then((response) => {
      this.info = response.data.data
    })
  },
  methods: {
    send: function () {
      const sendData = {
        name: this.name,
        templateFile: this.templateFile,
        styleList: '[]',
        scriptList: '[]',
        browser: this.browser,
        control: '[]',
        type: this.type,
        value: this.value
      }
      axios.post('http://127.0.0.1:8000/saveTemplateFile', sendData).then((response) => {
        console.log(response)
      })
    }
  }
}
</script>

<style scoped lang="sass">
.edit-box
  width: 100%;
  height: 100%;
input
  width: calc(100% - 20px);
  border: none;
  height: 40px;
  background-color: white;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
.edit
  height: calc(100% - 286px);
select
  width: 100%;
  border: none;
  height: 40px;
  border-bottom: 1px solid #ccc;
  padding: 0 7px;
  color: #333;
  font-size: 1.2rem;
.send
  width: 100%;
  text-align: center;
  background-color: #009fe9;
  color: white;
  line-height: 40px;
</style>
