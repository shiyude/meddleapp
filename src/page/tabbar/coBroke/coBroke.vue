<template>
  <div class="coBroke">
    <div class="coBroke_nav">
      <tab class="coBroke_nav_box" :line-width="2" bar-active-color="#000" active-color="#000">
        <tab-item selected @on-item-click="onItemClick">{{$t('Residential')}}</tab-item>
        <tab-item @on-item-click="onItemClick">{{$t('Commercial')}}</tab-item>
        <tab-item @on-item-click="onItemClick">{{$t('International')}}</tab-item>
        <tab-item @on-item-click="onItemClick">{{$t('Developer')}}</tab-item>
      </tab>
    </div>
    <div ref="coBrokeDom" class="coBroke_conter">
      <template v-if="listData.length">
        <div class="coBroke_conter_box">
          <div class="case_div" v-for="(list,index) in listData" :key="index">
            <div class="case_div_text">
              {{list.groupName}}
              <span class="case_all_btn" @click="goProjectList(list.groupName,index)">
                {{$t('All')}}
                <x-icon class="case_all_btn_icon" type="ios-arrow-right" size="20"></x-icon>
              </span>
            </div>
            <div class="swiper_conter">
              <swiper :options="swiperOption">
                <swiper-slide v-for="(item,i) in list.projects" :key="i">
                  <card-box type="coBroke" :itemData="item"></card-box>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
      </template>
      <alert :alertConfig="alertConfig" @btnFun="btnFun"></alert>
    </div>
    <seekPopup :type="2" @seekPopupFn="getSeekGoProjectList" ref="seekDom"></seekPopup>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import cardBox from "@/components/cardBox.vue";
import alert from "@/components/alert.vue";
import seekPopup from "@/components/seekPopup";
export default {
  name: "coBroke",
  components: {
    swiper,
    swiperSlide,
    cardBox,
    alert,
    seekPopup
  },
  data() {
    return {
      index: 0,
      projectType: "RESIDENTIAL",
      listData: [],
      swiperOption: {
        // 滑动组件设置
        slidesPerView: 1.2,
        spaceBetween: 20,
        initialSlide: 0,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20
      },
      alertConfig: {}
    };
  },
  created() {
    this.$removeScrollNum("coBroke");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.coBrokeDom, "coBroke");
    this.getProjectList();
  },
  activated() {
    this.$SetScroll(this.$refs.coBrokeDom, "coBroke");
  },
  methods: {
    openSeekFn() {
      this.$refs.seekDom.openSeek();
    },
    getSeekGoProjectList(data) {
      this.$router.push({
        path: "/projectList",
        query: {
          type: "seekCoBrokeList",
          openType: "coBroke",
          info: data
        }
      });
    },
    btnFun() {
      this.alertConfig.isShow = false;
      // this.getProjectList();
      window.location.reload();
    },
    onItemClick(index) {
      this.index = index;
      this.$refs.coBrokeDom.scrollTop = 0;
      switch (index) {
        case 0:
          this.projectType = "RESIDENTIAL";
          break;
        case 1:
          this.projectType = "COMMERCIAL";
          break;
        case 2:
          this.projectType = "INTERNATIONAL";
          break;
        case 3:
          this.projectType = "DEVELOPER";
          break;
      }
      this.getProjectList();
    },
    goProjectList(name) {
      this.$router.push({
        path: "/projectList",
        query: {
          type: "coBrokeList",
          openType: "coBroke",
          projectType: this.projectType,
          listName: name
        }
      });
    },
    getProjectList() {
      this.$Get(this.$api.queryCoBroke, {
        pageNo: 1,
        pageSize: 4,
        projectType: this.projectType,
        permission:3
      },true)
        .then(res => {
          if (res.code == 0) {
            this.listData = res.datas;
            if (!this.listData.length) {
              this.alertConfig = {
                isShow: true,
                img: "/img/alert/noContent.png",
                err: this.$t("ComingSoon"),
                tips: this.$t("noContent")
              };
            } else {
              this.alertConfig.isShow = false;
            }
          } else {
            this.alertConfig = {
              isShow: true,
              img: "/img/alert/serverErr.png",
              err: this.$t("serverErr"),
              tips: this.$t("serverTips"),
              btnText: this.$t("tryAgain")
            };
          }
        })
        .catch(err => {
          this.alertConfig = {
            isShow: true,
            img: "/img/alert/serverErr.png",
            err: this.$t("serverErr"),
            tips: this.$t("serverTips"),
            btnText: this.$t("tryAgain")
          };
        });
    }
  }
};
</script>

<style lang="less">
.coBroke {
  height: 100%;
  .coBroke_nav {
    height: 6vh;
    box-shadow: 0 5px 10px #ddd;
    .coBroke_nav_box {
      height: 100%;
      padding-top: 0;
      .vux-tab-container {
        height: 6vh;
        .vux-tab {
          height: 100%;
          .vux-tab-item {
            line-height: 6vh;
            font-size: 1.6vh;
            color: #999;
          }
        }
      }
    }
  }
  .coBroke_conter {
    position: absolute;
    top: 6vh;
    bottom: 0;
    right: 0;
    left: 0;
    overflow-y: scroll;
    .coBroke_conter_box {
      min-height: 101%;
      .case_div {
        padding-bottom: 20px;
        border-bottom: 1px solid #ddd;
        .case_div_text {
          padding: 10px 20px;
          font-size: 1.8vh;
          .case_all_btn {
            float: right;
            position: relative;
            padding-right: 25px;
            color: #999;
            .case_all_btn_icon {
              position: absolute;
              height: 20px;
              width: 20px;
              top: 50%;
              margin-top: -10px;
              right: 0;
              fill: #999;
            }
          }
        }
        .swiper_conter {
          .swiper-container {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>