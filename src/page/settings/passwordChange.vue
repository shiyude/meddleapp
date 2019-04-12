<template>
  <div class="password_change">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">{{$t('changePassword')}}
      <a class="header_right" slot="right" @click="changePassword">{{$t('save')}}</a>
    </x-header>
    <div class="content">
      <group class="password_group" label-width="20vh" title-color="#768492">
        <x-input :title="$t('oldPassword')" type="password" v-model.trim="oldPassword"></x-input>
        <x-input :title="$t('newPassword')" type="password" v-model.trim="newPassword"></x-input>
        <x-input :title="$t('confirmPassword')" type="password" v-model.trim="confirmPassword"></x-input>
      </group>
    </div>
    <alert :alertConfig="alertConfig" @btnFun="btnFun"></alert>
  </div>
</template>
<script>
import md5 from "js-md5";
import alert from "@/components/alert";
export default {
  name: "passwordChange",
  components: {
    alert
  },
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      isChange: false,
      alertConfig: {
        isShow: false,
        img: "/img/alert/noPwd.png",
        err: this.$t("passwordErr1"),
        tips: this.$t("passwordTip1"),
        btnText: "CLOSE",
        btnBackground: "#676572",
        type: "1"
      }
    };
  },
  methods: {
    changePassword() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.isChange = false;
        this.alertConfig.isShow = true;
      } else {
        if (
          this.newPassword.length < 6 ||
          this.newPassword !== this.confirmPassword
        ) {
          this.isChange = false;
          this.alertConfig.isShow = true;
        } else {
          this.$Get(this.$api.changePassword, {
            oldPassword: md5(this.oldPassword),
            newPassword: md5(this.newPassword)
          },true).then(res => {
            if (res.code == 0) {
              this.isChange = true;
              this.alertConfig.img = "/img/alert/changePwd.png";
              this.alertConfig.err = this.$t("passwordErr2");
              this.alertConfig.tips = this.$t("passwordTip2");
              this.alertConfig.isShow = true;
            } else {
              this.isChange = false;
              this.alertConfig.err = this.$t("passwordErr3");
              this.alertConfig.tips = this.$t("passwordTip3");
              this.alertConfig.isShow = true;
            }
          });
        }
      }
    },
    btnFun() {
      if (!this.isChange) {
        this.alertConfig.isShow = false;
      } else {
        if (localStorage.getItem("userInfo")) {
          localStorage.removeItem("userInfo");
          localStorage.removeItem("tab");
          this.$router.push("/");
        }
      }
    }
  }
};
</script>
<style lang="less">
.password_change {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background-color: #f4f6f9;
  .header_right {
    // padding-top: 25px;
    color: #fff;
  }
  .content {
    .weui-cells {
      margin-top: 0;
    }
    .weui-cell {
      color: #6c7b8a;
      font-size: 1.6vh;
      padding: 2vh 2.5vh;
      &::before {
        left: 0;
      }
      .weui-input {
        font-size: 1.8vh;
        color: #000;
      }
    }
  }
}
</style>


