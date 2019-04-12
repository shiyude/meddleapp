 <template>
  <div class="Files">
    <div class="Files_box" v-if="JSON.stringify(inlineDescList)!=='{}'" v-for="(val,key) in inlineDescList">
      <div class="listHead" v-if="key">
        {{key}}
      </div>
      <FilesCheckList align="right" @change="change" v-model="checkData" :options="val"></FilesCheckList>
    </div>
    <div v-if="isShowBtn" class="emailBtn">
      <mt-button @click="sendEmail">
        <img src="../../../../assets/images/icon/emailIcon.png" height="20" width="20" slot="icon"> {{$t('send')}}
      </mt-button>
    </div>
    <alert :alertConfig="alertConfig" @btnFun="btnFun"></alert>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
import FilesCheckList from "@/components/FilesCheckList.vue";
export default {
  nama: "Files",
  components: {
    FilesCheckList,
    alert
  },
  data() {
    return {
      isShowBtn: false,
      checkData: [],
      inlineDescList: {},
      alertConfig: {
        type: "1"
      }
    };
  },
  mounted() {
    let queryInfo = this.$route.query;
    this.getFilesPdf(queryInfo.id);
  },
  methods: {
    change(val, label) {
      this.checkData = val;
      if (this.checkData.length) {
        this.isShowBtn = true;
      } else {
        this.isShowBtn = false;
      }
      console.log("change", this.checkData);
    },
    getFilesPdf(id) {
      this.$Get(this.$api.queryMediaPDFList, { projectId: id }, true).then(
        res => {
          if (res.code == 0) {
            this.inlineDescList = res.datas;
            // this.inlineDescList = res.datas.map(item => {
            //   if (item.restrictEmail == 0) {
            //     item.disabled = true;
            //   }
            //   return item;
            // });
            for (let key in this.inlineDescList) {
              for (let i = 0; i < this.inlineDescList[key].length; i++) {
                if (this.inlineDescList[key][i].restrictEmail == 0) {
                  this.inlineDescList[key][i].disabled = true;
                }
              }
            }
            if (JSON.stringify(this.inlineDescList) == "{}") {
              this.alertConfig = {
                isShow: true,
                img: "/img/alert/noContent.png",
                err: this.$t("ComingSoon"),
                tips: this.$t("noContent")
              };
            } else {
              this.btnFun();
            }
          }
        }
      );
    },
    sendEmail() {
      let sendArr = [];
      let checkData = this.checkData;
      for (let i = 0; i < checkData.length; i++) {
        sendArr.push({
          name: checkData[i].title,
          path: checkData[i].url
        });
      }
      this.$Get(
        this.$api.sendFileMail,
        {
          files: JSON.stringify(sendArr)
        },
        true
      ).then(res => {
        if (res.code == 0) {
          this.alertConfig = {
            isShow: true,
            btnText: "CLOSE",
            err: this.$t("emailErr2"),
            img: "/img/alert/changePwd.png",
            btnBackground: "#676572",
            type: "1"
          };
        } else {
          this.alertConfig = {
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
      this.alertConfig.isShow = false;
      this.alertConfig.type = "1";
    }
  }
};
</script>

<style lang="less">
.Files {
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
  .Files_box {
    // padding-top: 1vh;
  }
  .emailBtn {
    text-align: center;
    margin-top: 5vh;
    margin-bottom: 5vh;
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