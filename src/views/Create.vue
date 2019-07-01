<template lang="pug">
  .create-box
    iframe(src="http://127.0.0.1:8004/create/")
    .tool
      .add(@click="addDiv") DIV
      .add(@click="addText") H1
      .add(@click="addOWO") OWO
    .dom-check
      .item html
      .item body
    .control(v-if="active && active.style")
      template(v-for="item in active.style")
        AutoEntry(v-if="item.type === 'string'", :name="item.name", v-model="item.value", @input="create()", :type="String")
        SelectEntry(v-else-if="item.type === 'option'", :text="item.name", v-model="item.value", @input="create()", :option="item.option", def="string")
        ColorEntry(v-else-if="item.type === 'color'", :name="item.name", @input="create()", v-model="item.value")
      TextareaEntry(v-if="active.text", name="文本", @input="create()", v-model="active.text")
</template>

<script>
import AutoEntry from '@/components/#entry/AutoEntry'
import ColorEntry from '@/components/#entry/ColorEntry'
import SelectEntry from '@/components/#entry/SelectEntry'
import TextareaEntry from '@/components/#entry/TextareaEntry'
export default {
  name: 'create',
  components: {
    AutoEntry,
    ColorEntry,
    SelectEntry,
    TextareaEntry
  },
  data: function () {
    return {
      ws: null,
      domData: {
        type: 'div',
        id: "root",
        style: [
          {
            name: "字体大小",
            type: "string",
            key: "font-size",
            value: "14px"
          },
          {
            name: "高度",
            type: "string",
            key: "height",
            value: "100%"
          },
          {
            name: "宽度",
            type: "string",
            key: "width",
            value: "100%"
          }
        ],
        text: '',
        children: []
      },
      bodyStyle: {

      },
      active: {}
    }
  },
  created: function () {
    this.active = this.domData
    // this.ws = new WebSocket("ws://" + window.location.host)
    this.ws = new WebSocket("ws://127.0.0.1:8004")
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: "init"
      }))
      this.ws.onmessage = (e) => {
        const message = JSON.parse(e.data)
        if (message.type === 'check') {
          this.activeID(this.domData, message.data)
        }
        console.log(`收到消息: `, message)
      }
    }
  },
  methods: {
    /**
     * 生成一个用不重复的ID
     */
    GenNonDuplicateID: function (randomLength) {
      return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
    },
    addDiv: function () {
      // 添加Div
      this.active.children.push({
        type: 'div',
        text: '',
        style: [
          {
            name: "高度",
            type: "string",
            key: "height",
            value: "200px"
          },
          {
            name: "宽度",
            type: "string",
            key: "width",
            value: "100%"
          },
          {
            name: "背景颜色",
            type: "color",
            key: "background-color",
            value: "#ffffff"
          },
          {
            name: "定位类型",
            type: "option",
            key: "position",
            option: [
              {value: 'static', text: '无定位'},
              {value: 'absolute', text: '绝对定位(父元素)'},
              {value: 'fixed', text: '绝对定位(浏览器窗口)'},
              {value: 'relative', text: '相对定位'},
            ],
            value: "static"
          },
          {
            name: "上边距",
            type: "string",
            key: "top",
            value: "unset"
          },
          {
            name: "右边距",
            type: "string",
            key: "right",
            value: "unset"
          },
          {
            name: "底边距",
            type: "string",
            key: "bottom",
            value: "unset"
          },
          {
            name: "左边距",
            type: "string",
            key: "left",
            value: "unset"
          },
          {
            name: "上外边距",
            type: "string",
            key: "margin-top",
            value: "unset"
          },
          {
            name: "右外边距",
            type: "string",
            key: "margin-right",
            value: "unset"
          },
          {
            name: "底外边距",
            type: "string",
            key: "margin-bottom",
            value: "unset"
          },
          {
            name: "左外边距",
            type: "string",
            key: "margin-left",
            value: "unset"
          },
        ],
        id: this.GenNonDuplicateID(8),
        children: []
      })
      this.ws.send(JSON.stringify({
        type: "create",
        data: this.domData
      }))
    },
    addText: function () {
      // 添加Text
      this.active.children.push({
        type: 'h1',
        text: "asdasdasd",
        style: [
          {
            name: "字体大小",
            type: "string",
            key: "font-size",
            value: "14px"
          },
          {
            name: "行高",
            type: "string",
            key: "line-height",
            value: "20px"
          },
          {
            name: "对齐方向",
            type: "option",
            key: "text-align",
            option: [
              {value: 'left', text: '居左'},
              {value: 'center', text: '居中'},
              {value: 'right', text: '居右'},
            ],
            value: "left"
          },
          {
            name: "上边距",
            type: "string",
            key: "top",
            value: "unset"
          },
          {
            name: "右边距",
            type: "string",
            key: "right",
            value: "unset"
          },
          {
            name: "底边距",
            type: "string",
            key: "bottom",
            value: "unset"
          },
          {
            name: "左边距",
            type: "string",
            key: "left",
            value: "unset"
          },
          {
            name: "上外边距",
            type: "string",
            key: "margin-top",
            value: "unset"
          },
          {
            name: "右外边距",
            type: "string",
            key: "margin-right",
            value: "unset"
          },
          {
            name: "底外边距",
            type: "string",
            key: "margin-bottom",
            value: "unset"
          },
          {
            name: "左外边距",
            type: "string",
            key: "margin-left",
            value: "unset"
          },
        ],
        id: this.GenNonDuplicateID(8),
        children: []
      })
      this.create()
    },
    addOWO: function () {
      var word = prompt("请输入owo代码","");
      if (word) {
        this.active.children.push({
          type: 'owo',
          value: word,
          id: this.GenNonDuplicateID(8),
          children: []
        })
        this.create()
      }
    },
    create: function () {
      this.ws.send(JSON.stringify({
        type: "create",
        data: this.domData
      }))
    },
    activeID: function (obj, id) {
      console.log(`查找ID：${id}`)
      if (obj.id === id) {
        console.log('符合', obj)
        this.active = obj
      } else {
        if (obj.children) {
          obj.children.forEach(element => {
            this.activeID(element, id)
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.create-box {
  width: 100%;
  height: 100%;
  background-color: #242424;
}
iframe {
  width: 60%;
  margin: 0 auto;
  display: block;
  border: none;
  height: 100%;
}
.tool {
  position: absolute;
  left: 0;
  top: 0;
  background-color: cyan;
  height: 100%;
  width: 60px;
  .add {
    color: white;
    text-align: center;
    margin: 5px;
    height: 50px;
    cursor: pointer;
    line-height: 50px;
    box-shadow: 2px 2px 3px #87b5b1;
    background-color: darkorchid;
  }
}
.dom-check {
  position: fixed;
  left: 100px;
  bottom: 100px;
}
.control {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background-color: white;
  width: 300px;
  .box-item {
    position: relative;
  }
}
</style>
