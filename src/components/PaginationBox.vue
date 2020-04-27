<template lang="pug">
  .pagination-box
    span.text 页码:
    .page(v-for="item in paginationNum", :class="{active: activePaginationNum === item}", @click="$emit('changePageNum', item)") {{item}}
</template>

<script>
export default {
  props: {
    paginationNum: Number,
    activePaginationNum: Number
  }
}
</script>

<style scoped>
.pagination-box {
  height: 28px;
  text-align: center;
  position: absolute;
  font-size: 14px;
}
.page {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  position: relative;
  color: #337ab7;
  text-decoration: none;
  background-color: #fff;
  box-shadow: 1px 1px 2px #ccc;
  cursor: pointer;
  margin-right: 8px;
}
.page:hover {
  z-index: 2;
  color: white;
  background-color: #337ab7;
}
.active {
  z-index: 3;
  color: #fff;
  background-color: #337ab7;
  border-color: #337ab7;
}
.text {
  padding-right: 8px;
  color: #888;
  font-size: 12px;
}
</style>