<template>
  <div class="building">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText: ''}" class="nav_head">{{sitePlanName}}
      <span @click="downloadFn" slot="right">{{$t('downloadPic')}}</span>
    </x-header>
    <div class="buildingCanvas">
      <div v-if="canvasData" v-finger:press-move="pressMove" ref="buidCanvasDom" class="buildingCanvas_center">
        <canvasBox :id="'BCanvas'" :canvasData="canvasData"></canvasBox>
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
import imgDownLoad from "../../../../../util/unitDock/imageDownLoad";
import { setTimeout } from "timers";
export default {
  name: "building",
  components: {
    canvasBox,
    alert
  },
  data() {
    return {
      rightNum: 0,
      topNum: 0,
      scaleNum: 1,
      queryInfo: "",
      canvasData: {},
      sitePlanName: "",
      initScale: 1,
      url: localStorage.getItem("imgUlr"),
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  created() {},
  mounted() {
    this.queryInfo = this.$route.query;
    // console.log(this.queryInfo)
    this.getQuerySitePlanMapping();
    let isTouch = false,
      self = this,
      totalMove = 0;
    this.$refs.buidCanvasDom.addEventListener(
      "touchstart",
      function(e) {
        if (e.touches.length >= 2) {
          //表示手指已按下
          isTouch = true;
        }
      },
      false
    );
    //监听 touchmove 事件 手指 移动时 做的事情
    this.$refs.buidCanvasDom.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();

        // 2 根 手指执行 目标元素放大操作
        if (e.touches.length >= 2 && isTouch) {
          var now = e.touches;
          var scale = e.scale || e.zoom;
          totalMove = Number(scale) * Number(self.initScale); //原始缩放值和现有缩放值相乘
          if (totalMove <= 1) {
            totalMove = 1;
          } else if (totalMove >= 5) {
            totalMove = 5;
          }
          self.$refs.buidCanvasDom.style.WebkitTransform = `scale(${totalMove})`;
        }
      },
      false
    );
    //监听 手指离开屏幕时
    this.$refs.buidCanvasDom.addEventListener(
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
    getQuerySitePlanMapping() {
      this.$Get(this.$api.querySitePlanMapping, {
        sitePlanId: this.queryInfo.sitePlanId,
        projectId: this.queryInfo.projectId
      }).then(res => {
        if (res.code == 0) {
          this.canvasData = res.datas;
          this.canvasData.img = this.url + res.datas.img;
          this.canvasData.type = "building";
          this.sitePlanName = this.canvasData.sitePlanName;
          // console.log(this.canvasData, 'building父亲')
        } else {
          this.sitePlanName = this.queryInfo.projectName;
          this.canvasData = undefined;
          // console.log(this.queryInfo)
        }
      });
    },
    downloadFn() {
      this.$vux.loading.show({
        text: "Loading"
      });
      setTimeout(() => {
        imgDownLoad();
      },200);
    },
    setBig() {
      if (this.scaleNum < 3) {
        this.scaleNum = this.scaleNum + 0.5;
        this.$refs.buidCanvasDom.style.WebkitTransform = `scale(${
          this.scaleNum
        })`;
      }
    },
    setLittle() {
      if (this.scaleNum > 0.5) {
        this.scaleNum = this.scaleNum - 0.5;
        this.$refs.buidCanvasDom.style.WebkitTransform = `scale(${
          this.scaleNum
        })`;
      }
    },
    longTap() {
      console.log("onLongTap长安");
    }, // 长安
    pressMove(evt) {
      this.rightNum = this.rightNum + evt.deltaX;
      this.topNum = this.topNum + evt.deltaY;
      this.$refs.buidCanvasDom.style.left = `${this.rightNum}px`;
      this.$refs.buidCanvasDom.style.top = `${this.topNum}px`;
    }
  }
};
</script>

<style lang="less">
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.building {
  height: 100%;
  background: #f4f4f4;
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
  .buildingCanvas {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    .buildingCanvas_center {
      width: 100%;
      position: relative;
      z-index: 80;
    }
  }
}
</style>
