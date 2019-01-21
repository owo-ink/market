<template lang="pug">
  .home
    .control-bar(:class="{active: activeID !== null}")
      .control-item(v-for="control in templateControl.control")
        TextareaEntry(v-if="control.type === 'string'", :name="control.label", v-model="control.value")
        AutoEntry(v-else-if="control.type === 'number'", :name="control.label", v-model="control.value")
        ColorEntry( v-else-if="control.type === 'color'", :name="control.label", v-model="control.value")
      WaterRipple.creat(text="生成预览", @onClick="creatTemplate")
    TemplateCard(v-for="(value, ind) in templateList", :data="value", @onClick="templateClick(value, ind)", :key="value.id")
      iframe(:src="'http://127.0.0.1:8000/static/' + value.template + '/index.html'")
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
      src: '',
      activeID: 0,
      activeTemplate: null,
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
    templateClick: function (value, ind) {
      console.log(value)
      // 特殊处理
      if (typeof value.control === 'string') value.control = JSON.parse(value.control)
      this.activeID = ind
      this.activeTemplate = value
      this.templateControl = value
    },
    creatTemplate: function () {
      console.log({data: this.templateControl})
      axios.post('http://127.0.0.1:8000/creatTemplate', {data: this.templateControl}).then((response) => {
        this.templateList[this.activeID].template = response.data.templateID
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

  iframe
    width: 100%;
    height: 100%;
    border: none;
</style>
