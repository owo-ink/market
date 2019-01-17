<template lang="pug">
  .home
    .control-bar(:class="{active: activeId !== 0}")
      .control-item(v-for="control in templateControl.control")
        TextareaEntry(v-if="control.type === 'string'", :name="control.label", v-model="control.value")
        AutoEntry(v-else-if="control.type === 'number'", :name="control.label", v-model="control.value")
        ColorEntry( v-else-if="control.type === 'color'", :name="control.label", v-model="control.value")
      WaterRipple.creat(text="生成链接", @onClick="creatTemplate")
    TemplateCard(v-for="value in templateList", :data="value", @onClick="templateClick(value)", :key="value.id")
    .alert-box(v-if="templateID")
      .alert
        .title-bar
          span.title 模板链接
          span.close(@click="templateID = null") 关闭
        textarea(v-model="templateID")
</template>

<script>
// @ is an alias to /src
import WaterRipple from 'waterripple'
import AutoEntry from '@/components/#entry/AutoEntry'
import ColorEntry from '@/components/#entry/ColorEntry'
import TextareaEntry from '@/components/#entry/TextareaEntry'
import TemplateCard from '@/components/TemplateCard.vue'
import axios from 'axios'
export default {
  name: 'home',
  data: function () {
    return {
      activeId: 0,
      templateID: null,
      templateControl: [],
      templateList: []
    }
  },
  created: function () {
    axios.get('http://127.0.0.1:8000/templateList').then((response) => {
      console.log(response.data)
      this.templateList = response.data
    })
  },
  components: {
    ColorEntry,
    AutoEntry,
    WaterRipple,
    TemplateCard,
    TextareaEntry
  },
  methods: {
    templateClick: function (value) {
      console.log(value)
      // 特殊处理
      if (typeof value.control === 'string') value.control = JSON.parse(value.control)
      
      this.activeId = value.id
      this.templateControl = value
    },
    creatTemplate: function () {
      console.log('12')
      axios.post('http://127.0.0.1:8000/creatTemplate', {data: this.templateControl}).then((response) => {
        console.log(response.data)
        this.templateID = `http://127.0.0.1:8000/getTemplate/${response.data.templateID}`
      })
    }
  }
}
</script>

<style scoped lang="sass">
  .control-bar
    position: fixed;
    width: 300px;
    height: 100%;
    right: -300px;
    top: 0;
    transition: right 0.5s;
    border-left: 1px solid #ccc;

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

  .alert-box
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 14, 3, 0.5);
    .close
      cursor: pointer;
    .alert
      width: 400px;
      height: 300px;
      background-color: white;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    .title-bar
      height: 40px;
      border-bottom: 1px solid #ccc;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
    textarea
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      border: none;
      padding: 10px;
</style>
