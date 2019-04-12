<template>
  <div class="forgetPassword">
    <div class="forgetPasswordDiv">
      <group>
        <x-input v-model.trim="form.email" :placeholder="$t('email')"></x-input>
      </group>
      <group>
        <x-input v-model.trim="form.code" :placeholder="$t('code')">
          <span slot="right" class="send_code" @click="getCode" v-if="!isTime">{{$t('sendcode')}}</span>
          <span slot="right" class="send_code" v-else>{{time}}s</span>
        </x-input>
      </group>
      <group>
        <x-input v-model.trim="form.pwd" :placeholder="$t('pwd')" type="password"></x-input>
      </group>

      <group>
        <x-input v-model.trim="form.pwd1" :placeholder="$t('confirmpassword')" type="password"></x-input>
      </group>
      <x-button @click.native="verification" class="login_btn" type="warn">{{$t('resetPass')}}</x-button>
      <p class="forget_text">
        {{$t('Alreadyhaveanaccount')}}
        <span @click="$router.back()"> {{$t('Signin')}}</span> {{$t('here')}}</p>
    </div>
    <div>
      <alert @btnFun="doShowToast" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { TransferDomDirective as TransferDom } from "vux";
import alert from "@/components/alert.vue";
import { Toast } from "mint-ui";
export default {
  name: "forget",
  directives: {
    TransferDom
  },
  components: {
    alert
  },
  data() {
    return {
      form: {
        email: "",
        code: "",
        pwd: "",
        pwd1: ""
      },
      isTime: false,
      time: 60,
      alertConfig: {
        type: "1",
        img: "/img/alert/noPwd.png",
        err: this.$t("remind"),
        tips: "",
        btnText: this.$t("CLOSE"),
        isShow: false
      }
    };
  },
  mounted() {},
  methods: {
    timeReduce() {
      let self = this;
      this.isTime = true;
      this.timer = setInterval(() => {
        if (self.time == 0) {
          self.isTime = false;
          self.time = 60;
          clearInterval(self.timer);
        } else {
          self.time--;
        }
      }, 1000);
    },
    getCode() {
      let self = this;
      if (!this.form.email) {
        this.alertConfig.tips = this.$t("email");
        this.alertConfig.isShow = true;
        return;
      }
      this.$Post(
        this.$api.sendCode,
        {
          email: this.form.email,
          type: "find_pass"
        },
        true
      ).then(res => {
        if (res) {
          if (res.code == 0) {
            Toast({
              message: self.$t("Sendsuccessfully"),
              duration: 1000
            });
            self.timeReduce();
          } else {
            this.alertConfig.tips = res.msg || "Fail";
            this.alertConfig.isShow = true;
          }
        }
      });
    },
    verification() {
      if (!this.form.email) {
        this.alertConfig.tips = this.$t("email");
        this.alertConfig.isShow = true;
      } else if (this.form.pwd.length < 6) {
        this.alertConfig.tips = this.$t("passwordLength");
        this.alertConfig.isShow = true;
      } else if (this.form.pwd !== this.form.pwd1) {
        this.alertConfig.tips = this.$t("passwordNoSame");
        this.alertConfig.isShow = true;
      } else {
        if (!this.form.code) {
          this.alertConfig.tips = this.$t("verCode");
          this.alertConfig.isShow = true;
        } else {
          this.resetPas();
        }
      }
    },
    resetPas() {
      this.$Post(
        this.$api.resetPassword,
        {
          email: this.form.email,
          type: "find_pass",
          code: this.form.code,
          password: md5(this.form.pwd)
        },
        true
      ).then(res => {
        if (res.code == 0) {
          this.$router.back();
        } else {
          this.alertConfig.tips = res.msg || "Fail";
          this.alertConfig.isShow = true;
        }
      });
    },
    doShowToast() {
      this.alertConfig.isShow = false;
    }
  }
};
</script>

<style lang="less">
.forgetPassword {
  height: 100%;
  background: -moz-linear-gradient(top, #49ccfa 0%, #5160f1 100%);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #49ccfa),
    color-stop(100%, #5160f1)
  );
  background: -webkit-linear-gradient(top, #49ccfa 0%, #5160f1 100%);
  background: -o-linear-gradient(top, #49ccfa 0%, #5160f1 100%);
  background: -ms-linear-gradient(top, #49ccfa 0%, #5160f1 100%);
  background: linear-gradient(to bottom, #49ccfa 0%, #5160f1 100%);
  .forgetPasswordDiv {
    width: 80%;
    left: 10%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .forget_text {
      text-align: center;
      color: #293462;
      font-size: 14px;
      margin-top: 10px;
      span {
        color: #fff;
      }
    }
    .send_code {
      color: #fff;
      font-size: 14px;
    }
    .weui-cells {
      border-radius: 10px;
      background-color: #293462;
      color: #fff;
    }
    .weui-cells:before,
    .weui-cells:after {
      display: none;
    }
    .login_btn {
      margin-top: 30px;
      border-radius: 50px;
    }
  }
  .hint-dialog {
    .weui-dialog {
      max-width: 100%;
      border-radius: 20px;
      padding: 20px;
    }
    .hint-dialog-div {
      border-radius: 20px;
      .dialog_conter_icon {
        .icon_div {
          width: 60%;
          padding-bottom: 50%;
          background-color: red;
          margin: 0 auto;
          margin-top: 20px;
        }
        margin-bottom: 20px;
      }
      .dialog_conter {
        h2 {
          line-height: 1.2;
        }
        p {
          color: #999;
          margin-top: 20px;
        }
      }
    }
    .btns {
      margin: 20px 0;
      background-color: #676572;
      border-radius: 50px;
      color: #fff;
    }
  }
}
</style>