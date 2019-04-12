<template>
  <div class="siteplanPage">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText: ''}" class="nav_head">{{sitePlanName}}
      <span @click="downloadFn" slot="right">{{$t('downloadPic')}}</span>
    </x-header>
    <div class="siteplanPageCanvas">
      <div v-if="canvasData" v-finger:press-move="pressMove" ref="canvasDom" class="canvas_center">
        <canvasBox :id="'sCanvas'" :canvasData="canvasData"></canvasBox>
      </div>
      <alert v-if="!canvasData" :alertConfig="alertConfig"></alert>
    </div>
    <!-- <div class="addScle" v-if="canvasData">
      <div @click="setBig">+</div>
      <div @click="setLittle">-</div>
    </div> -->
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
import canvasBox from "@/components/canvasBox.vue";
import { setTimeout } from "timers";
import imgDownLoad from "../../../../../util/unitDock/imageDownLoad";
export default {
  name: "siteplanPage",
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
      url: localStorage.getItem("imgUlr"),
      sitePlanName: "",
      initScale: 1,
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  mounted() {
    this.queryInfo = this.$route.query;
    this.getQuerySitePlanMapping();
    let isTouch = false,
      self = this,
      totalMove = 0;
    this.$refs.canvasDom.addEventListener(
      "touchstart",
      function(e) {
        //  console.log(e.target.style)
        // self.$refs.canvasDom.style.transform = "scale(" + scale + ")";
        // console.log('xx',self.$refs.canvasDom.style.transform);
        //记录初始 一组数据 作为缩放使用
        if (e.touches.length >= 2) {
          //表示手指已按下
          isTouch = true;
        }
      },
      false
    );
    //监听 touchmove 事件 手指 移动时 做的事情
    this.$refs.canvasDom.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();

        // 2 根 手指执行 目标元素放大操作
        if (e.touches.length >= 2 && isTouch) {
          var scale = e.scale || e.zoom; //e.scale安卓不兼容
          totalMove = Number(scale) * Number(self.initScale); //原始缩放值和现有缩放值相乘
          console.log(e);
          if (totalMove <= 1) {
            totalMove = 1;
          } else if (totalMove >= 5) {
            totalMove = 5;
          }
          self.$refs.canvasDom.style.WebkitTransform = `scale(${totalMove})`;
        }
      },
      false
    );
    //监听 手指离开屏幕时
    this.$refs.canvasDom.addEventListener(
      "touchend",
      function(e) {
        //将 isTouch 修改为false  表示 手指已经离开屏幕

        if (isTouch) {
          isTouch = false;
          self.initScale = totalMove;

          console.log("离开屏幕");
        }
      },
      false
    );
  },
  methods: {
    downloadFn() {
      this.$vux.loading.show({
        text: "Loading"
      });
      setTimeout(() => {
        imgDownLoad();
      }, 200);
    },
    getDistance(p1, p2) {
      let x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
      // console.log(x,y)
      return Math.sqrt(x * x + y * y);
    },
    getQuerySitePlanMapping() {
      this.$Get(this.$api.querySitePlanMapping, {
        sitePlanId: this.queryInfo.sitePlanId,
        projectId: this.queryInfo.projectId
      }).then(res => {
        if (res.code == 0) {
          this.canvasData = res.datas;
          this.canvasData.img = this.url + res.datas.img;
          this.canvasData.type = "siteplan";
          this.sitePlanName = this.canvasData.sitePlanName;
          // console.log(this.canvasData,'父亲')
        } else {
          this.sitePlanName = this.queryInfo.projectName;
          this.canvasData = undefined;
          // console.log(this.queryInfo)
        }
      });
    },
    setBig() {
      if (this.scaleNum < 3) {
        this.scaleNum = this.scaleNum + 0.5;
        this.$refs.canvasDom.style.WebkitTransform = `scale(${this.scaleNum})`;
      }
    },
    setLittle() {
      if (this.scaleNum > 0.5) {
        this.scaleNum = this.scaleNum - 0.5;
        this.$refs.canvasDom.style.WebkitTransform = `scale(${this.scaleNum})`;
      }
    },
    pressMove(evt) {
      this.rightNum = this.rightNum + evt.deltaX;
      this.topNum = this.topNum + evt.deltaY;
      // this.$refs.canvasDom.style.WebkitTransform = `translate(${this.rightNum}px,${this.topNum}px)`
      this.$refs.canvasDom.style.left = `${this.rightNum}px`;
      this.$refs.canvasDom.style.top = `${this.topNum}px`;
    }
  }
};
</script>

<style lang="less">
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.siteplanPage {
  height: 100%;
  background-color: #f4f4f4;
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
