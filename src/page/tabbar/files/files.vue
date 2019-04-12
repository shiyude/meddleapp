<template>
  <div class="tabFiles">
    <loadMore :loadMoreData="loadMoreData" @refresh="refresh" :alertConfig="alertConfig">
      <div class="tabFiles_box" v-if="JSON.stringify(inlineDescList)!=='{}'" v-for="(val,key) in inlineDescList">
        <div class="listHead" v-if="key">
          {{key}}
        </div>
        <FilesCheckList align="right" @change="change" v-model="checkData" :options="val"></FilesCheckList>
      </div>
    </loadMore>
    <div v-if="isShowBtn" class="tabFiles_emailBtn">
      <mt-button @click="sendEmail">
        <img src="../../../assets/images/icon/emailIcon.png" height="20" width="20" slot="icon"> {{$t('send')}}
      </mt-button>
    </div>
    <alert :alertConfig="alertConfig1" @btnFun="btnFun"></alert>
  </div>
</template>

<script>
import { Checklist } from "vux";
import alert from "@/components/alert";
import FilesCheckList from "@/components/FilesCheckList.vue";
import loadMore from "@/components/loadMore";
export default {
  name: "tabFiles",
  components: {
    FilesCheckList,
    loadMore,
    alert
  },
  data() {
    return {
      loadMoreData: {
        allLoaded: true, //是否不允许上拉加载
        isRefresh: false, //是否刷新完成
        isLoadMore: false //是否加载完成
      },
      isShowBtn: false,
      checkData: [],
      inlineDescList: [],
      alertConfig: {},
      alertConfig1: { type: "1" }
    };
  },
  mounted() {
    console.log("这里是files");
    this.getFileList(true);
  },
  methods: {
    refresh() {
      this.getFileList(false);
    },
    change(val, label) {
      console.log("change", this.checkData);
    },
    getFileList(bool) {
      this.$Get(this.$api.queryGeneralFile, "", bool)
        .then(res => {
          this.loadMoreData.isRefresh = true;
          if (res.code == 0) {
            this.inlineDescList = res.datas;
            if (JSON.stringify(this.inlineDescList) == "{}") {
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
            console.log("获取file失败");
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
    },
    sendEmail() {
      let sendArr = [];
      let checkData = this.checkData;
      if (!checkData.length) {
        return;
      }
      for (let i = 0; i < checkData.length; i++) {
        sendArr.push({
          name: checkData[i].title,
          path: checkData[i].url
        });
      }
      this.$Get(this.$api.sendFileMail, {
        files: JSON.stringify(sendArr)
      }).then(res => {
        if (res.code == 0) {
          this.alertConfig1 = {
            isShow: true,
            btnText: "CLOSE",
            err: this.$t("emailErr2"),
            img: "/img/alert/changePwd.png",
            btnBackground: "#676572",
            type: "1"
          };
        } else {
          if (res)
            this.alertConfig1 = {
              isShow: true,
              btnText: "CLOSE",
              err: this.$t("emailErr1"),
              tips: res.msg || "",
              img: "/img/alert/noPwd.png",
              btnBackground: "#676572",
              type: "1"
            };
        }
      });
    },
    btnFun() {
      this.alertConfig1.isShow = false;
    }
  }
};
</script>

<style lang="less">
.tabFiles {
  height: 100%;
  overflow-y: scroll;
  .listHead {
    padding: 0.5vh 15px;
    margin-bottom: 2%;
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
  .tabFiles_box {
    // padding-top: 1vh;
    // .weui-cells:before,
    // .weui-cells:after,
    // .weui-cell:before {
    //   display: none;
    // }
    // .weui-cell {
    //   border-bottom: 1px solid #f4f4f4;
    //   padding: 1.5vh 2vh;
    //   padding-left: 6vh;
    //   position: relative;
    //   .weui-check:checked + .vux-checklist-icon-checked:before {
    //     color: #5160f1;
    //   }
 //   .weui-cell__bd {
    //     width: 80%;
    //     p {
    //       font-size: 1.8vh;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //       white-space: nowrap;
    //     }
    //     .vux-label-desc {
    //       display: block;
    //       font-size: 1.5vh;
    //       line-height: 1.3;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //       white-space: nowrap;
    //     }
    //   }
    // }
    // .weui-cell:after {
    //   position: absolute;
    //   width: 3vh;
    //   height: 3vh;
    //   content: "";
    //   top: 50%;
    //   margin-top: -1.5vh;
    //   background: url("../../../assets/images/icon/file_icon.png") no-repeat 0 0;
    //   background-size: 100% 100%;
    //   left: 2vh;
    // }
  }
  .tabFiles_emailBtn {
    text-align: center;
    margin-top: 15vh;
    padding-bottom: 5vh;
    .mint-button {
      background-color: #5160f1;
      color: #ddd;
      width: 25vh;
      border-radius: 5vh;
      font-size: 2vh;
      height: 5vh;
    }
  }
}
</style>