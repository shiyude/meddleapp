<template>
  <div class="seekUnitList">
    <x-header
      :eft-options.preventGoBack="true"
      class="nav_head"
      :left-options="{backText: ''}"
    >{{unitSeekInfo.unitName}}</x-header>
    <div class="project_div_head" v-if="seekData">
      <div v-for="(item,index) in seekData" :key="index" class="project_div_head_txt">{{item}}</div>
    </div>
    <div class="seekUnitList_content" ref="seekUnitListDom" :style="`top:${scrollTop}px`">
      <ul class="project_div_box" v-infinite-scroll="loadMore" infinite-scroll-distance="30">
        <li v-for="(v,index) in seekUnitList">
          <div class="Units_box_bom_list" v-if="v.value.length">
            <group-title v-if="v.key">{{v.key}}</group-title>
            <flexbox
              class="units_row"
              v-for="(item, i) in  v.value"
              :key="i"
              @click.native="GoTotInfo(item)"
            >
              <flexbox-item>
                <div>{{item.unitName}}</div>
              </flexbox-item>
              <flexbox-item>
                <div>{{v.areaLabel}}:{{item.area}}</div>
              </flexbox-item>
              <flexbox-item>
                <div class="units_row_3">
                  <p>{{$t('type')}}:{{item.type}}</p>
                </div>
              </flexbox-item>
              <flexbox-item>
                <div class="units_row_4">
                  <span class="SOLD" v-if="item.purchaseStatus === 'SOLD'"></span>
                  <span class="AVAILABLE" v-if="item.purchaseStatus === 'AVAILABLE'"></span>
                  <span class="NOTRELEASED" v-if="item.purchaseStatus === 'NOT RELEASED'"></span>
                  <span class="PENDINGRESERVED" v-if="item.purchaseStatus === 'PENDING RESERVED'"></span>
                  <span class="RESERVED" v-if="item.purchaseStatus === 'RESERVED'"></span>
                  <span class="SPASIGN" v-if="item.purchaseStatus === 'SPA SIGN'"></span>
                  <span class="SPASTAMP" v-if="item.purchaseStatus === 'SPA STAMP'"></span>
                  <span class="REQUESTCANCEL" v-if="item.purchaseStatus === 'REQUEST CANCEL'"></span>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </li>
      </ul>
      <p class="loadingBox" v-if="loading">
        <mt-spinner type="fading-circle"></mt-spinner>
      </p>
    </div>
    <alert v-if="seekUnitList.length === 0" :alertConfig="alertConfig"></alert>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
import { AlertModule } from 'vux'
export default {
  name: 'seekUnitList',
  components: {
    alert
  },
  data() {
    return {
      alertConfig: {
        isShow: true,
        img: "/img/alert/noSeek.png",
        err: this.$t("noFind"),
        tips: this.$t("noFindText")
      },
      unitSeekInfo: {},
      seekData: [],
      seekUnitList: [],
      loading: false,
      isLoadMore: false,
      pageNo: 1,
      pageSize: 20,
      count: 30,
      scrollTop: 126
    }
  },
  created() {
    this.$removeScrollNum("seekUnitListDom");
  },
  activated() {
    this.$SetScroll(this.$refs.seekUnitListDom, "seekUnitListDom");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.seekUnitListDom, "seekUnitListDom");
    this.unitSeekInfo = this.$route.query
    this.countSeekData(this.unitSeekInfo.data)
    this.getSeekUnitList(true)
  },
  methods: {
    loadMore() {
      if (this.isLoadMore) {
        let totalPage = Math.ceil(this.count / this.pageSize);
        console.log(totalPage, this.count)
        if (this.pageNo == totalPage || this.count == 0) {
          this.isLoadMore = false;
          this.loading = false
        } else {
          this.pageNo++;
          this.getSeekUnitList();
        }
      }
    },
    countSeekData(data) {
      this.seekData = [];
      if (data.unitName) this.seekData.push(data.unitName);
      if (data.building) this.seekData.push(data.building);
      if (data.type) this.seekData.push(data.type);
      if (data.floorPlan) this.seekData.push(data.floorPlan);
      if (data.purchaseStatus) this.seekData.push(data.purchaseStatus);
      if (data.priceMin && data.priceMax) {
        let min =
          data.priceMin / 1000 > 1000
            ? data.priceMin / 1000 / 1000 + "M"
            : data.priceMin / 1000 + "K",
          max =
            data.priceMax / 1000 > 1000
              ? data.priceMax / 1000 / 1000 + "M"
              : data.priceMax / 1000 + "K";
        this.seekData.push(`${min}-${max}`);
      }
      if (data.areaMin && data.areaMax)
        this.seekData.push(`${data.areaMin}-${data.areaMax}SQFT`);
      if (this.seekData.length > 4) this.scrollTop = 152

    },
    getSeekUnitList(isLoading = false) {
      this.loading = true
      let paramsData = this.unitSeekInfo.data
      let pageInfo = {
        projectId: this.unitSeekInfo.projectId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.$Get(this.$api.queryUnitList, { ...paramsData, ...pageInfo }, isLoading).then(res => {
        if (res.code == 0) {
          this.seekUnitList = this.seekUnitList.concat(res.datas.lists);
          this.count = res.datas.count;
          this.isLoadMore = true;
          if (this.seekUnitList.length < this.pageSize) this.loading = false
        } else {
          console.log("获取unit失败");
        }
      })
    },
    GoTotInfo(item) {
      if (item.access == 'yes') {
        this.$router.push({
          path: "/projectDetails/unitInfo",
          query: {
            unitId: item.unitId,
            projectId: item.projectId,
            projectName: this.unitSeekInfo.unitName
          }
        });
      } else {
        AlertModule.show({
          title: 'ERROR',
          content: 'do not have permission',
          buttonText: 'OK'
        })
      }
    },
  }
}
</script>

<style lang="less">
.seekUnitList {
  height: 100%;
  .seekUnitList_content {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    border-top: 1px solid #ddd;
    .Units_box_bom_list {
      .weui-cells__title {
        background-color: #5160f1;
        margin: 0;
        padding: 1vh 2vh;
        color: #fff;
      }
      .units_row {
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding: 1vh 0;
        .vux-flexbox-item {
          width: 25%;
          margin-left: 0 !important;
          * {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666;
            font-size: 1.8vh;
            p {
              line-height: 1.2;
              font-size: 1.5vh;
            }
          }
          .units_row_3 {
            font-size: 1.5vh;
            p {
              white-space: normal;
            }
          }
          .units_row_4 {
            position: relative;
            min-height: 4vh;
            span {
              position: absolute;
              width: 3vh;
              height: 3vh;
              top: 50%;
              margin-top: -1.5vh;
              right: 3vh;
            }
            span.SOLD {
              background-color: red;
            }
            span.AVAILABLE {
              background-color: #12d3b8;
            }
            span.NOTRELEASED {
              background-color: #333;
            }
            span.PENDINGRESERVED {
              background-color: #e8e858;
            }
            span.RESERVED {
              background-color: #ff9900;
            }
            span.SPASIGN {
              background-color: #00ccff;
            }
            span.SPASTAMP {
              background-color: #0033ff;
            }
            span.REQUESTCANCEL {
              background-color: #6600cc;
            }
          }
        }
      }
    }
  }
  .project_div_head {
    max-height: 60px;
    padding: 10px;
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
      max-width: 25%;
    }
  }
  .loadingBox {
    text-align: center;
    .mint-spinner-fading-circle {
      display: inline-block;
    }
  }
}
</style>
