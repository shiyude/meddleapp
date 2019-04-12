<template>
  <div class="emailSetting">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">{{$t('emailSettings')}}
      <a class="header_right" slot="right" @click="saveEmail">{{$t('save')}}</a>
    </x-header>
    <div class="content">
      <div class="tab">
        <tab active-color="#000" :line-width="2" v-model="initIndex">
          <tab-item>{{$t('emailSettings')}}</tab-item>
          <tab-item @on-item-click="onItemClick">{{$t('smtp')}}</tab-item>
        </tab>
      </div>
      <div class="tab_content">
        <div class="settings" v-show="initIndex == 0">
          <div class="title">
            {{$t('profilePhoto')}}
          </div>
          <div class="upload_photo" @click="uploadImg">
            <img :src="hostUrl+emailSetting.img" alt="" v-if="emailSetting.img">
            <input type="file" accept="image/*" id="imgFile" style="display:none" @change="fileChange">
          </div>
          <div class="email_setting">
            <group class="email_group" :title="$t('emailSeting')" label-width="12vh" title-color="#768492">
              <x-input :title="$t('emailLow')" v-model.trim="emailSetting.email"></x-input>
              <x-textarea :title="$t('signatrue')" :rows="8" v-model.trim="emailSetting.sigNatrue"></x-textarea>
            </group>
          </div>
        </div>
        <div class="smtp" v-show="initIndex == 1">
          <group class="smtp_group" :title="$t('smtpSettings')" label-width="12vh" title-color="#768492">
            <x-input :title="$t('server')" v-model.trim="emailSetting.server"></x-input>
            <x-input :title="$t('port')" readonly v-model.trim="emailSetting.port"></x-input>
            <x-input :title="$t('username')" v-model.trim="emailSetting.userName"></x-input>
            <x-input :title="$t('password')" type="password" v-model.trim="emailSetting.password"></x-input>
            <x-switch :title="$t('ssl')" v-model.trim="emailSetting.isSsL" class="smpt_switch" @on-change="changeSwitch"></x-switch>
          </group>
        </div>
      </div>
    </div>
    <alert :alertConfig="alertConfig" @btnFun="btnFun"></alert>
    <div>
      <confirm v-model="isConfirm" :confirm-text="$t('yes')" :cancel-text="$t('no')" :title="$t('dataNotSaved')" @on-cancel="cancelConfirm" @on-confirm="onConfirm">
        <p style="text-align:center;">{{$t('sureExit')}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import alert from "@/components/alert";
import { mapMutations } from "vuex";
import { XSwitch, Confirm } from "vux";
export default {
  name: "emailSetting",
  components: {
    alert,
    XSwitch,
    Confirm
  },
  data() {
    return {
      hostUrl: window.localStorage.getItem("imgUlr") || "",
      agentId:JSON.parse(localStorage.getItem("userInfo") || "{}").agentId || "",
      agentName: JSON.parse(localStorage.getItem("userInfo") || "{}").agentName || "",
      email: JSON.parse(localStorage.getItem("userInfo") || "{}").email || "",
      mobile: JSON.parse(localStorage.getItem("userInfo") || "{}").mobile || "",
      regNum: JSON.parse(localStorage.getItem("userInfo") || "{}").regNum || "",
      alertConfig: {
        isShow: false,
        btnText: this.$t("close"),
        btnBackground: "#676572",
        type: "1"
      },
      initIndex: 0,
      emailSetting: {
        img: "",
        email: "",
        sigNatrue: "",
        server: "",
        port: "25",
        userName: "",
        password: "",
        isSsL: false
      },
      originImg: "",
      isChangeForm: false,
      isConfirm: false
    };
  },
  mounted() {
    this.getEmailData();
  },
  methods: {
    ...mapMutations(["changeLogo"]),
    onItemClick() {
      if (this.emailSetting.email) {
        if (!this.emailSetting.userName) {
          this.emailSetting.userName = this.emailSetting.email;
        }
      }
    },
    saveEmail() {
      this.$Get(
        this.$api.saveEmailSetting,
        {
          photo: this.emailSetting.img,
          personal: this.emailSetting.userName,
          signature: this.emailSetting.sigNatrue,
          host: this.emailSetting.server,
          port: this.emailSetting.port,
          username: this.emailSetting.email,
          password: this.emailSetting.password
            ? Base64.encode(this.agentId + this.emailSetting.password)
            : ""
        },
        true
      ).then(res => {
        if (res.code == 0) {
          this.alertConfig.err = this.$t("saveSuccess");
          this.alertConfig.img = "/img/alert/changePwd.png";
          this.alertConfig.isShow = true;
          this.beforeSaveData();
          this.isChangeForm = false;
          this.changeLogo(this.hostUrl + this.emailSetting.img);
        } else {
          this.alertConfig.err = this.$t("saveFail");
          this.alertConfig.img = "/img/alert/noPwd.png";
          this.alertConfig.isShow = true;
        }
      });
    },
    uploadImg() {
      document.getElementById("imgFile").value = "";
      document.getElementById("imgFile").click();
    },
    fileChange() {
      let formData = new FormData();
      let userInfo = JSON.parse(
        window.localStorage.getItem("userInfo") || "{}"
      );
      formData.append("agentId", userInfo.agentId);
      formData.append("brokeId", userInfo.brokeId);
      formData.append("token", userInfo.token);
      formData.append("type", "mailPhoto");
      formData.append("file", document.getElementById("imgFile").files[0]);
      this.$PostFormData(this.$api.uploadFile, formData)
        .then(res => {
          if (res.code == 0) {
            this.emailSetting.img = res.datas.filePath;
            let sessionImg = JSON.parse(
              window.sessionStorage.getItem("emailImg") || "[]"
            );
            sessionImg.push(res.datas.filePath);
            window.sessionStorage.setItem(
              "emailImg",
              JSON.stringify(sessionImg)
            );
          } else {
            console.log("上传失败");
          }
        })
        .catch(err => {
          console.log("上传失败");
        });
    },
    watchSetting() {
      this.$watch(
        "emailSetting",
        function() {
          if (!this.isChangeForm) {
            this.isChangeForm = true;
          }
        },
        {
          deep: true
        }
      );
    },
    getEmailData() {
      this.$Get(this.$api.getEmailSetting, "", true)
        .then(res => {
          if (res.code == 0) {
            if (res.datas) {
              this.emailSetting = {
                img: res.datas.photo ? res.datas.photo : "",
                email: res.datas.username ? res.datas.username : this.email,
                sigNatrue: res.datas.signature ? res.datas.signature : `${this.agentName}
                ${this.mobile}
                ${this.regNum}`,
                server: res.datas.host ? res.datas.host : "",
                port: res.datas.port ? res.datas.port : "",
                userName: res.datas.personal ? res.datas.personal : this.agentName,
                password: res.datas.password
                  ? Base64.decode(res.datas.password).substring(
                      this.agentId.length
                    )
                  : "",
                isSsL: res.datas.port == "25" ? false : true
              };
              this.originImg = res.datas.photo ? res.datas.photo : "";
            }
            this.watchSetting();
          } else {
            this.watchSetting();
            console.log("获取邮箱信息失败");
          }
        })
        .catch(err => {
          this.watchSetting();
        });
    },
    changeSwitch() {
      if (this.emailSetting.isSsL) {
        if (this.emailSetting.port == "465") {
          return;
        }
        this.emailSetting.port = "465";
      } else {
        if (this.emailSetting.port == "25") {
          return;
        }
        this.emailSetting.port = "25";
      }
    },
    btnFun() {
      this.alertConfig.isShow = false;
    },
    beforeSaveData() {
      let sessionImg = JSON.parse(
        window.sessionStorage.getItem("emailImg") || "[]"
      );
      if (sessionImg.length) {
        if (
          this.originImg &&
          this.originImg !== "/upload/broke/defaulthead/head.png"
        ) {
          sessionImg.push(this.originImg);
        }
        let imgIndex = sessionImg.indexOf(this.emailSetting.img);
        imgIndex !== -1 && sessionImg.splice(imgIndex, 1);
        window.sessionStorage.setItem("emailImg", JSON.stringify(sessionImg));
      } else {
        return;
      }
    },
    cancelConfirm() {
      this.isConfirm = false;
    },
    onConfirm() {
      this.isChangeForm = false;
      this.$router.go(-1);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isChangeForm) {
      this.isConfirm = true;
      next(false);
    } else {
      next();
    }
  },

  beforeDestroy() {
    let emailImg = JSON.parse(window.sessionStorage.getItem("emailImg"));
    if (!emailImg) {
      return;
    } else {
      if (!emailImg.length) {
        window.sessionStorage.removeItem("emailImg");
        return;
      }
      this.$Post(this.$api.deleteFile, {
        path: emailImg.join()
      }).then(res => {
        if (res.code == 0) {
          window.sessionStorage.removeItem("emailImg");
        }
      });
    }
  }
};
</script>
<style lang="less" >
.emailSetting {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background-color: #f4f6f9;
  .header_right {
    // padding-top: 25px;
    color: #fff;
  }
  .title {
    padding: 1vh;
    font-size: 1.4vh;
    color: #768492;
    padding-left: 2.5vh;
  }
  .settings {
    .upload_photo {
      height: 10vh;
      position: relative;
      background-color: #fff;
      &::after {
        display: block;
        content: "";
        height: 4vh;
        width: 4vh;
        right: 2vh;
        top: 50%;
        position: absolute;
        background: url("../../assets/images/icon/right.png") no-repeat;
        background-size: 100% 100%;
        margin-top: -2vh;
      }
      img {
        height: 7vh;
        width: 7vh;
        margin: 1.5vh 0 0 2.5vh;
      }
    }
  }
  .weui-cells__title {
    margin: 0;
    padding: 1vh;
    font-size: 1.4vh;
    color: #768492;
    padding-left: 2.5vh;
  }
  .weui-cell {
    color: #6c7b8a;
    font-size: 1.6vh;
    padding: 2vh 2.5vh;
    &::before {
      left: 0;
    }
    .weui-input,
    .weui-textarea {
      font-size: 1.8vh;
      color: #000;
      font-family: -apple-system-font, "Helvetica Neue", sans-serif;
    }
  }
  .smtp {
    .smpt_switch {
      padding: 2vh 2.5vh;
    }
    .weui-switch:checked,
    .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
      border-color: #49ccfa;
      background-color: #49ccfa;
    }
  }
}
</style>




