<template>
  <div class="projectDetails">
    <div class="details_head" :class="{noInfo_head_active: detailsView != 'Info'}">
      <x-header :eft-options.preventGoBack="true" :style="{backgroundImage: 'url(' + url+detailsInfo.mainImage + ')'}" v-if="detailsView === 'Info'" class="Info_head" :left-options="{backText: ''}">{{detailsParam.name}}
        <div class="info_bgImg" @click="goGallery"></div>
        <div slot="right" class="info_rtBtn">
          <!-- <span class="download"></span> -->
          <span class="seek" @click="openSeek"></span>
        </div>
        <div class="collect_div no_collect" :class="{'collect':collectId}" @click="collectProject" v-if="detailsParam.type !== 'coBroke'"></div>
      </x-header>
      <x-header :eft-options.preventGoBack="true" v-if="detailsView != 'Info'" class="noInfo_head" :left-options="{backText: ''}">{{detailsParam.name}}
        <div slot="right" class="info_rtBtn">
          <!-- <span class="download"></span> -->
          <span class="seek" @click="openSeek"></span>
        </div>
      </x-header>
      <tab :line-width="0" :scroll-threshold="4" ref="tabDom">
        <tab-item active-color="#5160f1" @on-item-click="cutBtn(item.type)" class="nav_bar" v-for="(item,index) in tabBar" :key="index" :selected="item.type === isActive">
          <img v-if="detailsView != item.type" class="item_img" :src=" require(`@/assets/images/icon/detailsIcon/${item.type}.png`) " alt="">
          <img v-if="detailsView === item.type" class="item_img" :src=" require(`@/assets/images/icon/detailsIcon/${item.type}_active.png`) " alt=""> {{ item.text }}
        </tab-item>
      </tab>
    </div>
    <div :class="{noInfo_body_active: detailsView != 'Info'}" class="detaislContenr">
      <keep-alive>
        <component :detailsInfo="detailsInfo" :is="detailsView"></component>
      </keep-alive>
    </div>
    <seekPopup @seekPopupFn="getSeekGoProjectList" ref="seekDom" :type="1"></seekPopup>
  </div>
</template>

<script>
import seekPopup from "@/components/seekPopup";
export default {
  nama: "projectDetails",
  components: {
    Info: () => import("@/page/details/projectModule/info/info"),
    Amenities: () => import("@/page/details/projectModule/Amenities/Amenities"),
    Email: () => import("@/page/details/projectModule/Email/Email"),
    Facilities: () =>
      import("@/page/details/projectModule/Facilities/Facilities"),
    Files: () => import("@/page/details/projectModule/Files/Files"),
    FloorPlan: () => import("@/page/details/projectModule/FloorPlan/FloorPlan"),
    Inbox: () => import("@/page/details/projectModule/Inbox/Inbox"),
    Location: () => import("@/page/details/projectModule/Location/Location"),
    SitePlan: () => import("@/page/details/projectModule/SitePlan/SitePlan"),
    Summary: () => import("@/page/details/projectModule/Summary/Summary"),
    Units: () => import("@/page/details/projectModule/Units/Units"),
    Contacts: () => import("@/page/details/projectModule/Contacts/Contacts"),
    seekPopup
  },
  data() {
    return {
      detailsParam: "",
      collectId: "",
      detailsView: "Info",
      isActive: "Info",
      tabBar: [
        {
          type: "Info",
          text: this.$t("Info")
        },
        {
          type: "SitePlan",
          text: this.$t("SitePlan")
        },
        {
          type: "Amenities",
          text: this.$t("Amenities")
        },
        {
          type: "Facilities",
          text: this.$t("Facilities")
        },
        {
          type: "Location",
          text: this.$t("Location")
        },
        {
          type: "Units",
          text: this.$t("Units")
        },
        {
          type: "FloorPlan",
          text: this.$t("FloorPlan")
        },
        {
          type: "Files",
          text: this.$t("Files")
        },
        {
          type: "Summary",
          text: this.$t("Summary")
        },
        {
          type: "Email",
          text: this.$t("Email")
        },
        {
          type: "Contacts",
          text: this.$t("Contacts")
        },
        {
          type: "Inbox",
          text: this.$t("Inbox")
        }
      ],
      detailsInfo: {},
      url: localStorage.getItem("imgUlr")
    };
  },
  created() {
    this.$removeScrollNum("tabDom");
    this.detailsParam = this.$route.query;
    this.getDetails(this.detailsParam.id);
  },
  activated() {
    this.$nextTick(function() {
      let tabDom = document.getElementsByClassName("vux-tab")[0];
      this.$SetLeftScroll(tabDom, "tabDom");
    });
  },
  mounted() {
    if (this.detailsParam.type === "coBroke") {
      this.tabBar = [
        {
          type: "Info",
          text: this.$t("Info")
        },
        {
          type: "SitePlan",
          text: this.$t("SitePlan")
        },
        {
          type: "FloorPlan",
          text: this.$t("FloorPlan")
        },
        {
          type: "Files",
          text: this.$t("Files")
        },
        {
          type: "Email",
          text: this.$t("Email")
        },
        {
          type: "Contacts",
          text: this.$t("Contacts")
        },
        {
          type: "Inbox",
          text: this.$t("Inbox")
        }
      ];
    }
    // console.log(this.detailsParam)
    this.$nextTick(function() {
      let tabDom = document.getElementsByClassName("vux-tab")[0];
      this.$KeepScrollLeft(tabDom, "tabDom");
    });
    this.getProjectSetById();
  },
  methods: {
    collectProject() {
      if (localStorage.getItem("userInfo")) {
        if (this.collectId) {
          //取消收藏
          this.$Get(this.$api.cancelCollect, {
            collectId: this.collectId
          }).then(res => {
            if (res.code == 0) {
              this.collectId = "";
              this.$vux.toast.text(this.$t("CancelCollection"), "middle");
            } else {
              this.$vux.toast.text(this.$t("CancelFailure"), "middle");
            }
          });
        } else {
          //收藏
          this.$Get(this.$api.agentCollect, {
            projectId: this.detailsParam.id
          })
            .then(res => {
              if (res.code == 0) {
                this.collectId = res.datas;
                this.$vux.toast.text(this.$t("CollectionSuccess"), "middle");
              } else {
                this.$vux.toast.text(this.$t("CollectionFailure"), "middle");
              }
            })
            .catch(err => {
              this.$vux.toast.text(this.$t("CollectionFailure"), "middle");
            });
        }
      } else {
        this.$vux.toast.text(this.$t("not_login"), "middle");
      }
    },
    cutBtn(name) {
      this.detailsView = name;
    },
    goGallery() {
      this.$router.push({
        name: "detailsImg",
        query: {
          id: this.detailsParam.id
        },
        params: {
          mainUrl: this.detailsInfo.mainImage || ""
        }
      });
    },
    openSeek() {
      this.$refs.seekDom.openSeek();
    },
    getDetails(id) {
      this.$Get(
        this.$api.queryProjectInfo,
        {
          projectId: id
        },
        true
      ).then(res => {
        if (res.code == 0) {
          this.detailsInfo = res.datas;
          this.collectId = res.datas.collectId;
          if (res.datas.description)
            this.detailsInfo.description = Base64.decode(res.datas.description);
          if (res.datas.nearbyAmenities)
            this.detailsInfo.nearbyAmenities = Base64.decode(
              res.datas.nearbyAmenities
            );
          if (res.datas.facilities)
            this.detailsInfo.facilities = Base64.decode(res.datas.facilities);
          if (res.datas.salesContacts)
            this.detailsInfo.salesContacts = Base64.decode(
              res.datas.salesContacts
            );
          if (res.datas.commission)
            this.detailsInfo.commission = Base64.decode(res.datas.commission);
          if (res.datas.externalCommission)
            this.detailsInfo.externalCommission = Base64.decode(
              res.datas.externalCommission
            );
        }
      });
    },
    getSeekGoProjectList(data) {
      let self = this;
      this.$router.push({
        path: "/seekUnitList",
        query: {
          projectId: self.detailsParam.id,
          data: data,
          unitName: self.detailsParam.name
        }
      });
    },
    getProjectSetById() {
      // 项目设置
      this.$Get(this.$api.getProjectSetById, {
        projectId: this.detailsParam.id
      }).then(res => {
        if (res.code == 0) {
          localStorage.setItem("projectSet", JSON.stringify(res.datas));
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../style/detailsSearch.less";
.projectDetails {
  height: 100%;
  .details_head {
    height: 50vh;
  }
  .noInfo_head {
    height: 10vh;
    background: -moz-linear-gradient(left, #49ccfa 0%, #5160f1 100%) !important;
    background: -webkit-linear-gradient(
      left,
      #49ccfa 0%,
      #5160f1 100%
    ) !important;
    background: -o-linear-gradient(left, #49ccfa 0%, #5160f1 100%) !important;
    background: -ms-linear-gradient(left, #49ccfa 0%, #5160f1 100%) !important;
    background: linear-gradient(to right, #49ccfa 0%, #5160f1 100%) !important;
    .vux-header-left {
      top: 50%;
      color: #fff;
      height: 30px;
      line-height: 30px;
      a {
        color: #fff;
        font-size: 2vh;
      }
      .left-arrow:before {
        width: 14px !important;
        height: 14px !important;
        border: 1px solid #fff;
        border-width: 1px 0 0 1px;
        -webkit-transform: rotate(315deg);
        transform: rotate(315deg);
        top: 50%;
        margin-top: -7px;
      }
      .left-arrow {
        top: 0;
      }
    }
    .vux-header-title {
      position: absolute;
      width: 60%;
      left: 20%;
      top: 50%;
      margin: 0;
      height: 30px;
      line-height: 30px;
      font-size: 2vh;
    }
  }
  .Info_head {
    background: transparent;
    height: 40vh;
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .info_bgImg {
      position: fixed;
      left: 20%;
      right: 20%;
      top: 0;
      height: 40vh;
      z-index: 2;
    }
    .vux-header-left {
      z-index: 2;
      top: 17%;
      color: #fff;
      font-size: 2vh;
      a {
        color: #fff;
      }
      .left-arrow:before {
        width: 14px !important;
        height: 14px !important;
        border: 1px solid #fff;
        border-width: 1px 0 0 1px;
        -webkit-transform: rotate(315deg);
        transform: rotate(315deg);
        top: 50%;
        margin-top: -7px;
      }
      .left-arrow {
        // top: -3px;
      }
    }
    .vux-header-title {
      font-size: 2vh;
      position: absolute;
      width: 60%;
      margin: 0;
      left: 20%;
      top: 15%;
      height: 30px;
      line-height: 30px;
    }
  }
  .Info_head::before {
    content: "";
    position: absolute;
    z-index: 0;
    width: 100%;
    // height: 30%;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .collect_div {
    position: fixed;
    top: 34vh;
    right: 2vh;
    height: 4vh;
    width: 4vh;
    &.no_collect {
      background: url("../../assets/images/icon/noCollect.png") no-repeat;
      background-size: 100% 100%;
    }
    &.collect {
      background: url("../../assets/images/icon/collect.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .vux-tab-wrap {
    height: 10vh;
    padding-top: 0;
  }
  .vux-tab-container {
    height: 100%;
    box-shadow: 0px 2px 5px #ddd;
    .vux-tab {
      height: 100%;
      padding-bottom: 0;
      .vux-tab-item {
        font-size: 1.3vh;
        background: #fff;
      }
      .vux-tab-item.vux-tab-selected {
        color: #5160f1;
      }
    }
  }
  .nav_bar .item_img {
    position: absolute;
    width: 5vh;
    height: 5vh;
    left: 50%;
    top: 1vh;
    margin-left: -2.5vh;
    font-size: 1.3vh;
  }
  .nav_bar {
    padding-top: 6vh;
    position: relative;
    line-height: 1.5 !important;
  }
  .detaislContenr {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 50vh;
  }
  .noInfo_head_active {
    height: 20vh;
  }
  .noInfo_body_active {
    top: 20vh;
  }
  @media screen and (min-width: 767px) {
    .nav_bar .item_img {
      top: 1.2vh;
    }
    .nav_bar {
      line-height: 2 !important;
    }
  }
}
</style>

