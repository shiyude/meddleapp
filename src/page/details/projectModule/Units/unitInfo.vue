<template>
  <div class="unitInfo">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">{{infoName}}</x-header>
    <div class="unitInfo_container">
      <div class="unitInfoImg" v-if="img">
        <img :src="hostUrl+img" @click="showImg(hostUrl+img)" alt class="unitImg" ref="planImg">
        <img class="arLogo" src="../../../../assets/images/icon/show3dBlack.png" v-if="is3d" @click="goTo3d">
      </div>
      <div v-transfer-dom>
        <previewer :list="list" ref="previewer"></previewer>
      </div>
      <div class="unitInfoTab">
        <flexbox class="unitInfoTab-box" v-for="(item,index) in unitInfoData" :key="index">
          <flexbox-item :span="4">
            <div class="unitInfoTab-box-lf">{{item.key}}</div>
          </flexbox-item>
          <flexbox-item>
            <div class="unitInfoTab-box-rt">{{item.value}}</div>
          </flexbox-item>
          <flexbox-item v-if="item.key=='List Price'">
            <div class="unitInfoTab-box-rt list_price">
              <p>{{priceInstuction}}</p>
              <p v-if="updatePriceTime">{{$t('priceUpdated')}}:{{updatePriceTime}}</p>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <mt-palette-button @expand="paletteShow(0)" @collapse="paletteShow(1)" @expanded="textShow" direction="rt" class="mt_palette_btn" ref="target" :radius="0" :offset="0">
        <div class="my-icon-button indexicon icon-popup Interest" v-if="accessData.interestExpirationTime == 1" @touchstart="sub_log(4)">
          <span v-if="paletteTextShow" class="paleterTxet">{{$t('Interest')}}</span>
        </div>
        <div class="my-icon-button indexicon icon-popup eMail" @touchstart="sub_log(3)">
          <span v-if="paletteTextShow" class="paleterTxet">{{$t('Email')}}</span>
        </div>
        <div class="my-icon-button indexicon icon-popup calculator" @touchstart="sub_log(2)">
          <span v-if="paletteTextShow" class="paleterTxet">{{$t('Calculator')}}</span>
        </div>
        <div class="my-icon-button indexicon icon-popup sellBlock" v-if="accessData.block !== 0" @touchstart="sub_log(1)">
          <span v-if="paletteTextShow" class="paleterTxet">{{sellBlockText}}</span>
        </div>
        <div class="btnShow" @click="hidePalette" v-if="paletteTextShow"></div>
      </mt-palette-button>
      <!-- <div v-transfer-dom>
        <x-dialog
          :hide-on-blur="true"
          @on-hide="hidePalette"
          v-model="paletteShadeShow"
          class="dialog-btn"
        ></x-dialog>
      </div>-->
    </div>
  </div>
</template>

<script>
import toModule from "../../../../util/unitDock/module3d";
import { Previewer, XDialog, TransferDomDirective as TransferDom } from "vux";
export default {
  name: "unitInfo",
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    XDialog
  },
  data() {
    return {
      unitInfoData: [],
      img: "",
      priceInstuction: "",
      updatePriceTime: "",
      hostUrl: window.localStorage.getItem("imgUlr") || "",
      routerInfo: {},
      is3d: false,
      infoName: "",
      icTeam: false,
      floorPlanId: "",
      paletteShadeShow: false,
      paletteTextShow: false,
      totalPrice: undefined,
      options: {
        getThumbBoundsFn: function(index) {
          let thumbnail = document.querySelectorAll(".unitImg")[index];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      },
      list: [{ src: "" }],
      setInfo: JSON.parse(localStorage.getItem("projectSet")),
      accessData: {},
      sellBlockText: ""
    };
  },
  activated() {
    this.getUnitRoleAccess();
  },
  mounted() {
    this.routerInfo = this.$route.query;
    this.getUnitDetail();
    this.getUnitRoleAccess();
  },
  methods: {
    getUnitRoleAccess() {
      let data = {
        unitId: this.routerInfo.unitId,
        projectId: this.routerInfo.projectId
      };
      this.$Get(this.$api.getUnitRoleAccess, data).then(res => {
        if (res.code == 0) {
          this.accessData = res.datas;
          switch (res.datas.block) {
            case 1:
              this.sellBlockText = this.$t('SellBlock');
              break;
            case 2:
              this.sellBlockText = this.$t('EditCancel');
              break;
            case 3:
              this.sellBlockText = this.$t('Release');
              break;
          }
        }
      });
    },
    textShow() {
      this.paletteTextShow = true;
    },
    paletteShow(type) {
      switch (type) {
        case 0:
          this.paletteShadeShow = true;
          break;
        default:
          this.paletteTextShow = false;
          this.paletteShadeShow = false;
          break;
      }
    },
    hidePalette() {
      this.$refs.target.collapse();
    },
    showImg(img) {
      if (img) {
        this.list[0].src = img;
        this.$refs.previewer.show(0);
      }
    },
    goTo3d() {
      if (!this.floorPlanId) {
        return;
      }
      toModule(this.floorPlanId);
    },
    sub_log(val) {
      // this.paletteShadeShow = false;
      this.$refs.target.collapse();
      // this.paletteShow(1)
      switch (val) {
        case 1:
          this.$router.push({
            path: "/projectDetails/developerSellBlock",
            query: {
              unitId: this.routerInfo.unitId,
              projectId: this.routerInfo.projectId,
              unitName: this.infoName,
              projectName: this.routerInfo.projectName
            }
          });
          break;
        case 2:
          this.$router.push({
            path: "/projectDetails/calculator",
            query: {
              totalPrice: this.totalPrice
            }
          });
          break;
        case 3:
          this.$router.push({
            name: "emailPage",
            query: {
              unitId: this.routerInfo.unitId,
              id: this.routerInfo.projectId,
              unitName: this.infoName
            }
          });
          break;
        case 4:
          this.$router.push({
            name: "Interest",
            query: {
              projectId: this.routerInfo.projectId,
              unitId:this.routerInfo.unitId
            }
          });
          break;
      }
    },
    getUnitDetail() {
      let unitId = this.$route.query.unitId || "";
      let projectId = this.$route.query.projectId || "";
      if (unitId && projectId) {
        this.$Get(
          this.$api.getUnitInfo,
          {
            unitId: unitId,
            projectId: projectId
          },
          true
        ).then(res => {
          if (res.code == 0) {
            let data = res.datas;
            if (data) {
              this.img = data.img;
              if (data.img) {//如果户型图存在，则等待户型图加载完毕后再加载数据
                this.$nextTick(() => {
                  let self = this;
                  this.$refs.planImg.onload = function() {
                    // console.log(this)
                    self.priceInstuction = data.priceInstuction;
                    self.updatePriceTime = data.updatePriceTime;
                    self.unitInfoData = data.lists;
                    self.is3d = data.is3d ? true : false;
                    self.infoName = data.unitName;
                    self.icTeam = data.icTeam == 0 ? false : true;
                    self.floorPlanId = data.floorPlanId;
                  };
                });
              } else {
                this.priceInstuction = data.priceInstuction;
                this.updatePriceTime = data.updatePriceTime;
                this.unitInfoData = data.lists;
                // this.is3d = data.is3d ? true : false;
                this.infoName = data.unitName;
                this.icTeam = data.icTeam == 0 ? false : true;
                this.floorPlanId = data.floorPlanId;
              }

              // let totalPriceArr = data.lists.filter(item => { // 拿出总价
              //   return item.key === 'Nett Price' ? true : false
              // })
              // Number((Math.floor((data.price2.replace(/[^0-9.]/ig, "")) * 100) / 100).toString())
              this.totalPrice = data.price2;
            }
          } else {
            console.log("获取unit详情失败");
          }
        });
      }
    }
  }
};
</script>

<style lang="less">
.unitInfo {
  height: 100%;
  .unitInfo_container {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    .unitInfoImg {
      width: 100%;
      position: relative;
      .unitImg {
        width: 100%;
      }
      .arLogo {
        position: absolute;
        width: 8vh;
        height: 8vh;
        top: 50%;
        left: 50%;
        margin-top: -4vh;
        margin-left: -4vh;
      }
    }
    .unitInfoTab {
      padding: 20px;
      padding-top: 0;
      .unitInfoTab-box {
        padding: 1vh 0;
        border-bottom: 1px solid #ddd;
      }
      .unitInfoTab-box-lf,
      .unitInfoTab-box-rt {
        font-size: 1.8vh;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.list_price {
          overflow: auto;
          text-overflow: inherit;
          white-space: normal;
          p {
            font-size: 1vh;
            color: #999;
            width: 100%;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            word-break: normal;
            white-space: pre-warp;
            word-wrapl: break-word;
          }
        }
      }
      .unitInfoTab-box-lf {
        color: #999;
      }
    }
    .mt_palette_btn {
      position: fixed;
      bottom: 2vh;
      right: 2vh;
      z-index: 100;
      .my-icon-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        top: 5px;
        left: 5px;
      }
      .mint-main-button {
        background: url("../../../../assets/images/icon/mainBtn.png") no-repeat
          0 0;
        background-size: 100% 100%;
        border: 1px solid #ddd;
        box-shadow: 0 0 10px #ddd;
        background-color: #fff;
      }
      .my-icon-button.sellBlock {
        background: url("../../../../assets/images/icon//sellBlockBtn.png")
          no-repeat 0 0;
        background-size: 100% 100%;
      }
      .my-icon-button.calculator {
        background: url("../../../../assets/images/icon/calculatorBtn.png")
          no-repeat 0 0;
        background-size: 100% 100%;
      }
      .my-icon-button.eMail {
        background: url("../../../../assets/images/icon/emailBtn.png") no-repeat
          0 0;
        background-size: 100% 100%;
      }
      .my-icon-button.Interest {
        background: url("../../../../assets/images/icon/Interest.png") no-repeat
          0 0;
        background-size: 100% 100%;
      }
      .paleterTxet {
        position: absolute;
        left: -200%;
        color: #fff;
      }
    }
    .mt_palette_btn.expand {
      .my-icon-button {
        z-index: 400;
      }
      .my-icon-button:nth-child(1) {
        transform: translate(0, -80px) rotate(720deg);
      }
      .my-icon-button:nth-child(2) {
        transform: translate(0, -160px) rotate(720deg);
      }
      .my-icon-button:nth-child(3) {
        transform: translate(0, -240px) rotate(720deg);
      }
      .my-icon-button:nth-child(4) {
        transform: translate(0, -320px) rotate(720deg);
      }
      .mint-main-button {
        background: url("../../../../assets/images/icon/mainBtnActive.png")
          no-repeat 0 0;
        background-size: 100% 100%;
        background-color: #fff;
      }
      .btnShow {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.6);
        width: auto;
        height: auto;
      }
    }
  }
}
</style>