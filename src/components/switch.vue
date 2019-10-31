<template>
  <div class="data-am-toggle-switch">
    <input type="checkbox" :id="checkboxId" :checked="value"  @click.stop="updateValue">
		<label :for="checkboxId"></label>
  </div>
</template>


<script>
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      checkboxId: Math.random().toString(36).substr(2),
      copyValue: this.value
    }
  },
  methods: {
    updateValue () {
      this.copyValue = !this.copyValue
      this.$emit('input', this.copyValue)
    }
  }
}
</script>

<style lang='less' scoped>
.data-am-toggle-switch {
  text-transform: uppercase;
  color: #ddd;
  font-size: 16px;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.data-am-toggle-switch input {
  position: fixed;
  top: -9999px;
  left: -9999px;
}
.data-am-toggle-switch input:checked + label:before {
  margin-left: 24px;
}
.data-am-toggle-switch input:checked + label:after {
  left: 0px;
}
.data-am-toggle-switch label {
  width: 50px;
  height: 25px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  display: inline-block;
  vertical-align: middle;
  border-radius: 40px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.2s ease;
}
.data-am-toggle-switch label:before {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  margin-left: 0;
  width: 24px;
  height: 23px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  z-index: 20;
  transition: margin-left 0.2s ease;
}
.data-am-toggle-switch label:after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-color: #1A8FFF;
  position: absolute;
  left: -100%;
  top: 0;
  z-index: 10;
  transition: left 0.2s ease;
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}
footer {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
footer a {
  color: #ddd;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}
footer a:hover {
  color: #b7b7b7;
}
</style>