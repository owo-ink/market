<template lang="pug">
  .edit-box
    .left
      .title-bar
        .back(@click="back")
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
            select(v-model="browser")
              option(value ="兼容各种浏览器") 兼容各种浏览器
              option(value ="兼容现代浏览器") 兼容现代浏览器
            select(v-model="type")
              option(v-for="item in info.type", :value="item.value") {{item.name}}
          WaterRipple.send(text="发布", @onClick="send")
        editTag(v-model="control", v-else-if="rightType === 'tag'")
        .check-box(v-else-if="rightType === 'style'")
          .check-item(v-for="(item, ind) in info.style")
            input(v-if="checkStyle[item.name]", checked, type="checkbox", :id="'style' + item.name" :value="item", @input="changeStyle(item)")
            input(v-else, type="checkbox", :id="'script' + item.name" :value="item", @input="changeStyle(item)")
            label.text(:for="'style' + ind") {{item.name}}
          .clear
        .check-box(v-else-if="rightType === 'script'")
          // 用户自定义脚本
          .user-script
            input(type="text" v-model="userScriptUrl")
            .button(@click="addUserScript") 确定
          .check-item(v-for="(item, ind) in info.script")
            input(v-if="checkScript[item.name]", checked, type="checkbox", :id="'script' + item.name" :value="item", @input="changeScript(item)")
            input(v-else, type="checkbox", :id="'script' + item.name" :value="item", @input="changeScript(item)")
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
      rightType: "info",
      info: {},
      name: "",
      browser: "兼容各种浏览器",
      type: "header",
      value: "",
      control: [],
      checkStyle: {},
      checkScript: {},
      userScriptUrl: '',
      templateFile: null
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
      axios.get('https://owo.going.run/getInfo').then((response) => {
        this.info = response.data.data
        this.type = this.$route.params.type
      })
    } else {
      axios.get(`https://owo.going.run/getInfo?id=${this.$route.params.id}`).then((response) => {
        const value = response.data
        this.info = value.data
        // 生成页面的Script列表
        let checkScript = {}
        let scriptListData = JSON.parse(value.templateInfo.scriptList)
        for (const key in scriptListData) {
          const element = scriptListData[key]
          checkScript[element.name] = {
            name: element.name,
            src: element.src
          }
        }
        // 生成页面的Script列表
        let checkStyle = {}
        let styleListData = JSON.parse(value.templateInfo.styleList)
        for (const key in styleListData) {
          const element = styleListData[key]
          checkStyle[element.name] = {
            name: element.name,
            src: element.src
          }
        }
        // 处理模板信息
        if (value.templateInfo) {
          this.name = value.templateInfo.name
          this.checkStyle = checkStyle
          this.checkScript = checkScript
          this.value = value.fileData
          this.type = value.templateInfo.type
          this.control = JSON.parse(value.templateInfo.control)
        }
        this.templateFile = value.templateInfo.templateFile
      })
    }
  },
  methods: {
    send: function () {
      // 转换成后台数据格式
      let sendCheckStyle = []
      for (const key in this.checkStyle) {
        const element = this.checkStyle[key]
        if (element) sendCheckStyle.push(element)
      }
      let sendCheckScript = []
      for (const key in this.checkScript) {
        const element = this.checkScript[key]
        if (element) sendCheckScript.push(element)
      }

      const sendData = {
        id: this.$route.params.id,
        name: this.name,
        templateFile: this.templateFile ? this.templateFile : this.name + '.owo',
        styleList: sendCheckStyle.length > 0 ? JSON.stringify(sendCheckStyle) : '[]',
        scriptList: sendCheckScript.length > 0 ? JSON.stringify(sendCheckScript) : '[]',
        browser: this.browser,
        control: '[]',
        type: this.type,
        value: this.value
      }
      // console.log(this.checkStyle)
      if (this.$route.name === 'add') {
        axios.post('https://owo.going.run/saveTemplateFile', sendData).then((response) => {
          // 添加成功跳转页面
          if (response.data.err === 0) {
            window.history.back(-1)
          }
        })
      } else {
        axios.post('https://owo.going.run/updataTemplateFile', sendData).then((response) => {
          // 添加成功跳转页面
          if (response.data.err === 0) {
            window.history.back(-1)
          }
        })
      }
    },
    back: function () {
      window.history.go(-1)
    },
    addUserScript: function () {
      if (this.userScriptUrl) {
        const url = this.userScriptUrl
        let name = url.split('/')
        name = name[name.length - 1].split('.')[0]
        this.checkScript.push({
          name,
          src: url,
        })
        this.userScriptUrl = ''
      }
    },
    changeScript: function (item) {
      if (this.checkScript[item.name]) {
        this.checkScript[item.name] = null
      } else {
        this.checkScript[item.name] = {
          name: item.name,
          src: item.url
        }
      }
    },
    changeStyle: function (item) {
      if (this.checkStyle[item.name]) {
        this.checkStyle[item.name] = null
      } else {
        this.checkStyle[item.name] = {
          name: item.name,
          src: item.url
        }
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
  height: calc(100% - 60px);
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
  width: 100%;
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
  position: relative;
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
.user-script {
  display: flex;
  height: 30px;
  input {
    border: none;
    padding: 0 5px;
    width: calc(100% - 60px);
  }
  .button {
    display: block;
    cursor: pointer;
    width: 60px;
    background-color: #009fe9;
    color: white;
    text-align: center;
    line-height: 30px;
    user-select: none;
  }
}
</style>
