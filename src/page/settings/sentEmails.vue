<template>
  <div class="sent_emails">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">{{$t('sentEmails')}}</x-header>
    <div class="content">
      <div class="title">{{$t('emailList')}}</div>
      <div class="email_list" v-if="emailList.length">
        <div class="email_item" v-for="item in emailList">
          <div class="email_item_left">
            <div>{{item.recipientName}}
              <{{item.recipientEmail}}>
            </div>
            <p>{{item.sendTime}}</p>
          </div>
          <div class="email_item_right">
            <span>{{$t('sent')}}</span>
          </div>
        </div>
      </div>
      <alert v-if="emailList.length === 0" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>
<script>
import alert from "@/components/alert.vue";
export default {
  name: "sendEmails",
   components: {
    alert
  },
  data() {
    return {
      emailList: [],
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  mounted() {
    this.getEmailList();
  },
  methods: {
    getEmailList() {
      this.$Get(this.$api.querySentEmailList, {
        pageNo: 1,
        pageSize: 10000
      },true).then(res => {
        if (res.code == 0) {
          this.emailList = res.datas;
        }
      });
    }
  }
};
</script>
<style lang="less">
.sent_emails {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .content {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    .title {
      padding: 1vh;
      font-size: 1.4vh;
      color: #768492;
      padding-left: 2.5vh;
      background-color: #f4f6f9;
    }
    .email_list {
      .email_item {
        padding: 2vh 2.5vh;
        background-color: #fff;
        border-bottom: 2px solid #f4f6f9;
        &::after {
          content: "";
          display: table;
          clear: both;
        }
        .email_item_left {
          float: left;
          width: 80%;
          div {
            font-size: 2vh;
            font-weight: 600;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p {
            font-size: 1.6vh;
            color: #999;
          }
        }
        .email_item_right {
          float: left;
          width: 20%;
          text-align: right;
          span {
            background-color: #43d4ba;
            color: #fff;
            font-size: 1.6vh;
            padding: 0.5vh 1vh;
            border-radius: 0.3vh;
          }
        }
      }
    }
  }
}
</style>


