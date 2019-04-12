<template>
  <div class="siteplanPage">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText: ''}" class="nav_head">{{sitePlanName}}</x-header>
    <div class="siteplanPageCanvas">
      <div v-if="canvasData" v-finger:press-move="pressMove" ref="canvasDom" class="canvas_center">
        <canvasBox :id="'sCanvas'" :canvasData="canvasData"></canvasBox>
      </div>
      <alert v-if="!canvasData" :alertConfig="alertConfig"></alert>
    </div>
    <div class="addScle" v-if="canvasData">
      <div @click="setBig">+</div>
      <div @click="setLittle">-</div>
    </div>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
import canvasBox from '@/components/canvasBox.vue'
export default {
  name: 'siteplanPage',
  components: {
    canvasBox,
    alert
  },
  data() {
    return {
      rightNum: 0,
      topNum: 0,
      scaleNum: 1,
      queryInfo: {},
      canvasData: {},
      url: localStorage.getItem('imgUlr'),
      sitePlanName: '',
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      },
    }
  },
  mounted() {
    this.queryInfo = this.$route.query
    this.getQuerySitePlanMapping()
  },
  methods: {
    getQuerySitePlanMapping() {
      this.$Get(this.$api.querySitePlanMapping, {
        sitePlanId: this.queryInfo.sitePlanId,
        projectId: this.queryInfo.projectId
        }).then(res => {
        if(res.code == 0) {
          this.canvasData = res.datas
          this.canvasData.img = this.url + res.datas.img
          this.canvasData.type = 'siteplan'
          this.sitePlanName = this.canvasData.sitePlanName
          // console.log(this.canvasData,'父亲')
        } else {
          this.sitePlanName = this.queryInfo.projectName
          this.canvasData = undefined
          // console.log(this.queryInfo)
        }
      })
    },
    setBig() {
      if (this.scaleNum < 3) {
        this.scaleNum = this.scaleNum + 0.5
        this.$refs.canvasDom.style.WebkitTransform = `scale(${this.scaleNum})`
      }
    },
    setLittle() {
      if (this.scaleNum > 0.5) {
        this.scaleNum = this.scaleNum - 0.5
        this.$refs.canvasDom.style.WebkitTransform = `scale(${this.scaleNum})`
      }
    },
    pressMove(evt) {
      this.rightNum = this.rightNum + evt.deltaX
      this.topNum = this.topNum + evt.deltaY
      // this.$refs.canvasDom.style.WebkitTransform = `translate(${this.rightNum}px,${this.topNum}px)`
      this.$refs.canvasDom.style.left = `${this.rightNum}px`
      this.$refs.canvasDom.style.top = `${this.topNum}px`
    },
  }
}
</script>

<style lang="less">
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.siteplanPage {
  height: 100%;
  background-color: #F4F4F4;
  .addScle {
    position: absolute;
    top: 100px;
    left: 2vh;
    z-index: 100;
    div {
      width: 4vh;
      height: 4vh;
      line-height: 4vh;
      text-align: center;
      margin-bottom: 2vh;
      background: #5160f1;
      color: #fff;
      font-size: 2vh;
      font-weight: 600;
      border-radius: 0.5vh;
    }
  }
}
.siteplanPageCanvas {
  position: absolute;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  .canvas_center {
    width: 100%;
    position: relative;
    z-index: 80;
  }
}
</style>
