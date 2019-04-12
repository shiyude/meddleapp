<template>
  <div class="login">
    <div class="logNmae">ECOPROP</div>
    <div class="loginDiv">
      <group>
        <x-input v-model="form.email" :placeholder="$t('email')"></x-input>
      </group>
      <group>
        <x-input v-model="form.pwd" name="pssword" :placeholder="$t('pwd')" type="password"></x-input>
      </group>
      <x-button @click.native="addIndex" class="login_btn" type="warn">{{$t('login')}}</x-button>
      <p class="forget_text">{{$t('ForgetPassword')}}
        <span @click="$router.push('/forget')">{{$t('Resetpassword')}}</span> {{$t('here')}}</p>
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
import loginSuccess from "../../util/unitDock/login";
export default {
  name: "login",
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
        pwd: ""
      },
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
  mounted() {
    this.getSysConfig();
  },
  methods: {
    addIndex() {
      if (!this.form.email || !this.form.pwd) {
        this.alertConfig.isShow = true;
        this.alertConfig.tips = this.$t("Login_error");
      } else {
        this.$Post(
          this.$api.login,
          {
            email: this.form.email,
            password: md5(this.form.pwd)
          },
          true
        ).then(res => {
          if (res.code == 0) {
            console.log(res);
            this.$navigation.cleanRoutes();
            localStorage.setItem("userInfo", JSON.stringify(res.datas));
            this.$router.push("/home");
            loginSuccess({
              agentId: res.datas.agentId,
              brokeId: res.datas.brokeId
            });
          } else {
            console.log(res);
            this.alertConfig.tips = res.msg;
            this.alertConfig.isShow = true;
          }
        });
      }
    },
    doShowToast() {
      this.alertConfig.isShow = false;
    },
    getSysConfig() {
      this.$Get(this.$api.querySysConfig, {}).then(res => {
        if (res.code == 0) {
          localStorage.setItem("imgUlr", res.datas.img_url);
        }
      });
    }
  }
};
</script>

<style lang="less">
.login {
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
  .logNmae {
    margin-top: 40%;
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    text-shadow: 0 2px 1px #ddd;
  }
  .loginDiv {
    width: 80%;
    left: 10%;
    position: absolute;
    bottom: 20%;
    .forget_text {
      text-align: center;
      color: #293462;
      font-size: 14px;
      margin-top: 10px;
      span {
        color: #fff;
      }
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