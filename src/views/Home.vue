<template lang="pug">
  .home
    //- 加载动画
    .loading-box(v-if="loading")
    template(v-else)
      //- 顶部标签栏
      .type-bar
        .type-item(v-for="value in typeList", :class="{active: $route.params.type === value.value}" @click="changeType(value.value)") {{value.name}}
      //- 模块预览区
      .content-bar
        .left
          .card-box
            TemplateCard(v-for="(value, ind) in templateList", :data="value", @changeConfig="templateClick(value, ind)", :key="value.id")
              iframe(:src="'https://owo.ink/public/' + value.template + '/index.html'")
          // 添加模板按钮
          .bottom-bar
            // 页码
            PaginationBox(:paginationNum="paginationNum", :activePaginationNum="activePaginationNum", @changePageNum="changePageNum")
            .add-temple-button.icon(@click="$router.push(`/add/${$route.params.type}`)", title="添加新组件") &#xe705;
            .add-temple-button.icon(@click="$router.push(`/setting`)", title="配置") &#xe68d;
        //- 属性控制
        Deformation.control-bar#attribute(v-if="activeID !== null", dragElement="drag-bar", :w="320", :h="760", :x="100", :y="100")
          .title-bar.drag-bar
            .title 属性管理
            .title-button-box
              .close.title-button-box-item(@click="activeID = null")
                .icon &#xe642;
                span 关闭
          .input-box(v-if="templateControl.control")
            .control-item(v-for="control in templateControl.control")
              TextareaEntry(v-if="control.type === 'string'", :name="control.label", v-model="control.value")
              JsonEntry(v-else-if="control.type === 'array'", :name="control.label" v-model="control.value")
              JsonEntry(v-else-if="control.type === 'object'", :name="control.label" v-model="control.value")
              AutoEntry(v-else-if="control.type === 'number'", :type="Number" :name="control.label", v-model="control.value")
              ColorEntry( v-else-if="control.type === 'color'", :name="control.label", v-model="control.value")
          WaterRipple.creat(text="生成预览", @onClick="creatTemplate")
        //- 属性管理
        //- Deformation.control-bar(:class="{active: activeID !== null}", :w="320", :h="760")
      
</template>

<script>
// @ is an alias to /src
import Deformation from 'deformation'
import WaterRipple from 'waterripple'
import AutoEntry from '@/components/#entry/AutoEntry'
import SelectEntry from '@/components/#entry/SelectEntry'
import ColorEntry from '@/components/#entry/ColorEntry'
import JsonEntry from '@/components/#entry/JsonEntry'
import TextareaEntry from '@/components/#entry/TextareaEntry'
import TemplateCard from '@/components/TemplateCard.vue'
import PaginationBox from '@/components/PaginationBox'
import axios from 'axios'

export default {
  name: 'home',
  data: function () {
    return {
      loading: true,
      src: '',
      activeID: null,
      templateControl: [],
      templateList: [],
      typeList: [],
      
      // 模板总数
      templateNumber: 0,
      // 页码总数
      paginationNum: 1,
      // 当前活跃页码
      activePaginationNum: 1
    }
  },
  created: function () {
    // console.log(this.$route.params)
    // 判断是否有记录
    this.load()
    // 默认选中header
    this.$store.commit('changeActiveType', 'header')
  },
  components: {
    ColorEntry,
    AutoEntry,
    JsonEntry,
    SelectEntry,
    WaterRipple,
    TemplateCard,
    TextareaEntry,
    Deformation,
    PaginationBox
  },
  methods: {
    load: function () {
      // console.log(this.$route.params.type, this.$route.params.page)
      const type = this.$route.params.type ? this.$route.params.type : 'header'
      const page = this.$route.params.page ? this.$route.params.page : 1

      axios.get(`https://owo.ink/getTemplateListByType?type=${type}&page=${page}&num=5`).then((response) => {
        const data = response.data.data
        this.templateList = data.template
        this.typeList = data.type
        // 获取页码
        this.templateNumber = data.total
        this.paginationNum = Math.ceil(data.total / 5)
        this.loading = false
        // 设置活跃页码
        this.activePaginationNum = parseInt(page)
      })
    },
    templateClick: function (value, ind) {
      // 特殊处理
      if (typeof value.control === 'string') value.control = JSON.parse(value.control)
      this.activeID = ind
      this.templateControl = value
    },
    creatTemplate: function () {
      axios.post('https://owo.ink/creatTemplate', {data: this.templateControl}).then((response) => {
        this.templateList[this.activeID].template = response.data.templateID
      })
    },
    changeType: function (type) {
      this.loading = true
      // 清除活跃页码
      this.activePaginationNum = 1
      this.$store.commit('changeActiveType', type)
      this.$router.push(`/home/${type}/1`)
    },
    // 变更页码
    changePageNum: function (num) {
      console.log(`跳转到页码: ${num}`)
      // 设置活跃页码
      this.activePaginationNum = num
      this.loading = true
      this.$router.push(`/home/${this.$route.params.type}/${num}`)
    }
  },
  watch: {
    '$route' () {
      // 加载新数据
      this.load()
    }
  }
}
</script>

<style scoped lang="less">
  .home {
    width: 100%;
    height: 100%;
  }
  .type-bar {
    height: 40px;
    display: flex;
    background-color: #262626;
    .type-item {
      color: #bbb;
      text-align: center;
      line-height: 30px;
      padding: 5px;
      cursor: pointer;
      font-size: 14px;
      margin: 0 10px;
    }
    .active {
      color: #3d91ff;
    }
  }
    
  .content-bar {
    height: calc(100% - 40px);
    width: 100%;
    display: flex;
  }
    
  .left {
    height: 100%;
    overflow-y: auto;
    position: relative;
    width: 100%;
    .card-box {
      width: 100%;
      height: calc(100% - 30px);
      overflow: auto;
    }
  }
    
  .control-bar {
    position: fixed;
    top: 2%;
    z-index: 2;
    background-color: white;
    .input-box {
      height: calc(100% - 40px);
      overflow-x: hidden;
      overflow-y: auto;
    }
      
    .title {
      height: 40px;
      background-color: #2b303b;
      line-height: 40px;
      padding: 0 10px;
      color: white;
    }
    .title-button-box {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 40px;
      display: flex;
      font-size: 14px;
      color: #87ceeb;
      height: 40px;
      overflow: hidden;
      // 属性管理标题栏按钮
      .title-button-box-item {
        display: flex;
        padding: 0 5px;
      }
      .close {
        cursor: pointer;
      }
      span {
        display: block;
      }
      .icon {
        height: 40px;
        margin: 0 5px;
        line-height: 40px;
        font-size: 20px;
        color: skyblue;
      }
    }
  }
    
    
  .control-title-bar {
    height: 40px;
    display: flex;
    line-height: 40px;
    background-color: #f2f2f2;
    .active {
      background-color: #009fe9;
      color: white;
    }
  }
  .title-bar-item {
    width: 50%;
    text-align: center;
    cursor: pointer;
    background-color: white;
    color: #333;
  }
    
  .active {
    opacity: 1;
  }
    
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
.loading-box {
  width: 100%;
  height: 100%;
  background-image: url('../assets/loading.svg');
  background-repeat: no-repeat;
  background-position: center;
}
  
.creat {
  position: absolute;
  bottom: 0;
  height: 45px;
  text-align: center;
  line-height: 45px;
  width: 100%;
  background-color: #009fe9;
  color: white;
}
.bottom-bar {
  height: 29px;
  overflow: hidden;
  background-color: #e2e2e2;
  font-size: 23px;
  line-height: 29px;
  color: #009fe9;
  padding: 0 5px;
  text-align: right;
  border-top: 1px solid #ccc;
}
</style>
