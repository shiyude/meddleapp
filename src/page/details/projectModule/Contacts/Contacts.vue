<template>
  <div class="Contacts">
    <div class="Contacts_box">
      <div class="HtmlDiv" v-if="detailsInfo.salesContacts">
        <p class="text">{{$t('SalesContacts')}}</p>
        <div v-html="detailsInfo.salesContacts"></div>
      </div>
      <div class="HtmlDiv" v-if="detailsInfo.commission">
        <p class="text">{{$t('Commission')}}</p>
        <div v-html="detailsInfo.commission"></div>
      </div>
      <div class="HtmlDiv" v-if="detailsInfo.externalCommission">
        <p class="text">{{$t('ExternalCommission')}}</p>
        <div v-html="detailsInfo.externalCommission"></div>
      </div>
      <div class="contactImg" v-if="detailsInfo.contactImage">
        <img :src="hostUrl+detailsInfo.contactImage" alt="">
      </div>
      <alert v-if="!detailsInfo.salesContacts && !detailsInfo.commission && !detailsInfo.externalCommission" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
export default {
  nama: "Contacts",
  props: {
    detailsInfo: {
      type: Object
    }
  },
  components: {
    alert
  },
  data() {
    return {
      hostUrl: window.localStorage.getItem("imgUlr") || "",
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  mounted() {
    
  },
  methods: {}
};
</script>

<style lang="less">
.Contacts {
  height: 100%;
  .Contacts_box {
    position: absolute;
    top: 1vh;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2vh;
    overflow-y: scroll;
    padding-top: 0;
  }
  .HtmlDiv{
    .text{
      font-weight: bold;
      margin-bottom: 1vh;
    }
    img{
      width: 100%;
    }
  }
  .contactImg{
    img{
      width:100%;
    }
  }
}
</style>