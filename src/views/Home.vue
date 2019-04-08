<template lang="pug">
  .home
    .type-bar
      .type-item(v-for="value in typeList", @click="changeType(value.value)") {{value.name}}
    .content-bar
      .left
        TemplateCard(v-for="(value, ind) in templateList", :data="value", @onClick="templateClick(value, ind)", :key="value.id")
          iframe(:src="'http://127.0.0.1:8000/static/' + value.template + '.html'")
      .control-bar(:class="{active: activeID !== null}")
        .control-title-bar
          .title-bar-item(@click="controlModel = 'value'", :class="{active: controlModel === 'value'}") 属性管理
          .title-bar-item(@click="controlModel = 'tag'", :class="{active: controlModel === 'tag'}") 标签管理
        template(v-if="controlModel === 'value'")
          .input-box
            .control-item(v-for="control in templateControl.control")
              TextareaEntry(v-if="control.type === 'string'", :name="control.label", v-model="control.value")
              JsonEntry(v-else-if="control.type === 'array'", :name="control.label" v-model="control.value")
              JsonEntry(v-else-if="control.type === 'object'", :name="control.label" v-model="control.value")
              AutoEntry(v-else-if="control.type === 'number'", :name="control.label", v-model="control.value")
              ColorEntry( v-else-if="control.type === 'color'", :name="control.label", v-model="control.value")
          WaterRipple.creat(text="生成预览", @onClick="creatTemplate")
        template(v-else)
          .add-box
            AutoEntry(name="标签字段", v-model="addTag.name", :type="String")
            AutoEntry(name="标签类型", v-model="addTag.type", :type="String")
            AutoEntry(name="标签名称", v-model="addTag.label", :type="String")
            TextareaEntry(name="标签数值", v-model="addTag.value")
          WaterRipple.add-tag(text="添加标签", @onClick="addNewTag")
</template>

<script>
// @ is an alias to /src
import WaterRipple from 'waterripple'
import AutoEntry from '@/components/#entry/AutoEntry'
import ColorEntry from '@/components/#entry/ColorEntry'
import JsonEntry from '@/components/#entry/JsonEntry'
import TextareaEntry from '@/components/#entry/TextareaEntry'
import TemplateCard from '@/components/TemplateCard.vue'
import axios from 'axios'

export default {
  name: 'home',
  data: function () {
    return {
      src: '',
      activeID: null,
      activeTemplate: null,
      templateControl: [],
      templateList: [],
      typeList: [],
      controlModel: 'value',
      addTag: {
        name: "",
        type: "",
        label: "",
        value: ""
      }
    }
  },
  created: function () {
    axios.get('http://127.0.0.1:8000/typeList').then((response) => {
      const data = response.data.data
      this.templateList = data.template
      this.typeList = data.type
    })
  },
  components: {
    ColorEntry,
    AutoEntry,
    JsonEntry,
    WaterRipple,
    TemplateCard,
    TextareaEntry
  },
  methods: {
    templateClick: function (value, ind) {
      // 特殊处理
      if (typeof value.control === 'string') value.control = JSON.parse(value.control)
      this.activeID = ind
      this.activeTemplate = value
      this.templateControl = value
    },
    creatTemplate: function () {
      axios.post('http://127.0.0.1:8000/creatTemplate', {data: this.templateControl}).then((response) => {
        this.templateList[this.activeID].template = response.data.templateID
      })
    },
    changeType: function (type) {
      axios.get(`http://127.0.0.1:8000/getTemplateListByType?type=${type}`).then((response) => {
        this.templateList = response.data.data
      })
    },
    addNewTag: function () {
      let templateControlCopy = JSON.parse(JSON.stringify(this.templateControl['control']))
      const addTagCopy = JSON.parse(JSON.stringify(this.addTag))
      
      console.log(templateControlCopy)
      templateControlCopy.push(addTagCopy)
      axios.post('http://127.0.0.1:8000/changeControl', {id: this.templateList[this.activeID].id, data: templateControlCopy}).then((response) => {
        if (response.data.data.err === 0) {
          this.addTag = {
            name: "",
            type: "",
            label: "",
            value: ""
          }
          alert('添加成功!')
        }
      })
    }
  }
}
</script>

<style scoped lang="sass">
  .home
    width: 100%;
    height: 100%;
  .type-bar
    height: 40px;
    display: flex;
    .type-item
      background-color: #009fe9;
      color: white;
      width: 80px;
      text-align: center;
      line-height: 30px;
      margin: 5px;
      cursor: pointer;
  .content-bar
    height: calc(100% - 40px);
    width: 100%;
    display: flex;
  .left
    height: 100%;
    overflow-y: auto;
    width: calc(100% - 300px);
  .control-bar
    position: fixed;
    overflow: auto;
    width: 300px;
    height: 100%;
    right: -300px;
    top: 0;
    transition: right 0.5s;
    border-left: 1px solid #ccc;
    .input-box
      height: calc(100% - 40px);
  .control-title-bar
    height: 40px;
    display: flex;
    line-height: 40px;
    background-color: #f2f2f2;
    .active
      background-color: #009fe9;
      color: white;
    .title-bar-item
      width: 50%;
      text-align: center;
      cursor: pointer;
  .active
    right: 0;

  .creat, .add-tag
    background-color: #009fe9;
    line-height: 40px;
    text-align: center;
    color: white;
    position: absolute;
    bottom: 0;
    width: 100%;

  iframe
    width: 100%;
    height: 100%;
    border: none;
</style>
