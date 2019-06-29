<template lang="pug">
  .create-box
    iframe(src="http://127.0.0.1:8004/create/")
    .tool
      .add(@click="addDiv") 增加块
      .add(@click="addText") 增加字
</template>

<script>
export default {
  name: 'create',
  data: function () {
    return {
      ws: null,
      body: {
        type: 'div',
        id: "root",
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
        id: this.GenNonDuplicateID(8),
        children: []
      })
      this.ws.send(JSON.stringify({
        type: "create",
        data: this.body
      }))
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
</style>
