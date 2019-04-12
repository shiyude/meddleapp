<template>
  <div class="SitePlan" ref="sitePlan">
    <group class="sitePlanBox">
      <cell @click.native="goPlanPage(item)" v-for="(item,index) in SitePlanData" :key="index" :title="item.sitePlanName" is-link></cell>
    </group>
    <alert v-if="SitePlanData.length === 0" :alertConfig="alertConfig"></alert>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
export default {
  nama: "SitePlan",
  components: {
    alert
  },
  props: {
    detailsInfo: {
      type: Object
    }
  },
  data() {
    return {
      SitePlanData: [],
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  created() {
    this.$removeScrollNum("sitePlan");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.sitePlan, "sitePlan");
    this.getSitePlanList();
  },
  activated() {
    this.$SetScroll(this.$refs.sitePlan, "sitePlan");
  },
  methods: {
    goPlanPage(item) {
      switch (item.type) { // siteplan、allbuilding、building、table
        case "siteplan":
          this.$router.push({
            path: "/projectDetails/siteplanPage",
            query: {
              sitePlanId: item.sitePlanId,
              projectName: this.detailsInfo.projectName,
              projectId: this.detailsInfo.projectId
            }
          });
          break;
        case "building":
          this.$router.push({
            path: "/projectDetails/building",
            query: {
              sitePlanId: item.sitePlanId,
              projectName: this.detailsInfo.projectName,
              projectId: this.detailsInfo.projectId
            }
          });
          break;
        case "allbuilding":
          this.$router.push({
            path: "/projectDetails/building",
            query: {
              sitePlanId: item.sitePlanId,
              projectName: this.detailsInfo.projectName,
              projectId: this.detailsInfo.projectId
            }
          });
          break;
        case "table":
          let params = {
            buildName: item.buildName,
            projectName: this.detailsInfo.projectName,
            projectId: this.detailsInfo.projectId
          };
          this.$route.query.type && (params.type = this.$route.query.type);
          this.$router.push({
            path: "/projectDetails/table",
            query: params
          });
          break;
      }
    },
    getSitePlanList() {
      this.$Get(
        this.$api.querySitePlanList,
        { projectId: this.detailsInfo.projectId },
        true
      ).then(res => {
        if (res.code == 0) {
          this.SitePlanData = res.datas;
        } else {
          console.log("获取SitePlanList失败");
        }
      });
    }
  }
};
</script>

<style lang="less">
.SitePlan {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  .sitePlanBox {
    margin-top: 1vh;
    .weui-cells {
      margin-top: 0px;
      font-size: 2vh;
      color: #666;
      .weui-cell {
        padding: 2vh 20px;
      }
      .weui-cell:before{
        left: 0;
      }
    }
    .weui-cells:first-child::before {
      display: none;
    }
  }
}
</style>