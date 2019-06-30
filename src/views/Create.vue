<template lang="pug">
  .create-box
    iframe(src="http://127.0.0.1:8004/create/")
    .tool
      .add(@click="addDiv") 增加块
      .add(@click="addText") 增加字
    .control(v-if="active && active.style")
      template(v-for="item in active.style")
        AutoEntry(name="标签字段", v-model="item.value", :type="String")
</template>

<script>
import AutoEntry from '@/components/#entry/AutoEntry'
export default {
  name: 'create',
  components: {
    AutoEntry
  },
  data: function () {
    return {
      ws: null,
      body: {
        type: 'div',
        id: "root",
        style: [
          {
            name: "font-size",
            value: "14px"
          }
        ],
        text: '',
        children: []
      },
      active: {}
    }
  },
  created: function () {
    this.active = this.body
    // this.ws = new WebSocket("ws://" + window.location.host)
    this.ws = new WebSocket("ws://127.0.0.1:8004")
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: "init"
      }))
      this.ws.onmessage = (e) => {
        const message = JSON.parse(e.data)
        if (message.type === 'check') {
          this.activeID(this.body, message.data)
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
        id: this.GenNonDuplicateID(8),
        children: []
      })
      this.ws.send(JSON.stringify({
        type: "create",
        data: this.body
      }))
    },
    addText: function () {
      // 添加Text
      this.active.children.push({
        type: 'h1',
        text: "asdasdasd",
        style: [
          {
            name: "font-size",
            value: "14px"
          }
        ],
        id: this.GenNonDuplicateID(8),
        children: []
      })
      this.ws.send(JSON.stringify({
        type: "create",
        data: this.body
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
}
.control {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background-color: white;
  width: 200px;
}
</style>
