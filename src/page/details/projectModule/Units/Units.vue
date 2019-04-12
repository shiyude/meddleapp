<template>
  <div class="Units">
    <div class="Units_box">
      <div class="Units_box_top">
        <tab
          class="Units_box_top_tab"
          v-model="index01"
          prevent-default
          :scroll-threshold="5"
          bar-active-color="#000"
          :line-width="2"
          @on-before-index-change="switchTabItem"
        >
          <tab-item selected>{{$t('STACK')}}</tab-item>
          <tab-item>{{$t('FLOOR')}}</tab-item>
          <tab-item>{{$t('PRICE')}}</tab-item>
          <tab-item>{{$t('TYPE')}}</tab-item>
          <tab-item>{{$t('PLAN')}}</tab-item>
        </tab>
      </div>
      <div class="Units_box_bom" ref="unitUl">
        <template v-if="unitList&&unitList.length">
          <ul v-infinite-scroll="loadMore" infinite-scroll-distance="30">
            <li v-for="(v,index) in unitList">
              <div class="Units_box_bom_list" v-if="v.value.length">
                <group-title v-if="v.key">{{v.key}}</group-title>
                <flexbox
                  class="units_row"
                  v-for="(item, i) in  v.value"
                  :key="i"
                  @click.native="getInfo(item)"
                >
                  <flexbox-item>
                    <div>{{item.unitName}}</div>
                  </flexbox-item>
                  <flexbox-item>
                    <!-- <div>{{$t('AREA')}}:{{item.area}}</div> -->
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
                      <span
                        class="PENDINGRESERVED"
                        v-if="item.purchaseStatus === 'PENDING RESERVED'"
                      ></span>
                      <span class="RESERVED" v-if="item.purchaseStatus === 'RESERVED'"></span>
                      <span class="SPASIGN" v-if="item.purchaseStatus === 'SPA SIGN'"></span>
                      <span class="SPASTAMP" v-if="item.purchaseStatus === 'SPA STAMP'"></span>
                      <span class="REQUESTCANCEL" v-if="item.purchaseStatus === 'REQUEST CANCEL'"></span>
                      <!--                       
                      <span v-if="item.purchaseStatus == 'SOLD'" class="redSpan"></span>
                      <span v-if="item.purchaseStatus == 'AVAILABLE'" class="greenSpan"></span>
                      <span v-if="item.purchaseStatus == 'NOT RELEASED'" class="greySpan"></span>-->
                    </div>
                  </flexbox-item>
                </flexbox>
              </div>
            </li>
          </ul>
          <p class="loadingBox" v-if="loading">
            <mt-spinner type="fading-circle"></mt-spinner>
          </p>
        </template>
        <alert v-if="unitList.length === 0" :alertConfig="alertConfig"></alert>
      </div>
    </div>
  </div>
</template>

<script>
import { Grid, GridItem, GroupTitle } from "vux";
import { Indicator } from "mint-ui";
import { AlertModule } from 'vux'
import alert from "@/components/alert.vue";
export default {
  nama: "Units",
  components: {
    Grid,
    GridItem,
    GroupTitle,
    alert
  },
  props: {
    detailsInfo: {
      type: Object
    }
  },
  data() {
    return {
      index01: 0,
      projectId: "",
      unitList: [],
      selsctStr: "stack",
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      },
      pageSize: 15,
      pageNo: 1,
      loading: false,
      count: 0,
      isLoadMore: false,
    };
  },
  created() {
    this.$removeScrollNum("unitUl");
  },
  activated() {
    this.$SetScroll(this.$refs.unitUl, "unitUl");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.unitUl, "unitUl");
    this.projectId = this.$route.query.id;
    console.log(this.detailsInfo)
    this.getUnitData(true);
  },
  methods: {
    loadMore() {
      if (this.isLoadMore) {
        let totalPage = Math.ceil(this.count / this.pageSize);
        console.log(totalPage, this.count)
        if (this.pageNo == totalPage || this.count == 0) {
          this.isLoadMore = false;
          this.loading = false;
        } else {
          this.pageNo++;
          this.getUnitData();
        }
      }
    },
    switchTabItem(index) {
      switch (index) {
        case 0:
          this.selsctStr = "stack";
          break;
        case 1:
          this.selsctStr = "floor";
          break;
        case 2:
          this.selsctStr = "price";
          break;
        case 3:
          this.selsctStr = "type";
          break;
        case 4:
          this.selsctStr = "floorPlan";
          break;
      }

      if (this.index01 !== index) {
        this.pageNo = 1;
        this.unitList = [];
        this.getUnitData(true);
      }

      this.index01 = index;
    },
    getInfo(item) {
      if (item.access == 'yes') {
        this.$router.push({
          path: "/projectDetails/unitInfo",
          query: {
            unitId: item.unitId,
            projectId: item.projectId,
            projectName: this.detailsInfo.projectName
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
    getUnitData(isLoading = false) {
      this.loading = true;
      let paramsData = {
        projectId: this.projectId,
        orderType: this.selsctStr,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      this.$Get(this.$api.queryUnitList, paramsData, isLoading).then(res => {
        if (res.code == 0) {
          let arr = res.datas.lists.map(item => {
            for (let i = 0; i < this.unitList.length; i++) {
              if (item.key === this.unitList[i].key) {
                item.key = ''
              }
            }
            return item
          })
          this.unitList = this.unitList.concat(arr);
          this.count = res.datas.count;
          this.isLoadMore = true;
          if (this.unitList.length < this.pageSize) this.loading = false
        } else {
          console.log("获取unit失败");
        }
      });
    }
  }
};
</script>

<style lang="less">
.Units {
  height: 100%;
  .Units_box {
    .Units_box_top {
      height: 40px;
      border-bottom: 1px solid #ddd;
      border-top: 1px solid #ddd;
      .Units_box_top_tab {
        height: 100%;
        .vux-tab-container {
          box-shadow: none;
        }
        .vux-tab-item {
          line-height: 40px;
          color: #999;
          font-size: 1.8vh;
        }
        .vux-tab-item.vux-tab-selected {
          color: #000;
        }
      }
    }
    .Units_box_bom {
      position: absolute;
      top: 40px;
      bottom: 0;
      right: 0;
      left: 0;
      overflow-y: scroll;
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
              // .redSpan {
              //   background-color: #f31c3c;
              // }
              // .greenSpan {
              //   background-color: #69b569;
              // }
              // .blueSpan {
              //   background-color: blue;
              // }
              // .greySpan {
              //   background-color: #565151;
              // }
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
  }
  .unit_seek {
    // display: flex;
    padding: 15px 15px 0 15px;
    .unit_seek_txt {
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
  .loadingBox {
    text-align: center;
    .mint-spinner-fading-circle {
      display: inline-block;
    }
  }
}
</style>