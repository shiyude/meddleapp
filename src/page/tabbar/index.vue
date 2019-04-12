<template>
  <div class="tabIndex">
    <div class="tabIndex_left" v-transfer-dom>
      <!-- 左侧弹窗 -->
      <popup class="tabIndex_popup" is-transparent v-model="isShow" position="left">
        <div class="position-left-popup">
          <div class="popup_div">
            <div class="user_div">
              <div class="user_div_box">
                <div :style="{backgroundImage: 'url(' + bgImg + ')'}" class="user_div_img"></div>
                <h3 v-if="userInfo.agentName" class="user_name">{{userInfo.agentName}}</h3>
                <p v-if="userInfo.email" class="user_email">{{userInfo.email}}</p>
              </div>
            </div>
            <ul class="link_ul">
              <!-- <li @click="$router.push('/syncDownload')" class="sync_li">
                <span>{{$t('SyncDownload')}}</span>
              </li>-->
              <li @click="$router.push('/emailSetting')" class="email_setting_li">
                <span>{{$t('EmailSettings')}}</span>
              </li>
              <li @click="$router.push('/sentEmails')" class="sent_email_li">
                <span>{{$t('SentEmails')}}</span>
              </li>
              <li @click="$router.push('/passwordChange')" class="password_li">
                <span>{{$t('PasswordChange')}}</span>
              </li>
              <li @click="$router.push('/collectLists')" class="favorite_li">
                <span>{{$t('favorite')}}</span>
              </li>
              <li @click="$router.push('/myFile')" class="file_li">
                <span>{{$t('myFile')}}</span>
              </li>
              <li @click="$router.push('/calenday')" class="calenday_li">
                <span>{{$t('calenday')}}</span>
              </li>
              <li @click="getCache" class="clear_li">
                <span>{{$t('ClearCache')}}</span>
              </li>
              <!-- <li @click="$router.push('/reports')" class="report_li">
                <span>{{$t('Reports')}}</span>
              </li>-->
              <li @click="$router.push('/language')" class="language_li">
                <span>{{$t('Language')}}</span>
              </li>
              <li @click="IsLoginOut" class="out_li">
                <span>{{$t('LogOut')}}</span>
              </li>
            </ul>
          </div>
        </div>
      </popup>
    </div>
    <!-- 内容 -->
    <div class="tabIndex_right" :class="{ isTabActive: isShow }">
      <x-header class="index_header">
        <span v-if="isActive === 'starBuy'">{{$t('starBuy')}}</span>
        <span v-if="isActive === 'files'">{{$t('files')}}</span>
        <span v-if="isActive === 'homePage'">{{userInfo.brokeName}}</span>
        <span v-if="isActive === 'inbox'">{{$t('inbox')}}</span>
        <span v-if="isActive === 'coBroke'">{{$t('coBroke')}}</span>
        <x-icon @click="showLeft" slot="overwrite-left" type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
        <span class="coBroke_btn" @click="coBrokeSeekFn" v-if="isActive === 'coBroke'" slot="right"></span>
        <span class="files_btn" @click="filesSendFn" v-if="isActive === 'files'" slot="right">{{$t('Send')}}</span>
        <span class="inbox_send" @click="inboxSendFn" v-if="isActive === 'inbox' && userInfo.icTeam == 1" slot="right"></span>
        <span class="inbox_set" @click="inboxSendSet" v-if="isActive === 'inbox'" slot="right"></span>
      </x-header>
      <!-- tab内容区 -->
      <div class="tabIndex_contenr">
        <keep-alive>
          <component ref="componentDom" :is="view"></component>
        </keep-alive>
      </div>
      <!-- tab导航 -->
      <!-- 经纪公司 -->
      <tabbar class="tab_conter" v-if="userInfo.type === 3 || userInfo.type === 1">
        <tabbar-item @on-item-click="getPage('starBuy')" :selected="isActive === 'starBuy'">
          <img v-if="isActive === 'starBuy'" slot="icon" src="@/assets/images/icon/starBuy_active.png">
          <img v-else slot="icon" src="@/assets/images/icon/starBuy.png">
          <span slot="label">{{$t('starBuy')}}</span>
        </tabbar-item>
        <tabbar-item @on-item-click="getPage('files')" :selected="isActive === 'files'">
          <img v-if="isActive === 'files'" slot="icon" src="@/assets/images/icon/files_active.png">
          <img v-else slot="icon" src="@/assets/images/icon/files.png">
          <span slot="label">{{$t('files')}}</span>
        </tabbar-item>
        <tabbar-item class="home_box" :class="{home_box_active: isActive === 'homePage'}" @on-item-click="getPage('homePage')" :selected="isActive === 'homePage'">
          <img v-if="isActive === 'homePage'" slot="icon" src="@/assets/images/icon/home_active.png">
          <img v-else slot="icon" src="@/assets/images/icon/home.png">
        </tabbar-item>
        <tabbar-item @on-item-click="getPage('inbox')" :selected="isActive === 'inbox'">
          <img v-if="isActive === 'inbox'" slot="icon" src="@/assets/images/icon/inbox_active.png">
          <img v-else slot="icon" src="@/assets/images/icon/inbox.png">
          <span slot="label">{{$t('inbox')}}</span>
        </tabbar-item>
        <tabbar-item @on-item-click="getPage('coBroke')" :selected="isActive === 'coBroke'">
          <img v-if="isActive === 'coBroke'" slot="icon" src="@/assets/images/icon/coBroke_active.png">
          <img v-else slot="icon" src="@/assets/images/icon/coBroke.png">
          <span slot="label">{{$t('coBroke')}}</span>
        </tabbar-item>
      </tabbar>

      <!-- 开发商 -->
      <tabbar class="tab_conter_developers" v-if="userInfo.type === 2">
        <tabbar-item class="home_box" :class="{home_box_active: isActive === 'homePage'}" @on-item-click="getPage('homePage')" :selected="isActive === 'homePage'">
          <img v-if="isActive === 'homePage'" slot="icon" src="@/assets/images/icon/developers_home_active.png">
          <img v-else slot="icon" src="@/assets/images/icon/developers_home.png">
          <span slot="label">{{$t('home')}}</span>
        </tabbar-item>
        <tabbar-item @on-item-click="getPage('inbox')" :selected="isActive === 'inbox'">
          <img v-if="isActive === 'inbox'" slot="icon" src="@/assets/images/icon/inbox_active.png">
          <img v-else slot="icon" src="@/assets/images/icon/inbox.png">
          <span slot="label">{{$t('inbox')}}</span>
        </tabbar-item>
      </tabbar>
    </div>
    <alert :alertConfig="alertConfig" @btnFun="outLogin"></alert>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, TransferDom } from "vux";
import alert from "@/components/alert";
import { userInfo } from "os";
import { getCacheSize, clearCacheBefore } from "../../util/unitDock/clearCache";
import { mapState } from "vuex";
export default {
  name: "index",
  directives: {
    TransferDom
  },
  components: {
    alert,
    Tabbar,
    TabbarItem,
    homePage: () => import("@/page/tabbar/home/homePage"),
    coBroke: () => import("@/page/tabbar/coBroke/coBroke"),
    files: () => import("@/page/tabbar/files/files"),
    inbox: () => import("@/page/tabbar/inbox/inbox"),
    starBuy: () => import("@/page/tabbar/starBuy/starBuy")
  },
  data() {
    return {
      hostUrl: window.localStorage.getItem("imgUlr") || "",
      userInfo: {},
      isActive: "homePage",
      view: "homePage",
      isShow: false,
      bgImg: require("../../assets/images/icon/head.png"),
      alertConfig: {
        isShow: false,
        img: "/img/alert/loginout.png",
        err: "Are you sure you<br/>want to logout?",
        tips:
          "Your will request to login again<br/>when you use the app next time",
        btnText: "LOGOUT",
        btnBackground: "#5C7BE7",
        type: "1",
        isShowClose: true
      },
      userInfo: {},
      type: 2
    };
  },
  created() {
    // 刷新时候调用
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "{}");
    if (this.userInfo.logo || this.logo) {
      this.bgImg = this.logo || this.hostUrl + this.userInfo.logo;
      console.log(this.logo);
    }

    if (sessionStorage.getItem("tab")) {
      this.view = sessionStorage.getItem("tab");
      this.isActive = sessionStorage.getItem("tab");
    }
  },
  mounted() {
    // this.getSysConfig();
    window["Settings"] = this;
    this.setInBoxAuthority();
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(this.userInfo.type);
    // this.type = type
  },
  computed: mapState(["logo"]),
  watch: {
    logo(now) {
      this.bgImg = now;
    }
  },
  methods: {
    getPage(name) {
      sessionStorage.setItem("tab", name);
      this.view = name;
      this.isActive = name;
      switch (name) {
        case "starBuy":
          // console.log(name);
          break;
        case "files":
          // console.log(name);
          break;
        case "home":
          // console.log(name);
          break;
        case "inbox":
          // console.log(name);
          break;
        case "coBroke":
          // console.log(name);
          break;
      }
    },
    coBrokeSeekFn() {
      // 调起coBroke搜索
      this.$refs.componentDom.openSeekFn();
    },
    filesSendFn() {
      // 调起FILES发送
      this.$refs.componentDom.sendEmail();
    },
    inboxSendFn() {
      // 调起InBox发送
      this.$router.push("/inBox/SendMessage");
    },
    inboxSendSet() {
      // 调起InBox设置
      this.$router.push("/inBox/setInBox");
    },
    showLeft() {
      this.isShow = true;
    },
    IsLoginOut() {
      this.alertConfig.isShow = true;
    },
    outLogin() {
      if (localStorage.getItem("userInfo")) {
        sessionStorage.clear();
        localStorage.clear();
        this.$router.replace("/");
      }
    },
    // getSysConfig() {
    //   this.$Get(this.$api.querySysConfig, {}).then(res => {
    //     if (res.code == 0) {
    //       this.hostUrl = res.datas.img_url
    //       localStorage.setItem("imgUlr", res.datas.img_url);
    //     }
    //   });
    // },
    setInBoxAuthority() {
      let setInboxInfo = JSON.parse(localStorage.getItem("SetInbox"));
      if (!setInboxInfo) {
        this.$Get(this.$api.queryBrokeProject, { type: 1 }).then(res => {
          if (res.code == 0) {
            if (res.datas) {
              let data = res.datas.map(item => {
                return item.projectId;
              });
              localStorage.setItem("SetInbox", JSON.stringify(data));
            }
          }
        });
      }
    },
    getCache() {
      //通知unit获取缓存大小
      window.location.href = "uniwebview://meset";
    },
    setSize(size) {
      //给unit调用展示缓存大小弹窗
      getCacheSize(size, this);
    },
    clearCache() {
      //清除缓存以后给unit调用
      clearCacheBefore(this);
    }
  }
};
</script>

<style lang="less">
@import "../../style/index_left.less";
.tabIndex {
  width: 100%;
  height: 100%;
  // overflow: hidden;
  .tabIndex_right {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #fff;
    transition: transform 0.3s, visibility 0.3s;
    .tabIndex_contenr {
      position: absolute;
      top: 80px;
      width: 100%;
      bottom: 50px;
    }
    .weui-tabbar {
      position: fixed;
    }
    .tab_conter {
      background-color: #fff;
      border-top: 1px solid #f6f6f6;
      .weui-tabbar__item {
        z-index: 888;
        background: #fff;
      }
      .home_box {
        position: relative;
        .weui-tabbar__icon {
          background-color: #e6e6e6;
          width: 70px;
          height: 70px;
          margin-top: -25px;
          border-radius: 50%;
          position: relative;
          img {
            position: absolute;
            width: 35px;
            height: 35px;
            top: 20%;
            left: 25%;
          }
        }
      }
      .home_box_active {
        .weui-tabbar__icon {
          background-color: #516be6;
        }
      }
    }
    .tab_conter:after {
      content: "";
      position: absolute;
      height: 100px;
      width: 120px;
      top: -45%;
      left: 50%;
      margin-left: -60px;
      background: #fff;
      border-radius: 50%;
      border: 1px solid #f6f6f6;
    }
    .tab_conter_developers {
    }
    .index_header {
      height: 80px;
    }
  }
  .isTabActive {
    transform: translate3d(70%, 0px, 0px);
  }
  @media screen and (min-width: 767px) {
    .isTabActive {
      transform: translate3d(35%, 0px, 0px);
    }
  }
}
</style>