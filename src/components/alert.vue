<template>
  <div class="alert">
    <div class="dialog_section" v-if="alertConfig.type">
      <x-dialog v-model="alertConfig.isShow" class="dialog" :dialog-style="{'padding':'6vh 0 8vh','border-radius':'8px'}">
        <div class="img-box" :style="{'backgroundImage': alertConfig.img?('url(' + require('../assets/images'+alertConfig.img)  + ')'):''}" v-if="alertConfig.img"></div>
        <p class="text_err" v-if="alertConfig.err" v-html="alertConfig.err"></p>
        <p class="text_tip" v-if="alertConfig.tips" v-html="alertConfig.tips"></p>
        <div class="close_div" v-if="alertConfig.isShowClose" @click="alertConfig.isShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="btn_div" v-if="alertConfig.btnText">
          <x-button class="btns" :style="{'background':alertConfig.btnBackground}" @click.native="btnFun">{{alertConfig.btnText}}</x-button>
        </div>
      </x-dialog>
    </div>
    <div class="status_section" v-if="!alertConfig.type&&alertConfig.isShow">
      <div class="status">
        <div class="img-box" :style="{'backgroundImage': alertConfig.img?('url(' + require('../assets/images'+alertConfig.img)  + ')'):''}" v-if="alertConfig.img"></div>
        <p class="text_err" v-if="alertConfig.err" v-html="alertConfig.err"></p>
        <p class="text_tip" v-if="alertConfig.tips" v-html="alertConfig.tips"></p>
        <div class="close_div" v-if="alertConfig.isShowClose" @click="alertConfig.isShow = false">
          <span class="vux-close"></span>
        </div>
        <div class="btn_div" v-if="alertConfig.btnText">
          <x-button class="btns" :style="{'background':alertConfig.btnBackground}" @click.native="btnFun">{{alertConfig.btnText}}</x-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    alertConfig: {
      type: Object
      // isShowClose 是否显示关闭按钮
      // isShow 是否显示弹窗
      // img 图片路径
      // err 第一排文字
      // tips 第二排文字
      // btnText 按钮文案
      // btnBackground 按钮背景颜色
      //type 有值代表显示弹窗 
    }
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.alertConfig)
  },
  methods: {
    btnFun() {
      this.$emit("btnFun");
    }
  }
};
</script>
<style lang="less">
@import "~vux/src/styles/close";
.alert {
  .img-box {
    background-repeat: no-repeat;
    height: 120px;
    width: 120px;
    background-size: 100% 100%;
    margin: 2vh auto;
  }
  .text_err {
    font-weight: 600;
    font-size: 2.4vh;
    line-height: 3vh;
    width: 80%;
    margin: 0 auto;
    word-break: break-all;
    text-align: center;
  }
  .text_tip {
    width: 80%;
    font-size: 1.6vh;
    color: #666;
    line-height: 2vh;
    margin: 20px auto 0;
    color: #6c7b8a;
    word-break: break-all;
    text-align: center;
  }
  .close_div {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .btn_div {
    margin-top: 20px;
    .btns {
      width: 88%;
      background: -moz-linear-gradient(left, #49ccfa 0%, #5160f1 100%);
      background: -webkit-linear-gradient(left, #49ccfa 0%, #5160f1 100%);
      background: -o-linear-gradient(left, #49ccfa 0%, #5160f1 100%) !important;
      background: -ms-linear-gradient(left, #49ccfa 0%, #5160f1 100%);
      background: linear-gradient(to right, #49ccfa 0%, #5160f1 100%);
      border-radius: 50px;
      color: #fff;
      font-size: 1.6vh;
      line-height: 3.2;
    }
  }
  .status_section {
    margin-top: 10vh;
    .btn_div {
      margin-top: 40px;
    }
    .btns {
      width: 60%;
    }
  }
  @media screen and (min-width: 768px) {
    .weui-dialog {
      max-width: 350px;
    }
  }
  @media screen and (min-width: 1024px) {
    .weui-dialog {
      max-width: 500px;
      width: 50%;
    }
  }
}
</style>


