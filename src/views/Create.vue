<template lang="pug">
  .create-box
    iframe(src="./create")
</template>

<script>
export default {
  name: 'edit',
  data: function () {
    return {

    }
  },
  beforeCreate: function () {
    const ws = new WebSocket("ws://" + window.location.host)
    ws.onopen = function() {
      ws.send(JSON.stringify({
        type: "init"
      }))
    }
  }
}
</script>

<style scoped lang="sass">
.create-box
  width: 100%
  height: 100%
  background-color: #242424
iframe
  width: 60%
  margin: 0 auto
  display: block
  border: none
  height: 100%
</style>
