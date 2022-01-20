<template lang="pug">
  .setting-box
    .lable 使用pug语法
    SwitchItem(v-model="usePug", @input="changeUsePug")
    .button(@click="clearTemp") 清理服务
</template>

<script>
import axios from 'axios'
import SwitchItem from '@/components/switch'

export default {
  name: 'setting',
  data: function () {
    return {
      usePug: Boolean(window.localStorage.getItem("usePug"))
    }
  },
  components: {
    SwitchItem
  },
  methods: {
    changeUsePug: function () {
      window.localStorage.setItem("usePug", this.usePug)
    },
    clearTemp: function () {
      axios.get('http://lamp.run:8082/clearTemp')
    }
  }
}
</script>

<style scoped lang="less">
.lable {
  line-height: 40px;
  margin: 0 10px;
}
.button {
  background-color: #009fe9;
  width: 100px;
  height: 60px;
  color: #fff;
}
</style>
