<template lang="pug">
  .setting-box
    SwitchItem(v-model="usePug", @input="changeUsePug")
</template>

<script>
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
    }
  }
}
</script>

<style scoped lang="less">

</style>
