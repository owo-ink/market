<template lang="pug">
  .pagination-box
    .page(v-for="item in paginationNum", :class="{active: activePaginationNum === item}", @click="$emit('changePageNum', item)") {{item}}
</template>

<script>
export default {
  props: {
    paginationNum: Number,
    activePaginationNum: Number
  },
  created: function () {
    console.log(this.activePaginationNum)
  }
}
</script>

<style scoped>
.pagination-box {
  height: 32px;
  text-align: center;
  margin: 15px 0;
}
.page {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  position: relative;
  margin-left: -1px;
  color: #337ab7;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
}
.page:hover {
  z-index: 2;
  color: #23527c;
  background-color: #eee;
  border-color: #ddd;
}
.active {
  z-index: 3;
  color: #fff;
  cursor: default;
  background-color: #337ab7;
  border-color: #337ab7;
}
</style>