<template lang="pug">
  .edit-box
    .left
      .title-bar
        .back
          .icon &#xe626;
          span 返回
      textarea(v-model="value")
    .right
      .icon-bar
        span.text-item.script(@click="rightType = 'info'", :class="{active: rightType == 'info'}") 信息
        span.text-item.tag(@click="rightType = 'tag'", :class="{active: rightType == 'tag'}") 标签
        span.text-item.style(@click="rightType = 'style'", :class="{active: rightType == 'style'}") 样式
        span.text-item.script(@click="rightType = 'script'", :class="{active: rightType == 'script'}") 脚本
      .right-content
        .info-bar(v-if="rightType === 'info'")
          .info-bar-content
            input.text-input(type="text", placeholder="请输入模板名称!", v-model="name")
            input.text-input(type="text", placeholder="请输入文件名称!", v-model="templateFile")
            select(v-model="browser")
              option(value ="兼容各种浏览器") 兼容各种浏览器
              option(value ="兼容现代浏览器") 兼容现代浏览器
            select(v-model="type")
              option(v-for="item in info.type", :value="item.value") {{item.name}}
          WaterRipple.send(text="发布", @onClick="send")
        editTag(v-model="control", v-else-if="rightType === 'tag'")
        .check-box(v-else-if="rightType === 'style'")
          .check-item(v-for="(item, ind) in info.style")
            input(type="checkbox", :id="'style' + ind" :value="item.name", v-model="checkStyle")
            label.text(:for="'style' + ind") {{item.name}}
          .clear
        .check-box(v-else-if="rightType === 'script'")
          .check-item(v-for="(item, ind) in info.script")
            input(type="checkbox", :id="'script' + ind" :value="item.name", v-model="checkScript")
            label.text(:for="'script' + ind") {{item.name}}
          .clear
</template>

<script>
import axios from 'axios'
import WaterRipple from 'waterripple'
import editTag from '@/components/editTag'
export default {
  name: 'edit',
  data: function () {
    return {
      rightType: "tag",
      info: {},
      name: "",
      templateFile: "",
      browser: "兼容各种浏览器",
      type: "header",
      value: "",
      control: [],
      checkStyle: [],
      checkScript: []
    }
  },
  components: {
    editTag,
    WaterRipple
  },
  beforeCreate: function () {
    // console.log(this.$route)
    // 判断是修改还是新增
    if (this.$route.name === 'add') {
      // 获取分组信息
      axios.get('https://owo.ink/getInfo').then((response) => {
        this.info = response.data.data
        this.type = this.$route.params.type
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
          this.control = JSON.parse(value.templateInfo.control)
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
      if (this.$route.name === 'add') {
        axios.post('https://owo.ink/saveTemplateFile', sendData).then((response) => {
          // 添加成功跳转页面
          if (response.data.err === 0) {
            window.history.back(-1)
          }
        })
      } else {
        axios.post('https://owo.ink/updataTemplateFile', sendData).then((response) => {
          // 添加成功跳转页面
          if (response.data.err === 0) {
            window.history.back(-1)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.edit-box {
  width: 100%;
  height: 100%;
  display: flex;
}
  
.text-input {
  width: 100%;
  border: none;
  height: 39px;
  background-color: white;
  padding: 0 10px;
  font-size: 1rem;
  border-bottom: 1px solid #ccc;
}
.left {
  overflow: hidden;
  width: calc(100% - 250px);
  height: 100%;
  background-color: white;
}
textarea {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  resize: none;
  display: block;
  border: none;
  padding: 0;
  margin: 10px;
}
  
select {
  width: 100%;
  border: none;
  height: 40px;
  border-bottom: 1px solid #ccc;
  padding: 0 7px;
  color: #333;
  font-size: 1rem;
}
  
.send {
  width: 100%;
  text-align: center;
  background-color: #009fe9;
  color: white;
  line-height: 40px;
}
  
.check-box {
  overflow: hidden;
  width: 25%;
  position: absolute;
  .check-item {
    line-height: 40px;
    margin: 0 10px;
  }
  .clear {
    clear: both;
  }
}
.info-bar {
  width: 250px;
  height: 100%;
}
.check-box-bar {
  height: 40px;
}
.icon-bar {
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  .active {
    color: #009fe9;
  }
}
.right-content {
  width: 100%;
  height: calc(100% - 40px);
}
.text-item {
  margin: 0 10px;
  cursor: pointer;
  color: #666;
}
.right {
  width: 250px;
  height: 100%;
  border-left: 1px solid #ccc;
  box-sizing: border-box;
}
.info-bar-content {
  height: calc(100% - 40px);
  position: relative;
}
.title-bar {
  height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  background-color: #f2f2f2;
  font-size: 16px;
  .back {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #999;
    cursor: pointer;
    display: flex;
  }
  .back:hover {
    color: #009fe9;
  }
  .icon {
    font-size: 20px;
    width: 40px;
  }
}
</style>
