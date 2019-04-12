<template>
  <div class="Email">
    <x-header :eft-options.preventGoBack="true" v-if="unitId" :left-options="{backText:''}" class="nav_head">{{unitName}}</x-header>
    <div class="email_conter" :class="{email_conter_Active: unitId}">
      <group class="email_group" label-width="15vh" label-margin-right="2vh">
        <div class="email_linkman" v-for="(item,index) in form.email" :key="index">
          <x-input :show-clear="false" class="email_linkman_name" placeholder="Mr. Chan" :title="$t('RecipientName')" v-model.trim="item.name">
          </x-input>
          <x-input :show-clear="false" class="email_linkman_site" placeholder="chan@gmail.com" :title="$t('Email')" v-model.trim="item.email"></x-input>
          <span ref="addBtn" @click="addEmail" class="addBtn" v-if="index == 0">
            <x-icon type="ios-plus" size="30"></x-icon>
          </span>
          <span ref="addBtn" @click="reduceEmail(index)" class="addBtn" v-if="index != 0">
            <x-icon type="ios-minus" size="30"></x-icon>
          </span>
        </div>
        <checklist label-position="left" required :options="commonList" v-model="isSendMe" @on-change="change"></checklist>
        <cell class="file_cell">
          <div slot="title" style="color:#999;">
            <span style="vertical-align:middle;">{{$t('File')}}</span>
            <span v-if="fileListCheck.length">
              <badge :text="fileListCheck.length+'Files included'"></badge>
            </span>
          </div>

          <div @click="addFileBtn" class="addFile">
            <x-icon type="ios-plus" size="30"></x-icon>
          </div>
        </cell>
        <x-textarea :title="$t('Message')" :placeholder="$t('toMessage')" :show-counter="false" :rows="3" v-model.trim="message"></x-textarea>
      </group>
      <div class="btns">
        <mt-button class="btnsOne" type="primary" v-if="unitId" @click="$router.go(-1)">{{$t('Cancel')}}</mt-button>
        <mt-button class="btnsTwo" type="primary" @click="sendFun">{{$t('Send')}}</mt-button>
      </div>
      <div class="addFilePop" v-transfer-dom>
        <popup :hide-on-blur="false" v-model="isShow" class="addFilePop_box" is-transparent>
          <div class="addFilePop_box_div">
            <div class="addFilePop_box_div_top">
              <checklist class="check_file" label-position="left" :options="inlineDescList" v-model="fileListCheck" @on-change="change"></checklist>
            </div>
            <div class="addFilePop_box_div_bom">
              <x-button @click.native="isShow = false">{{$t('Done')}}</x-button>
            </div>
          </div>
        </popup>
      </div>
    </div>
    <alert :alertConfig="alertConfig" @btnFun="btnFun"></alert>
  </div>
</template>

<script>
import { GroupTitle, Checklist, Badge, TransferDom } from "vux";
import alert from "@/components/alert";
export default {
  nama: "Email",
  directives: {
    TransferDom
  },
  components: {
    Checklist,
    Badge,
    alert
  },
  data() {
    return {
      detailsParam: "",
      projectId: "",
      unitId: "",
      form: {
        email: [{ name: "", email: "" }]
      },
      commonList: [this.$t("ccMe")],
      isSendMe: [],
      isShow: false,
      inlineDescList: [],
      fileListCheck: [],
      message: "",
      alertConfig: {
        isShow: false,
        btnText: "CLOSE",
        btnBackground: "#676572",
        type: "1"
      },
      unitName: ""
    };
  },
  mounted() {
    this.projectId = this.$route.query.id || "";
    this.unitId = this.$route.query.unitId || "";
    this.unitName = this.$route.query.unitName || this.$t("unitInfo");
    this.getPdfList();
  },
  methods: {
    btnFun() {
      this.alertConfig.isShow = false;
    },
    change(val, label) {
      // console.log("change", val, label);
    },
    addEmail() {
      if (this.form.email.length < 5) {
        this.form.email.push({ name: "", email: "" });
      }
    },
    reduceEmail(index) {
      this.form.email.splice(index, 1);
    },
    addFileBtn() {
      this.isShow = true;
    },
    getPdfList() {
      this.$Get(
        this.$api.queryMediaPDFList,
        {
          projectId: this.projectId,
          send: "send"
        },
        true
      ).then(res => {
        if (res.code == 0) {
          let data = res.datas;
          // let newArr = [];
          for (let key in res.datas) {
            // console.log(res.datas[key])
            // newArr = newArr.concat(res.datas[key])
            // newArr = [...res.datas[key]]
          
            // this.inlineDescList = this.inlineDescList.cancat(res.datas[key]);
            for(let i=0;i<res.datas[key].length;i++){
                   this.inlineDescList.push({key:res.datas[key][i].url,value:res.datas[key][i].title});
            }
          }
          // console.log(newArr)
          // this.inlineDescList = newArr
          // console.log(this.inlineDescList);
          // if (data.length) {
          //   for (let i = 0; i < data.length; i++) {
          //     this.inlineDescList.push({key:data[i].url,value:data[i].title});
          //   }
          // }
        } else {
          console.log("获取pdf失败");
        }
      });
    },
    sendFun() {
      let formData = this.form.email;
      let isVerification = true;
      for (let i = 0; i < formData.length; i++) {
        if (!formData[i].email) {
          isVerification = false;
          break;
        }
      }
      if (!isVerification) {
        this.alertConfig.err = this.$t("emailErr3");
        this.alertConfig.img = "";
        this.alertConfig.tips = "Please fill in the complete data.";
        this.alertConfig.isShow = true;
      } else {
        let ccMe = this.isSendMe.length ? "1" : "0";
        let paths = this.fileListCheck.join();
        let type = this.unitId ? "unit" : "project";
        this.$Get(
          this.$api.sendMail,
          {
            projectId: this.projectId,
            type: type,
            tos: JSON.stringify(this.form.email),
            unitId: this.unitId,
            ccMe: ccMe,
            message: this.message,
            paths: paths
          },
          true
        ).then(res => {
          if (res.code == 0) {
            this.alertConfig.err = this.$t("emailErr2");
            this.alertConfig.img = "/img/alert/changePwd.png";
            this.alertConfig.isShow = true;
          } else {
            this.alertConfig.err = this.$t("emailErr1");
            this.alertConfig.img = "/img/alert/noPwd.png";
            this.alertConfig.isShow = true;
            console.log("发送邮件失败");
          }
        });
      }
    }
  },
  deactivated() {
    this.form = {
      email: [{ name: "", email: "" }]
    };
    this.isSendMe = [];
    this.fileListCheck = [];
    this.message = "";
  }
};
</script>

<style lang="less">
@import "../../../../style/email.less";
.Email {
  height: 100%;
  .email_conter {
    position: absolute;
    top: 1vh;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: scroll;
    .btns {
      text-align: center;
      margin-top: 5vh;
      margin-bottom: 5vh;
      .btnsOne {
        margin-right: 5vh;
        background-color: #676572;
      }
      .btnsTwo {
        background-color: #5160f1;
      }
      .mint-button--normal {
        padding: 0 0;
        width: 15vh;
        border-radius: 1vh;
        font-size: 2vh;
      }
    }
  }
  .email_conter_Active {
    top: 80px;
  }
  .email_group {
    @media screen and (max-width: 320px) {
      .weui-label {
        width: 17vh !important;
      }
    }
    .weui-cells {
      margin-top: 0;
      font-size: 1.8vh;
    }
    .weui-cells_checkbox
      .weui-check:checked
      + .vux-checklist-icon-checked:before {
      color: #5160f1;
    }
    .weui-cells:before,
    .weui-cells:after,
    .weui-cell:before {
      display: none;
    }
    .email_linkman_site {
      .weui-cell__hd {
        // text-align: right;
      }
    }
    .email_linkman_name {
      position: relative;
    }
    .email_linkman {
      position: relative;
      .addBtn {
        display: block;
        position: absolute;
        width: 30px;
        height: 30px;
        text-align: center;
        right: 3vh;
        top: 5px;
        .vux-x-icon {
          fill: #999;
        }
      }
    }
    .file_cell {
      position: relative;
      .vux-label {
        width: 25vh !important;
      }
      .vux-badge {
        background: #5160f1;
        font-size: 1.2vh;
      }
      .addFile {
        position: absolute;
        width: 30px;
        height: 30px;
        top: 50%;
        margin-top: -1.5vh;
        right: 3vh;
        display: block;
        // border-radius: 50%;
        // line-height: 3vh;
        text-align: center;
        // color: #999;
        // border: 1px solid #999;
        .vux-x-icon {
          fill: #999;
        }
      }
    }
    .weui-cell__hd,
    .weui-cell__bd {
      color: #999;
      .weui-input {
        color: #333;
      }
    }
    .weui-cell {
      padding: 2vh 15px;
      border-bottom: 1px solid #f4f4f4;
    }
  }
}
</style>