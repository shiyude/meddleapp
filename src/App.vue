<template>
  <div id="app">
    <transition :name='transitionName'>
      <navigation>
        <router-view class="child-view"></router-view>
      </navigation>
    </transition>
  </div>
</template>

<script>
import { judgeAgent, saveSuc } from "./util/unitDock/app";
export default {
  name: "app",
  data() {
    return {
      transitionName: ""
    };
  },
  mounted() {
    //强制更新
    window["App"] = this;
  },
  created() {
    // bind event
    this.$navigation.on("forward", (to, from) => {
      this.transitionName = "slide-left";
    });
    this.$navigation.on("back", (to, from) => {
      this.transitionName = "slide-right";
    });
    this.$navigation.on("replace", (to, from) => {
      this.transitionName = "slide-right";
    });
    // this.$navigation.on("refresh", (to, from) => {
    //   console.log('refresh to', to, 'from ', from)
    // });
    // this.$navigation.on("reset", () => {
    //   console.log("reset");
    // });
    // // and use [once, off] methods
    // this.$navigation.once("forward", () => {
    //   console.log('appear once')
    // });
    // const off = () => {
    //   console.log('will not appear')
    // };
    // this.$navigation.on("forward", off);
    // this.$navigation.off("forward", off);
  },
  methods: {
    getUnitVersion(version) {
      //unit调用该方法传入相应的版本号
      judgeAgent(version, this);
    },
    saveSuccess(paramDatas) {
      saveSuc(paramDatas,this);
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "style/common.less";

body {
  background-color: #fff;
}
html,
body,
#app {
  font-family: "PingFangSC-Regular", sans-serif;
  height: 100%;
  width: 100%;
  -webkit-overflow-scrolling: touch;
}
#app {
  position: relative;
}
::-webkit-scrollbar {
  background-color: transparent;
  display: none !important;
}

.child-view {
  position: absolute;
  width: 100%;
  height: 100%;
  // transition: all 0.5s cubic-bezier(0.33, 0, 0.1, 1);
}
// .slide-left-enter,
// .slide-right-leave-active {
//   opacity: 0;
//   -webkit-transform: translate(30%, 0);
//   transform: translate(30%, 0);
// }
// .slide-left-leave-active,
// .slide-right-enter {
//   opacity: 0;
//   -webkit-transform: translate(-30%, 0);
//   transform: translate(-30%, 0);
// }

.slide-left-enter {
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-to {
  transform: translate3d(-80%, 0, 0);
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s ease;
}
.slide-left-enter-active {
  background: #fff;
  z-index: 10000;
}

.slide-right-enter {
  transform: translate3d(-80%, 0, 0);
}
.slide-right-leave-to {
  transform: translate3d(100%, 0, 0);
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-leave-active {
  z-index: 10000;
  background: #fff;
}
</style>
