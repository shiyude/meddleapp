<template>
  <div class="FloorPlan" ref="floorPlan">
    <div class="FloorPlan_box" v-if="floorPlanList&&floorPlanList.length">
      <ul v-infinite-scroll="loadMore" infinite-scroll-distance="30">
        <li v-for="(v,k) in floorPlanList">
          <group class="FloorPlan_box_list" :title="v.floorPlanType" v-if="v.list.length">
            <cell class="FloorPlan_box_list_row"  is-link @click.native="goToUnit(item)" :value="'total units: '+item.available+'/'+item.total" v-for="(item,index) in v.list" :key="index">
              <img slot="icon" width="20" style="display:block" src="../../../../assets/images/icon/floorPlanIcon.png"  @click.stop="examineImg(item.img)">
              <span slot="title" @click.stop="examineImg(item.img)">{{item.floorPlanName}}</span>
              <span slot="after-title" class="arStyle" v-if="item.is2d" @click.stop="examineImg(item.img)">2D</span>
              <span slot="after-title" class="arStyle" @click.stop="goTo3d(item.floorPlanId)" v-if="item.is3d">3D</span>
            </cell>
          </group>
        </li>
      </ul>
      <p class="loadingBox" v-if="loading">
        <mt-spinner type="fading-circle"></mt-spinner>
      </p>
      <div v-transfer-dom>
        <previewer ref="previewer" :list="list"></previewer>
      </div>
    </div>
    <alert v-if="floorPlanList&&!floorPlanList.length" :alertConfig="alertConfig"></alert>
  </div>
</template>

<script>
import { Previewer, TransferDom } from "vux";
import alert from "@/components/alert.vue";
import toModule from "../../../../util/unitDock/module3d";
export default {
  nama: "FloorPlan",
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    alert
  },
  data() {
    return {
      detailsParam: "",
      pageSize: 15,
      pageNo: 1,
      loading: false,
      count: 0,
      isLoadMore: false,
      hostUrl: window.localStorage.getItem("imgUlr") || "",
      list: [
        {
          src: ""
        }
      ],
      options: {
        getThumbBoundsFn: function(index) {
          let thumbnail = document.querySelectorAll(".FloorPlan_box_list_row")[
            index
          ];
          console.log(thumbnail);
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      },
      floorPlanList: [],
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  created() {
    this.$removeScrollNum("floorPlan");
    this.detailsParam = this.$route.query;
  },
  activated() {
    this.$SetScroll(this.$refs.floorPlan, "floorPlan");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.floorPlan, "floorPlan");
    this.getFloorPlanData(this.$route.query.id, true);
  },
  methods: {
    goToUnit(item) {
      this.$router.push({
        path: "/floorPlanOfUnits",
        query: {
          projectId: this.detailsParam.id,
          floorPlanName: item.floorPlanName,
          unitName: this.detailsParam.name
        }
      });
    },
    goTo3d(id) {
      toModule(id);
    },
    loadMore() {
      if (this.isLoadMore) {
        let totalPage = Math.ceil(this.count / this.pageSize);
        if (this.pageNo == totalPage || this.count == 0) {
          this.isLoadMore = false;
          this.loading = false;
        } else {
          this.pageNo++;
          this.getFloorPlanData(this.$route.query.id);
        }
      }
    },
    examineImg(img) {
      if (img) {
        this.list[0].src = this.hostUrl + img;
        this.$refs.previewer.show(0);
      } else {
        console.log("没有图片");
      }
    },
    getFloorPlanData(id, isLoading = false) {
      this.loading = true;
      this.$Get(
        this.$api.queryFloorPlanList,
        {
          projectId: id,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        },
        isLoading
      ).then(res => {
        if (res.code == 0) {
          let arr = res.datas.lists.map(item => {
            for (let i = 0; i < this.floorPlanList.length; i++) {
              if (item.floorPlanType === this.floorPlanList[i].floorPlanType) {
                item.floorPlanType = "";
              }
            }
            return item;
          });
          this.floorPlanList = this.floorPlanList.concat(arr);
          this.count = res.datas.count;
          this.isLoadMore = true;
          if (this.floorPlanList.length < this.pageSize) this.loading = false;
        } else {
          console.log("获取floorPlan失败");
        }
      });
    }
  }
};
</script>

<style lang="less">
.FloorPlan {
  // height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  border-top: 1px solid #ddd;
  .FloorPlan_box {
    .FloorPlan_box_list {
      .weui-cells {
        margin-top: 0;
      }
      .weui-cells:before,
      .weui-cells:after {
        display: none;
      }
      .FloorPlan_box_list_row {
        .weui-cell__ft {
          font-size: 1.5vh;
          padding-right: 3vh;
        }
        .vux-cell-bd {
          font-size: 2vh;
          overflow: hidden;
          p {
            display: flex;
            padding: 0 2vh;
            .vux-label {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              flex: 1;
            }
            .arStyle {
              flex: 0 0 4vh;
              margin-left: 2vh;
            }
          }
        }
      }
      .weui-cell {
        padding: 2vh 2vh;
      }
      .weui-cell:before {
        left: 0;
      }
      .weui-cells__title {
        margin: 0;
        padding: 0.8vh 2vh;
        background-color: #5160f1;
        color: #fff;
        font-size: 1.8vh;
      }
    }
  }
  .loadingBox {
    text-align: center;
    .mint-spinner-fading-circle {
      display: inline-block;
    }
  }
  .arStyle {
    // font-size: 1.8vh;
    border: 1px solid #5160f1;
    border-radius: 0.3vh;
    color: #5160f1;
    font-weight: 600;
    text-align: center;
    height: 2.2vh;
    line-height: 2.2vh;
  }
  .weui-cells:after {
    display: block !important;
  }
}
</style>