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
  src: url('//at.alicdn.com/t/font_1131144_aknxed63w0i.eot');
  src: url('//at.alicdn.com/t/font_1131144_aknxed63w0i.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1131144_aknxed63w0i.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1131144_aknxed63w0i.woff') format('woff'),
  url('//at.alicdn.com/t/font_1131144_aknxed63w0i.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1131144_aknxed63w0i.svg#iconfont') format('svg');
}
.icon {
  font-family: "iconfont";
  font-style: normal;
  font-weight: normal;
  display: inline-block;
  cursor: pointer;
}
::-webkit-scrollbar {/*滚动条整体样式*/
  width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #009fe9;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 5px;
  background: #EDEDED;
}
#attribute {
  border: none;
  box-shadow: 1px 1px 5px #b0a8cc;
}
</style>
