<template>
  <div class="loadMore_wrapper" ref="loadMoreWrapper">
    <mt-loadmore :topDistance="50" :bottomDistance="50" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="loadMoreData.allLoaded" ref="loadmore" :auto-fill="false" style="min-height:100%" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange">
      <div class="lodamore_div" v-if="!alertConfig.isShow">
        <slot></slot>
      </div>
      <div class="no_data" :style="{'height':noDataHeight+'px'}" v-else>
        <alert :alertConfig="alertConfig" @btnFun="btnFun"></alert>
      </div>
      <div slot="top" class="mint-loadmore-top">
        <mt-spinner v-show="topStatus == 'loading'" color="#000" type="fading-circle"></mt-spinner>
      </div>
      <div slot="bottom" class="mint-loadmore-bottom">
        <mt-spinner v-show="bottomStatus == 'loading'" type="fading-circle" color="#000"></mt-spinner>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
import alert from "@/components/alert";
export default {
  name: "loadMore",
  props: {
    loadMoreData: {
      type: Object
    },
    alertConfig: {
      type: Object
    }
  },
  components: {
    alert
  },
  data() {
    return {
      topStatus: "",
      bottomStatus: "",
      noDataHeight: 0
    };
  },
  mounted() {
    this.noDataHeight = this.$refs["loadMoreWrapper"].clientHeight;
  },
  methods: {
    btnFun() {
      this.alertConfig.isShow = false;
      window.location.reload();
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    loadTop() {
      this.handleTopChange("loading");
      this.loadMoreData.isRefresh = false;
      this.$emit("refresh");
    },
    loadBottom() {
      this.handleBottomChange("loading");
      this.loadMoreData.isLoadMore = false;
      this.$emit("loadMore");
    }
  },
  watch: {
    "loadMoreData.isRefresh"(now) {
      if (now) {
        this.handleTopChange("loadingEnd");
        this.$refs.loadmore.onTopLoaded();
      }
    },
    "loadMoreData.isLoadMore"(now) {
      if (now) {
        this.handleBottomChange("loadingEnd");
        this.$refs.loadmore.onBottomLoaded();
      }
    }
  }
};
</script>
<style lang="less">
.loadMore_wrapper {
  height: 100%;
  .lodamore_div {
    &::after {
      display: table;
      content: "";
      clear: both;
    }
  }
  .mint-loadmore-top,
  .mint-loadmore-bottom {
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .no_data {
    &::before{
      display: table;
      content:""
    }
  }
}
</style>


