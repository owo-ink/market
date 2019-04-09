<template>
  <div id="app" class="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html, body, .app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f2f2f2;
}
@font-face {
  font-family: 'iconfont';  /* project id 1131144 */
  src: url('//at.alicdn.com/t/font_1131144_rr9usywy7lf.eot');
  src: url('//at.alicdn.com/t/font_1131144_rr9usywy7lf.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1131144_rr9usywy7lf.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1131144_rr9usywy7lf.woff') format('woff'),
  url('//at.alicdn.com/t/font_1131144_rr9usywy7lf.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1131144_rr9usywy7lf.svg#iconfont') format('svg');
}
.icon {
  font-family: "iconfont";
  font-style: normal;
  font-weight: normal;
  display: inline-block;
  user-select: none;
  cursor: pointer;
}
</style>
