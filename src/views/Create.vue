<template lang="pug">
  .create-box
    iframe(src="http://lamp.run:8082:8004/create/")
    .tool
      .add(@click="addDiv") DIV
      .add(@click="addText") H1
      .add(@click="addOWO") OWO
    .dom-check
      .item html
      .item body
    .control(v-if="active && active.style")
      template(v-for="(item, key) in active.style")
        AutoEntry(v-if="key === 'width'", name="宽度", v-model="active.style[key]", @input="create()", :type="String")
        AutoEntry(v-else-if="key === 'height'", name="高度", v-model="active.style[key]", @input="create()", :type="String")
        AutoEntry(v-else-if="key === 'font-size'", name="字体大小", v-model="active.style[key]", @input="create()", :type="String")
        ColorEntry(v-else-if="key === 'background-color'", name="背景颜色", @input="create()", v-model="active.style[key]")
        AutoEntry(v-else-if="key === 'background-image'", name="背景图片", @input="create()", v-model="active.style[key]", :type="String")
        AutoEntry(v-else-if="key === 'background-size'", name="图片大小", @input="create()", v-model="active.style[key]", :type="String")
        SelectEntry(v-else-if="key === 'background-repeat'", text="背景平铺方式", v-model="active.style[key]", @input="create()", :option="repeatOption", def="string")
        SelectEntry(v-else-if="key === 'text-align'", text="对齐方式", v-model="active.style[key]", @input="create()", :option="textAlignOption", def="string")
        SelectEntry(v-else-if="key === 'position'", text="定位方式", v-model="active.style[key]", @input="create()", :option="positionOption", def="string")
      .position-box.box-show(v-if="active.style.position && active.style.position === 'absolute' || active.style.position === 'fixed'")
        .title 坐标位置
        .box
          input(type="text", class="top", v-model="active.style.top", @blur="create()")
          input(type="text", class="right", v-model="active.style.right", @blur="create()")
          input(type="text", class="bottom", v-model="active.style.bottom", @blur="create()")
          input(type="text", class="left", v-model="active.style.left", @blur="create()")
      .margin-box.box-show
        .title 外边距
        .box
          input(type="text", class="top", v-model="active.style['margin-top']", @blur="create()")
          input(type="text", class="right", v-model="active.style['margin-right']", @blur="create()")
          input(type="text", class="bottom", v-model="active.style['margin-bottom']", @blur="create()")
          input(type="text", class="left", v-model="active.style['margin-left']", @blur="create()")
      TextareaEntry(v-if="active.text", name="文本", @blur="create()", v-model="active.text")
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
        style: {
          "font-size": "14px",
          "height": "100%",
          "width": "100%",
          "background-image": "unset",
          "background-size": "unset",
          "background-repeat": "unset"
        },
        text: '',
        children: []
      },
      bodyStyle: {},
      active: {},
      textAlignOption: [
        {value: 'left', text: '居左'},
        {value: 'center', text: '居中'},
        {value: 'right', text: '居右'},
      ],
      positionOption: [
        {value: 'static', text: '无定位'},
        {value: 'absolute', text: '绝对定位(父元素)'},
        {value: 'fixed', text: '绝对定位(浏览器窗口)'},
        {value: 'relative', text: '相对定位'},
      ],
      repeatOption: [
        {value: 'unset', text: '默认值'},
        {value: 'repeat', text: '垂直方向和水平方向重复'},
        {value: 'repeat-x', text: '水平方向重复'},
        {value: 'repeat-y', text: '垂直方向重复'},
        {value: 'no-repeat', text: '不重复'}
      ]
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
        style: {
          "font-size": "14px",
          "height": "200px",
          "width": "100%",
          "background-color": "#ffffff",
          "position": "static",
          "top": "unset",
          "right": "unset",
          "bottom": "unset",
          "left": "unset",
          "margin-top": "unset",
          "margin-right": "unset",
          "margin-bottom": "unset",
          "margin-left": "unset",
          "background-image": "unset",
          "background-size": "unset",
          "background-repeat": "unset"
        },
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
        style: {
          "font-size": "14px",
          "text-align": "left",
          "position": "unset",
          "top": "unset",
          "right": "unset",
          "bottom": "unset",
          "left": "unset",
          "margin-top": "unset",
          "margin-right": "unset",
          "margin-bottom": "unset",
          "margin-left": "unset",
          "background-image": "unset"
        },
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
  // 盒子
  .box {
    height: 200px;
    width: 200px;
    position: relative;
    margin: 30px auto;
    border: 1px solid #ccc;
  }
  input {
    width: 40px;
    margin: auto;
    text-align: center;
    position: absolute;
    color: #666;
    height: 15px;
  }
  .top {
    left: 0;
    right: 0;
    top: -25px;
  }
  .right {
    top: 0;
    bottom: 0;
    right: -47px;
  }
  .bottom {
    left: 0;
    right: 0;
    bottom: -25px;
  }
  .left {
    top: 0;
    bottom: 0;
    left: -47px;
  }
}
.box-show .title {
  font-size: 12px;
  color: #333333;
  line-height: 40px;
  margin: 0 20px;
}
</style>
