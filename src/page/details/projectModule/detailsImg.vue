<template>
  <div class="detailsImg">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">{{$t('Gallery')}}</x-header>
    <div class="detailsImgDiv">
      <template v-if="JSON.stringify(imgList)!=='{}'">
        <div class="detailsImgDiv_item" v-for="(item,key) in imgList">
          <p class="listHead" v-if="key">
            {{key}}
          </p>
          <div class="detailsImgDiv_box_wrapper">
            <div class="detailsImgDiv_box" v-for="(v,k) in item" :key="key+k">
              <div class="detailsImgDiv_box_img">
                <div class="previewer_img" @click="show(v.url)">
                  <img :src="hostUrl+v.url">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-transfer-dom>
          <previewer :list="previewerList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
        </div>
      </template>
      <template v-if="videoList.length">
        <div class="detailsImgDiv_item">
          <div class="listHead">
            {{$t('video')}}
          </div>
          <div class="detailsVedioDiv_box_wrapper">
            <div class="detailsVedioDiv_box" v-for="(item,index) in videoList" :key="'video'+index">
              <div class="detailsVedioDiv_box_vedio">
                <div class="video_div">
                  <video :src="hostUrl+item.url" :id="'video'+index" controls preload="none" :poster="mainUrl&&hostUrl+mainUrl"></video>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>
    </div>
    <alert v-if="JSON.stringify(imgList)=='{}'&&!imgList.length" :alertConfig="alertConfig"></alert>
  </div>
</template>

<script>
import { Previewer, TransferDom } from "vux";
import alert from "@/components/alert.vue";
export default {
  nama: "detailsImg",
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    alert
  },
  data() {
    return {
      hostUrl: window.localStorage.getItem("imgUlr") || "",
      mainUrl: "",
      previewerList: [],
      imgList: {},
      videoList: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer_img")[index];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      },
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  mounted() {
    this.getDataList();
    this.mainUrl = this.$route.params.mainUrl || "";
    // console.log(this.$route.params)
  },
  methods: {
    logIndexChange(arg) {},
    show(url) {
      let fullUrl = this.hostUrl + url;
      for (let i = 0; i < this.previewerList.length; i++) {
        if (fullUrl == this.previewerList[i].src) {
          this.$refs.previewer.show(i);
          break;
        }
      }
    },
    getDataList() {
      this.$Get(this.$api.queryProjectMedia, {
        projectId: this.$route.query.id || ""
      }).then(res => {
        if (res.code == 0) {
          if (res.datas) {
            this.imgList = res.datas.img;
            console.log(this.imgList);
            this.videoList = res.datas.video;
            for (let key in this.imgList) {
              for (let i = 0; i < this.imgList[key].length; i++) {
                this.previewerList.push({
                  src: this.hostUrl + this.imgList[key][i].url,
                  w: 600,
                  h: 600
                });
              }
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.detailsImg {
  height: 100%;
  .detailsImgDiv {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    .detailsImgDiv_item {
      .listHead {
        padding: 0.5vh 15px;
        // margin: 2% 0;

        background: -webkit-linear-gradient(
          left,
          #5979ef,
          #4d62ef,
          #4149ef
        ); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(
          left,
          #5979ef,
          #4d62ef,
          #4149ef
        ); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(
          left,
          #5979ef,
          #4d62ef,
          #4149ef
        ); /* Firefox 3.6 - 15 */
        background: linear-gradient(left, #5979ef, #4d62ef, #4149ef);
        /* 标准的语法 */
        color: #fff;
        font-weight: 600;
      }
      .detailsImgDiv_box_wrapper {
        &::after {
          display: table;
          content: "";
          clear: both;
        }
        padding-bottom:2%;
        .detailsImgDiv_box {
          width: 47%;
          position: relative;
          float: left;
          margin: 2% 2% 0 2%;
          &:nth-child(odd) {
            margin-right: 1%;
          }
          &:nth-child(even) {
            margin-left: 1%;
          }
          .detailsImgDiv_box_img {
            width: 100%;
            padding-bottom: 100%;
            position: relative;
            .previewer_img {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            }
            img {
              height: 100%;
              width: 100%;
            }
          }
        }
      }
      .detailsVedioDiv_box_wrapper {
        &::after {
          display: table;
          content: "";
          clear: both;
        }
        padding-bottom:2%;
        .detailsVedioDiv_box {
          width: 47%;
          padding-bottom: 50%;
          position: relative;
          float: left;
          margin: 2% 2% 0 2%;
          &:nth-child(odd) {
            margin-right: 1%;
          }
          &:nth-child(even) {
            margin-left: 1%;
          }
          .detailsVedioDiv_box_vedio {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            .video_div {
              height: 100%;
              width: 100%;
              position: relative;
              background-color: rgba(0, 0, 0, 1);
              video {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
        }
      }
    }
  }
}
</style>
