<template>
  <div class="homePage">
    <!-- 搜索 -->
    <div class="search">
      <div class="search_div" @click="search">
        <x-icon class="search_icon" type="search" size="20"></x-icon>
        {{$t('search')}}
      </div>
      <span @click="search" class="search_icon_rt"></span>
    </div>
    <!-- 内容开始 -->
    <div ref="homeDom" class="home_conter">

      <loadMore :loadMoreData="loadMoreData" @refresh="refresh" :alertConfig="alertConfig">
        <div class="home_conter_scroll">
          <div class="case_div" v-for="(list,index) in listData" :key="index">
            <div class="case_div_text">
              {{list.groupName}}
              <span class="case_all_btn" @click="goProjectList(list.groupName,index)">{{$t('All')}}
                <x-icon class="case_all_btn_icon" type="ios-arrow-right" size="20"></x-icon>
              </span>
            </div>
            <div class="swiper_conter">
              <swiper :options="swiperOption">
                <swiper-slide v-for="(item,index) in list.projects" :key="index">
                  <card-box :itemData="item">
                  </card-box>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
      </loadMore>
    </div>
    <!-- 右侧弹窗开始 -->
    <seekPopup @seekPopupFn="getSeekGoProjectList" ref="seekDom"></seekPopup>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import cardBox from "@/components/cardBox.vue";
import seekPopup from "@/components/seekPopup";
import loadMore from "@/components/loadMore";
export default {
  name: "homePage",
  components: {
    swiper,
    swiperSlide,
    cardBox,
    seekPopup,
    loadMore
  },
  data() {
    return {
      loadMoreData: {
        allLoaded: true, //是否不允许上拉加载
        isRefresh: false, //是否刷新完成
        isLoadMore: false //是否加载完成
      },
      alertConfig: {},
      listData: "",
      swiperOption: {
        // 滑动组件设置
        slidesPerView: 1.2,
        spaceBetween: 20,
        initialSlide: 0,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20
      },
      sonData: {}
    };
  },
  created() {
    console.log("创建");
    this.$removeScrollNum("homePage");
  },
  activated() {
    parseInt;
    this.$SetScroll(this.$refs.homeDom, "homePage");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.homeDom, "homePage");
    this.getHomeList(true);
    this.updateLastUpdateTime()
  },
  methods: {
    updateLastUpdateTime() {//记录用户最后登录时间
      this.$Get(this.$api.updateLastUpdateTime, {}, false);
    },
    search() {
      // 开启右侧弹窗
      this.$refs.seekDom.openSeek();
    },
    rtClose() {
      this.isRightShow = false;
    },
    goProjectList(name) {
      this.$router.push({
        path: "/projectList",
        query: {
          type: "list",
          listName: name
        }
      });
    },
    getSeekGoProjectList(data) {
      this.sonData = data;
      this.$router.push({
        path: "/projectList",
        query: {
          type: "seek",
          info: this.sonData
        }
      });
      console.log(this.sonData);
    },
    refresh() {
      this.getHomeList(false);
    },
    getHomeList(bool) {
      this.$Get(
        this.$api.queryGroupProject,
        {
          pageNo: 1,
          pageSize: 1000,
          permission: 1
        },
        bool
      )
        .then(res => {
          this.loadMoreData.isRefresh = true;
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
          this.loadMoreData.isRefresh = true;
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
.homePage {
  height: 100%;
  // overflow: hidden;
  position: relative;
  .search {
    height: 6vh;
    box-shadow: 0 5px 20px #ddd;
    position: relative;
    line-height: 6vh;
    padding: 0 50px;
    padding-left: 0;
    z-index: 1;
    .search_icon {
      fill: #999;
      top: 50%;
      position: absolute;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      left: 20px;
    }
    .search_div {
      position: relative;
      padding-left: 50px;
      color: #999;
    }
    .search_icon_rt {
      position: absolute;
      width: 30px;
      height: 30px;
      right: 20px;
      top: 50%;
      margin-top: -15px;
      background: url("../../../assets/images/icon/select.png") no-repeat 0 0;
      background-size: 100% 100%;
      z-index: 10;
    }
  }
  .home_conter {
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 6vh;
    bottom: 0;
    left: 0;
    right: 0;
    .home_conter_scroll {
      min-height: 101%;
    }
  }
  .case_div {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    .case_div_text {
      padding: 10px 20px;
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
</style>
