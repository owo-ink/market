<template lang="pug">
  .edit-tag-box
    .tag-item(v-if="item && item.lenght > 0", v-for="(item, ind) in value")
      .label {{item.label}}
      .edit.icon(@click="showEditTagBox(item, ind)") &#xe64f;
      .delete.icon(@click="deleteTag(item, ind)") &#xe686;
    .empty
      .icon &#xe708;
      p 当前还没有标签哦
    WaterRipple.creat(text="添加标签", @onClick="showAddBox")
    //- 添加标签
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
import axios from 'axios'
import AutoEntry from '@/components/#entry/AutoEntry'
import SelectEntry from '@/components/#entry/SelectEntry'
import WaterRipple from 'waterripple'
import TextareaEntry from '@/components/#entry/TextareaEntry'
export default {
  props: {
    value: Array
  },
  data: function () {
    return {
      editTagID: null,
      showAddTagBox: false,
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
  components: {
    AutoEntry,
    SelectEntry,
    TextareaEntry,
    WaterRipple
  },
  created: function () {
  },
  methods: {
    deleteTag: function (item, ind) {
      const confirm = window.confirm(`确认删除 "${item.label}" 这个标签吗!`)
      if (confirm) {
        let control = JSON.parse(JSON.stringify(this.value))
        control.splice(ind, 1)
        // 发送删除请求
        axios.post('https://owo.ink/changeControl', {id: this.$route.params.id, data: control}).then((response) => {
          if (response.data.err === 0) {
            this.$emit('input', control)
          }
        })
      }
    },
    editTag: function () {
      let control = JSON.parse(JSON.stringify(this.value))
      // console.log(copyData)
      
      control[this.editTagID] = this.addTag
      if (this.addTag.type === 'array' || this.addTag.type === 'object') {
        // 数据清洗
        control[this.editTagID].value = control[this.editTagID].value.replace(/\r/g, '')
        control[this.editTagID].value = control[this.editTagID].value.replace(/\n/g, '')
        control[this.editTagID].value = control[this.editTagID].value.replace(/ /g, '')
        control[this.editTagID].value = control[this.editTagID].value.replace(/},]/g, '}]')
        control[this.editTagID].value = control[this.editTagID].value.replace(/},}/g, '}}')
        control[this.editTagID].value = control[this.editTagID].value.replace(/],]/g, ']]')

        control[this.editTagID].value = JSON.parse(control[this.editTagID].value)
      }
      this.$emit('input', control)
      axios.post('https://owo.ink/changeControl', {id: this.$route.params.id, data: control}).then((response) => {
        // console.log(response.data)
        if (response.data.err === 0) {
          this.editTagID = null
          alert('修改成功!')
        }
      })
    },
    showEditTagBox: function (item, ind) {
      const valueType = typeof item.value
      if (valueType === 'object' || valueType === 'array') {
        item.value = JSON.stringify(item.value)
      }
      this.addTag = item
      this.editTagID = ind
    },
    addNewTag: function () {
      let templateControlCopy = JSON.parse(JSON.stringify(this.value))
      if (!templateControlCopy) templateControlCopy = []
      let addTagCopy = JSON.parse(JSON.stringify(this.addTag))

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
      axios.post('https://owo.ink/changeControl', {id: this.$route.params.id, data: templateControlCopy}).then((response) => {
        // console.log(response.data)
        if (response.data.err === 0) {
          this.addTag = {
            name: "",
            type: "string",
            label: "",
            value: "",
            model: "template"
          }
          this.$emit('input', templateControlCopy)
          alert('添加成功!')
          this.showAddTagBox = false
        }
      })
    },
    showAddBox: function () {
      this.addTag = {
        name: "",
        type: "string",
        label: "",
        value: "",
        model: "template"
      }
      if (window.getSelection().toString()) {
        this.addTag.value = window.getSelection().toString()
      }
      this.showAddTagBox = true
    }
  }
}
</script>

<style lang="less" scoped>
  .edit-tag-box {
    width: 250px;
    height: 100%;
    position: relative;
  }
  .tag-item {
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    margin: 0 10px;
    line-height: 40px;
    .icon {
      width: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 1.4em;
      position: absolute;
      cursor: pointer;
    }
    .edit {
      right: 40px;
      color: white;
      background-color: yellowgreen;
    }
    .delete {
      right: 0;
      color: white;
      background-color: teal;
    }
  }
  .creat, .add-tag {
    background-color: #009fe9;
    line-height: 40px;
    text-align: center;
    color: white;
    position: absolute;
    bottom: 0;
    width: 100%;
    border-radius: 0;
  }

.add-tag-box {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.80);
  left: 0;
  top: 0;
  .add-box {
    width: 400px;
    background-color: white;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 400px;
  }
  .title-bar {
    height: 40px;
    background-color: white;
    text-align: center;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
  }
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    color: white;
    font-size: 35px;
  }  
}
.empty {
  color: #a0a0a0;
  width: 150px;
  height: 120px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 10%;
  margin: auto;
  .icon {
    font-size: 90px;
    width: 100px;
    height: 100px;
    display: block;
    margin: 0 auto;
  }
  p {
    height: 20px;
    font-size: 16px;
    margin: 0;
    padding: 0;
    text-align: center;
  }
}
</style>