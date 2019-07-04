<template lang="pug">
  .home
    .loading-box(v-if="loading")
    template(v-else)
      .type-bar
        .type-item(v-for="value in typeList", :class="{active: $route.params.type === value.value}" @click="changeType(value.value)") {{value.name}}
      .content-bar
        .left
          .card-box
            TemplateCard(v-for="(value, ind) in templateList", :data="value", @changeConfig="templateClick(value, ind)", @changeAttribute="showAttribute(value, ind)", :key="value.id")
              iframe(:src="'/public/' + value.template + '/index.html'")
            // 页码
            PaginationBox(:paginationNum="paginationNum", :activePaginationNum="activePaginationNum", @changePageNum="changePageNum")
          // 添加模板按钮
          .add-temple-button.icon(@click="$router.push(`/edit/new`)") &#xe6ff;
        //- 属性控制
        Deformation.control-bar#attribute(v-if="activeID !== null", :shouIcon="flase", dragElement="drag-bar", :w="320", :h="760", :x="100", :y="100")
          .title-bar.drag-bar
            .title 属性管理
            .title-button-box
              .close.title-button-box-item(@click="activeID = null")
                .icon &#xe642;
                span 关闭
          //- .control-title-bar
          //-   .title-bar-item(@click="controlModel = 'value'", :class="{active: controlModel === 'value'}") 属性管理
          //-   .title-bar-item(@click="controlModel = 'tag'", :class="{active: controlModel === 'tag'}") 标签管理
          template(v-if="controlModel === 'value'")
            .input-box
              .control-item(v-for="control in templateControl.control")
                TextareaEntry(v-if="control.type === 'string'", :name="control.label", v-model="control.value")
                JsonEntry(v-else-if="control.type === 'array'", :name="control.label" v-model="control.value")
                JsonEntry(v-else-if="control.type === 'object'", :name="control.label" v-model="control.value")
                AutoEntry(v-else-if="control.type === 'number'", :type="Number" :name="control.label", v-model="control.value")
                ColorEntry( v-else-if="control.type === 'color'", :name="control.label", v-model="control.value")
            WaterRipple.creat(text="生成预览", @onClick="creatTemplate")
          template(v-else)
            .tag-list
              .tag-item(v-for="(item, ind) in templateControl.control", v-if="item")
                .label {{item.label}}
                .edit.icon(@click="showEditTagBox(item, ind)") &#xe64f;
                .delete.icon(@click="deleteTag(item, ind)") &#xe686;
              WaterRipple.creat(text="添加标签", @onClick="showAddTagBox = true")
        //- 属性管理
        //- Deformation.control-bar(:class="{active: activeID !== null}", :w="320", :h="760")
      .add-tag-box(v-show="showAddTagBox || editTagID !== null")
        .close.icon(@click="showAddTagBox = false; editTagID = null") &#xe616;
        .add-box
          .title-bar {{showAddTagBox ? '添加标签' : '修改标签'}}
          AutoEntry(name="标签字段", v-model="addTag.name", :type="String")
          SelectEntry(text="标签类型", v-model="addTag.type", :option="typeSelectList", def="string")
          SelectEntry(text="标签模式", v-model="addTag.model", :option="modelSelectList", def="template")
          AutoEntry(name="标签名称", v-model="addTag.label", :type="String")
          TextareaEntry(name="标签数值", v-model="addTag.value")
          WaterRipple.add-tag(v-if="showAddTagBox", text="确定添加", @onClick="addNewTag")
          WaterRipple.add-tag(v-else, text="确定修改", @onClick="editTag")
</template>

<script>
// @ is an alias to /src
import Deformation from 'deformation'
import WaterRipple from 'waterripple'
import AutoEntry from '@/components/#entry/AutoEntry'
import SelectEntry from '@/components/#entry/SelectEntry'
import ColorEntry from '@/components/#entry/ColorEntry'
import JsonEntry from '@/components/#entry/JsonEntry'
import TextareaEntry from '@/components/#entry/TextareaEntry'
import TemplateCard from '@/components/TemplateCard.vue'
import PaginationBox from '@/components/PaginationBox'
import axios from 'axios'

export default {
  name: 'home',
  data: function () {
    return {
      loading: true,
      src: '',
      activeID: null,
      activeTemplate: null,
      templateControl: [],
      templateList: [],
      typeList: [],
      controlModel: 'value',
      showAddTagBox: false,
      editTagID: null,
      // 模板总数
      templateNumber: 0,
      // 页码总数
      paginationNum: 1,
      // 当前活跃页码
      activePaginationNum: 1,
      typeSelectList: [
        {value: 'string', text: '字符串'},
        {value: 'array', text: '数组'},
        {value: 'color', text: '颜色'},
        {value: 'object', text: '对象'},
        {value: 'number', text: '数字'}
      ],
      modelSelectList: [
        {value: 'template', text: '模板插值'},
        {value: 'prop', text: 'prop传值'},
      ],
      addTag: {
        name: "",
        type: "string",
        label: "",
        value: "",
        model: "template"
      }
    }
  },
  created: function () {
    console.log(this.$route.params)
    // 判断是否有记录
    this.load()
  },
  components: {
    ColorEntry,
    AutoEntry,
    JsonEntry,
    SelectEntry,
    WaterRipple,
    TemplateCard,
    TextareaEntry,
    Deformation,
    PaginationBox
  },
  methods: {
    load: function () {
      if (!this.$route.params.type) {
        axios.get('https://owo.ink/typeList').then((response) => {
          // 默认选中header
          this.$store.commit('changeActiveType', 'header')
          
          const data = response.data.data
          this.templateList = data.template
          this.typeList = data.type
          this.$store.commit('changeType', data.type)
          // 获取页码
          this.getNumByType()
        })
      } else {
        const type = this.$route.params.type
        const page = this.$route.params.page
        this.typeList = this.$store.state.type
        axios.get(`https://owo.ink/getTemplateListByType?type=${type}&page=${page}&num=5`).then((response) => {
          this.templateList = response.data.data
          // 获取页码
          this.getNumByType()
        })
      }
    },
    templateClick: function (value, ind) {
      // 特殊处理
      if (typeof value.control === 'string') value.control = JSON.parse(value.control)
      this.activeID = ind
      this.activeTemplate = value
      this.templateControl = value
      this.controlModel = 'value'
    },
    showAttribute: function (value, ind) {
      if (typeof value.control === 'string') value.control = JSON.parse(value.control)
      this.activeID = ind
      this.activeTemplate = value
      this.templateControl = value
      this.controlModel = 'tag'
    },
    creatTemplate: function () {
      axios.post('https://owo.ink/creatTemplate', {data: this.templateControl}).then((response) => {
        this.templateList[this.activeID].template = response.data.templateID
      })
    },
    changeType: function (type) {
      this.loading = true
      // 清除活跃页码
      this.activePaginationNum = 1
      this.$store.commit('changeActiveType', type)
      this.$router.push(`/home/${type}/1`)
    },
    addNewTag: function () {
      let templateControlCopy = JSON.parse(JSON.stringify(this.templateControl['control']))
      if (!templateControlCopy) templateControlCopy = []
      let addTagCopy = JSON.parse(JSON.stringify(this.addTag))
      // console.log(addTagCopy)
      if (addTagCopy.type === 'array' || addTagCopy.type === 'object') {
        // 数据清洗
        addTagCopy.value = addTagCopy.value.replace(/\r/g, '')
        addTagCopy.value = addTagCopy.value.replace(/\n/g, '')
        addTagCopy.value = addTagCopy.value.replace(/ /g, '')
        addTagCopy.value = addTagCopy.value.replace(/},]/g, '}]')
        addTagCopy.value = addTagCopy.value.replace(/],]/g, ']]')
        addTagCopy.value = addTagCopy.value.replace(/},}/g, '}}')

        addTagCopy.value = JSON.parse(addTagCopy.value)
      } else if (addTagCopy.type === 'number') {
        addTagCopy.value = parseInt(addTagCopy.value)
      }
      
      templateControlCopy.push(addTagCopy)
      axios.post('https://owo.ink/changeControl', {id: this.templateList[this.activeID].id, data: templateControlCopy}).then((response) => {
        // console.log(response.data)
        if (response.data.err === 0) {
          this.addTag = {
            name: "",
            type: "string",
            label: "",
            value: "",
            model: "template"
          }
          this.templateControl['control'] = templateControlCopy
          alert('添加成功!')
          this.showAddTagBox = false
        }
      })
    },
    deleteTag: function (item, ind) {
      const confirm = window.confirm(`确认删除 "${item.label}" 这个标签吗!`)
      if (confirm) {
        let copyData = JSON.parse(JSON.stringify(this.templateControl))
        copyData.control.splice(ind, 1)
        // 发送删除请求
        axios.post('https://owo.ink/changeControl', {id: this.templateList[this.activeID].id, data: copyData.control}).then((response) => {
          if (response.data.err === 0) {
            this.templateControl = copyData
          }
        })
      }
    },
    showEditTagBox: function (item, ind) {
      const valueType = typeof item.value
      if (valueType === 'object' || valueType === 'array') {
        item.value = JSON.stringify(item.value)
      }
      this.addTag = item
      this.editTagID = ind
    },
    editTag: function () {
      let copyData = JSON.parse(JSON.stringify(this.templateControl))
      // console.log(copyData)
      
      copyData.control[this.editTagID] = this.addTag
      if (this.addTag.type === 'array' || this.addTag.type === 'object') {
        // 数据清洗
        copyData.control[this.editTagID].value = copyData.control[this.editTagID].value.replace(/\r/g, '')
        copyData.control[this.editTagID].value = copyData.control[this.editTagID].value.replace(/\n/g, '')
        copyData.control[this.editTagID].value = copyData.control[this.editTagID].value.replace(/ /g, '')
        copyData.control[this.editTagID].value = copyData.control[this.editTagID].value.replace(/},]/g, '}]')
        copyData.control[this.editTagID].value = copyData.control[this.editTagID].value.replace(/},}/g, '}}')
        copyData.control[this.editTagID].value = copyData.control[this.editTagID].value.replace(/],]/g, ']]')

        copyData.control[this.editTagID].value = JSON.parse(copyData.control[this.editTagID].value)
      }
      this.templateControl = copyData
      axios.post('https://owo.ink/changeControl', {id: this.templateList[this.activeID].id, data: copyData.control}).then((response) => {
        // console.log(response.data)
        if (response.data.err === 0) {
          this.editTagID = null
          alert('修改成功!')
        }
      })
    },
    showAddNewBox: function () {
      // 清除历史输入数据
      this.addTag = {
        name: "",
        type: "",
        label: "",
        value: ""
      }
      this.showAddTagBox = !this.showAddTagBox
    },
    // 变更页码
    changePageNum: function (num) {
      console.log(`跳转到页码: ${num}`)
      // 设置活跃页码
      this.activePaginationNum = num
      this.loading = true
      this.$router.push(`/home/${this.$route.params.type}/${num}`)
    },
    getNumByType: function () {
      axios.get(`https://owo.ink/getNumByType?type=${this.$route.params.type}`).then((response) => {
        console.log(`获取到模板总数: ${response.data.data}`)
        this.templateNumber = response.data.data
        this.paginationNum = Math.ceil(response.data.data / 5)
        this.loading = false
      })
    }
  },
  watch: {
    '$route' () {
      // 加载新数据
      this.load()
    }
  }
}
</script>

<style scoped lang="sass">
  .home
    width: 100%
    height: 100%
  .type-bar
    height: 40px
    display: flex
    background-color: #262626
    .type-item
      color: #bbb
      width: 60px
      text-align: center
      line-height: 30px
      padding: 5px
      cursor: pointer
      font-size: 14px
    .active
      color: #3d91ff
  .content-bar
    height: calc(100% - 40px)
    width: 100%
    display: flex
  .left
    height: 100%
    overflow-y: auto
    position: relative
    width: 100%
    .card-box
      width: 100%
      height: 100%
      overflow: auto
    .add-temple-button
      position: absolute
      right: 20px
      bottom: 20px
      font-size: 40px
      color: chocolate
  .control-bar
    position: fixed
    top: 2%
    background-color: white
    .input-box
      height: calc(100% - 40px)
      overflow-x: hidden
      overflow-y: auto
    .title
      height: 40px
      background-color: #2b303b
      line-height: 40px
      padding: 0 10px
      color: white
    .title-button-box
      position: absolute
      top: 0
      right: 0
      line-height: 40px
      display: flex
      font-size: 14px
      color: #87ceeb
      height: 40px
      overflow: hidden
      // 属性管理标题栏按钮
      .title-button-box-item
        display: flex
        padding: 0 5px
      .close
        cursor: pointer
      span
        display: block
      .icon
        height: 40px
        margin: 0 5px
        line-height: 40px
        font-size: 20px
        color: skyblue
  .control-title-bar
    height: 40px
    display: flex
    line-height: 40px
    background-color: #f2f2f2
    .active
      background-color: #009fe9
      color: white
  .title-bar-item
    width: 50%
    text-align: center
    cursor: pointer
    background-color: white
    color: #333
  .active
    opacity: 1

  .creat, .add-tag
    background-color: #009fe9
    line-height: 40px
    text-align: center
    color: white
    position: absolute
    bottom: 0
    width: 100%
    border-radius: 0
  iframe
    width: 100%
    height: 100%
    border: none
  
  .add-tag-box
    position: fixed
    z-index: 99
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.80)
    left: 0
    top: 0
    .add-box
      width: 400px
      background-color: white
      position: absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
      margin: auto
      height: 400px
    .title-bar
      height: 40px
      background-color: white
      text-align: center
      line-height: 40px
      border-bottom: 1px solid #ccc
      
    .close
      position: absolute
      right: 10px
      top: 10px
      color: white
      font-size: 35px
  .tag-list
    .tag-item
      border-bottom: 1px solid #e9e9e9
      display: flex
      margin: 0 10px
      line-height: 40px
      .icon
        width: 40px
        line-height: 40px
        text-align: center
        font-size: 1.4em
        position: absolute
        cursor: pointer
      .edit
        right: 40px
        color: white
        background-color: yellowgreen
      .delete
        right: 0
        color: white
        background-color: teal
.loading-box
  width: 100%
  height: 100%
  background-image: url('../assets/loading.svg')
  background-repeat: no-repeat
  background-position: center
</style>
