<template>
  <div class="collectList">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">{{$t('collectList')}}</x-header>
    <div ref="collectList" class="project_div">
      <ul class="project_div_box" v-infinite-scroll="loadMore" infinite-scroll-distance="30">
        <li v-for="item in projectData">
          <card-box :itemData="item"    :isFavorite="true" @cancelCollect="cancelCollectFun"></card-box>
        </li>
      </ul>
      <p class="loadingBox" v-if="loading && projectData.length != 0">
        <mt-spinner type="fading-circle"></mt-spinner>
      </p>
      <alert v-if="projectData.length === 0" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>

<script>
import cardBox from "@/components/cardBox.vue";
import alert from "@/components/alert.vue";
export default {
  name: "collectList",
  components: {
    cardBox,
    alert
  },
  data() {
    return {
      projectData: [],
      pageSize: 8,
      pageNo: 1,
      loading: false,
      isTrue: true,
      count: "",
      alertConfig: {
        isShow: true,
        img: "/img/alert/noSeek.png",
        err: this.$t("noFind"),
        tips: this.$t("noFindText")
      }
    };
  },
  created() {
    this.$removeScrollNum("collectList");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.collectList, "collectList");
  },
  activated() {
    this.$SetScroll(this.$refs.collectList, "collectList");
  },
  methods: {
    cancelCollectFun(data) {
      let index = this.projectData.findIndex((value,index)=>{
         return value.collectId == data.collectId
          
      })
     this.projectData.splice(index,1)
    },
    getProjectListData() {
      this.$Get(this.$api.queryCollectProjectList, {
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }).then(res => {
        if (res.code == 0) {
          let arr = res.datas.lists;
          this.count = res.datas.count;
          this.projectData = this.projectData.concat(res.datas.lists);
          this.loading = false;
          this.isTrue = false;
        }
      });
    },
    loadMore() {
      this.loading = true;
      let totalPage;
      if (this.isTrue) this.getProjectListData();
      if (this.count) {
        this.pageNo = this.pageNo + 1;
        totalPage = this.count / this.pageSize + 1;
        if (this.pageNo < totalPage) this.getProjectListData();
        else this.loading = false;
      }
    }
  }
};
</script>

<style lang="less">
.collectList {
  height: 100%;
  background: #fff;
  .project_div {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    padding: 15px;
    right: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    .loadingBox {
      text-align: center;
      .mint-spinner-fading-circle {
        display: inline-block;
      }
    }
    .project_div_box {
      margin-bottom: 15px;
      list-style: none;
      li {
        margin-bottom: 2vh;
      }
    }
    .project_div_head {
      // display: flex;
      margin-bottom: 15px;
      .project_div_head_txt {
        display: inline-block;
        padding: 4px 5px;
        background-color: #5160f1;
        margin-right: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 20px;
        font-size: 12px;
        color: #fff;
        line-height: 1;
        font-weight: 100;
      }
    }
  }
}
</style>