<template lang="pug">
  .home
    .type-bar
      .type-item(v-for="value in typeList", @click="changeType(value.value)") {{value.name}}
    .content-bar
      .left
        TemplateCard(v-for="(value, ind) in templateList", :data="value", @onClick="templateClick(value, ind)", :key="value.id")
          iframe(:src="'http://127.0.0.1:8000/static/' + value.template + '.html'")
      .control-bar(:class="{active: activeID !== null}")
        .input-box
          .control-item(v-for="control in templateControl.control")
            TextareaEntry(v-if="control.type === 'string'", :name="control.label", v-model="control.value")
            JsonEntry(v-else-if="control.type === 'array'", :name="control.label" v-model="control.value")
            JsonEntry(v-else-if="control.type === 'object'", :name="control.label" v-model="control.value")
            AutoEntry(v-else-if="control.type === 'number'", :name="control.label", v-model="control.value")
            ColorEntry( v-else-if="control.type === 'color'", :name="control.label", v-model="control.value")
        WaterRipple.creat(text="生成预览", @onClick="creatTemplate")
    
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
      typeList: []
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
  .active
    right: 0;

  .creat
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
