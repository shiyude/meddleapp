<template>
  <div class="site_table">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText: ''}" class="nav_head">{{queryInfo.buildName}}</x-header>
    <div class="table_wrap" ref="tableWrap">
      <div class="table_content" v-if="stack.length&&floor.length">
        <div class="table_div">
          <!-- <div class="table_header">
            <div class="header_left"></div>
            <div class="header_right">{{$t('BLOCK')}}</div>
          </div>-->
          <div class="table_td">
            <div class="td_left">
              <div class="td_left_content thead">{{$t('Storey')}}</div>
              <div class="td_left_content" v-for="(v,k) in floor">{{v.key}}</div>
            </div>
            <div class="td_right" ref="tdRight">
              <div class="td_right_content">
                <div class="td_right_item thead" v-for="(v,k) in stack">
                  <div>{{v}}</div>
                </div>
              </div>
              <div class="td_right_content" v-for="(v,k) in floor">
                <div class="td_right_item" v-for="(item,key) in v.value" @click="goToUnitInfo(item)">
                  <div :class="{'SOLD':(item.purchaseStatus == 'SOLD'),
                  'AVAILABLE':(item.purchaseStatus == 'AVAILABLE'),
                  'PENDINGRESERVED':(item.purchaseStatus == 'PENDING RESERVED'),
                  'RESERVED':(item.purchaseStatus == 'RESERVED'),
                  'SPASIGN':(item.purchaseStatus == 'SPA SIGN'),
                  'SPASTAMP':(item.purchaseStatus == 'SPA STAMP'),
                  'REQUESTCANCEL':(item.purchaseStatus == 'REQUEST CANCEL'),
                  'NOTRELEASED':(item.purchaseStatus == 'NOT RELEASED')
                  }">
                    <div v-if="isHideBtn" class="td_interest">{{item.num}}</div>
                    <template v-if="isShowBtn">
                      <div class="name">{{item.floorPlan}}</div>
                      <div v-if="item.area">{{item.area}}{{$t('sqft')}}</div>
                      <div v-if="!isCobroke">{{item.price}}</div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="table_zindex">
          <div class="zindex_left"></div>
          <div class="zindex_right"></div>
        </div>-->
      </div>
      <template v-if="isShowInterest">
        <template v-if="isShowBtn||isHideBtn">
          <div class="btn_div">
            <div class="show_btn" v-if="isShowBtn" @click="operateInterest(true)">
              <span>{{$t('SHOWINTEREST')}}</span>
            </div>
            <div class="hide_btn" v-if="isHideBtn" @click="operateInterest(false)">
              <span>{{$t('HIDEINTEREST')}}</span>
            </div>
          </div>
        </template>
      </template>

      <alert v-if="!stack.length||!floor.length" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>
<script>
import alert from "@/components/alert.vue";
import { AlertModule } from "vux";
export default {
  name: "siteplanPageTable",
  data() {
    return {
      queryInfo: "",
      stack: [],
      floor: [],
      isShowBtn: false,//是否展示show按钮 与表格数据相关联
      isHideBtn: false,//是否展示hide按钮 与表格数据相关联
      isShowInterest: false,//是否展示按钮
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      },
      isCobroke: false
    };
  },
  components: {
    alert
  },
  created() {
    this.$removeScrollNum("tableWrap");
    if (this.$route.query.type == "coBroke") {
      this.isCobroke = true;
    }
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.tableWrap, "tableWrap");

    this.queryInfo = this.$route.query;
    this.getTableData();
  },
  activated() {
    this.$SetScroll(this.$refs.tableWrap, "tableWrap");
    if (this.$refs.tdRight) {
      this.$SetLeftScroll(this.$refs.tdRight, "tdRight");
    }
  },
  watch: {
    floor(now, old) {
      if (now && this.stack.length) {
        this.$nextTick(() => {
          this.$KeepScrollLeft(this.$refs.tdRight, "tdRight");
        });
      }
    }
  },
  methods: {
    operateInterest(bool) {
      if (bool) {
        this.isHideBtn = true;
        this.isShowBtn = false;
      } else {
        this.isShowBtn = true;
        this.isHideBtn = false;
      }
    },
    goToUnitInfo(item) {
      if (!item.unitId) {
        return;
      }
      if (item.access == "yes") {
        this.$router.push({
          path: "/projectDetails/unitInfo",
          query: {
            unitId: item.unitId,
            projectId: item.projectId,
            projectName: this.queryInfo.projectName
          }
        });
      } else {
        AlertModule.show({
          title: "ERROR",
          content: this.$t('doNotHavePermission'),
          buttonText: "OK"
        });
      }
    },
    getTableData() {
      this.$Get(
        this.$api.uploadFilequeryTableList,
        {
          building: this.queryInfo.buildName,
          projectId: this.queryInfo.projectId
        },
        true
      ).then(res => {
        if (res.code == 0) {
          this.isShowBtn = true;
          if (res.datas.showInterest == "yes") {
            this.isShowInterest = true;
          }
          this.stack = res.datas.stack;
          this.floor = res.datas.floor;
        } else {
        }
      });
    }
  },
  beforeDestroy() {
    if (this.$refs.tdRight) {
      this.$removeScrollNum("tdRight");
    }
  }
};
</script>
<style lang="less">
.site_table {
  height: 100%;
  line-height: 0;
  .table_wrap {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    overflow-y: scroll;
    .table_zindex {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      div {
        float: left;
        height: 100%;
        &.zindex_left {
          width: 28vw;
        }
        &.zindex_right {
          width: 72vw;
          background-color: #f5f3f5;
        }
      }
    }
    .table_content {
      .table_div {
        border-bottom: 1px solid #ebeaed;
        z-index: 2;
        position: relative;
      }
      .table_header,
      .table_td {
        &::after {
          display: table;
          content: "";
          clear: both;
        }
      }
      .table_header {
        .header_left {
          float: left;
          width: 28vw;
          height: 70px;
        }
        .header_right {
          background-color: #f5f3f5;
          float: left;
          width: 72vw;
          height: 70px;
          line-height: 70px;
          text-align: center;
          font-size: 2vh;
        }
      }
      .table_td {
        .td_left,
        .td_right {
          text-align: center;
          float: left;
          &.td_left {
            width: 28vw;
            font-size: 1.6vh;
            .td_left_content {
              width: 100%;
              text-overflow: ellipsis;
              height: 100px;
              line-height: 100px;
              overflow: hidden;
              white-space: nowrap;
              border-top: 1px solid #ebeaed;
              border-bottom: 1px solid #ebeaed;
              &.thead {
                height: 70px;
                line-height: 70px;
              }
            }
          }
          &.td_right {
            background-color: #f5f3f5;
            width: 72vw;
            font-size: 1.6vh;
            overflow: hidden;
            overflow-x: auto;
            .td_right_content {
              display: inline-flex;
              min-width: 72vw;
              border-top: 1px solid #ebeaed;
              border-bottom: 1px solid #ebeaed;
              .td_right_item {
                height: 100px;
                width: 24vw;
                text-align: center;
                box-sizing: border-box;
                border-left: 1px solid #ebeaed;
                border-right: 1px solid #ebeaed;
                line-height: 1.6;
                &.thead {
                  height: 70px;
                  line-height: 70px;
                }
                & > div {
                  height: 100%;
                  width: 100%;
                  padding: 0 0.5vh;
                  box-sizing: border-box;
                  &.AVAILABLE {
                    background-color: #b5e8e0;
                  }
                  &.SOLD {
                    background-color: #f4b0c7;
                  }
                  &.PENDINGRESERVED {
                    background-color: #e8e858;
                  }
                  &.RESERVED {
                    background-color: #ff9900;
                  }
                  &.SPASIGN {
                    background-color: #00ccff;
                  }
                  &.SPASTAMP {
                    background-color: #0033ff;
                  }
                  &.REQUESTCANCEL {
                    background-color: #6600cc;
                  }
                  &.NOTRELEASED {
                    background-color: rgba(102, 102, 102, 1);
                  }
                  div {
                    word-break: break-all;
                    &.td_interest {
                      height: 100%;
                      line-height: 100px;
                    }
                    &.name {
                      font-size: 2.2vh;
                      font-weight: 600;
                    }
                    @media screen and (min-width: 1024px) {
                      &.name {
                        font-size: 1.6vh;
                        font-weight: 600;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      .table_btn {
        margin: 40px 0;
        .btns {
          width: 60%;
          margin: 0 auto;
          text-align: center;
          background-color: #4d4cee;
          border-radius: 50px;
          color: #fff;
          font-size: 1.6vh;
          line-height: 3.2;
          span {
            height: 3vh;
            width: 3vh;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
          }
          &.show {
            span {
              background: url("../../../../../assets/images/icon/eye.png")
                no-repeat;
              background-size: 100% 100%;
            }
          }
          &.hidden {
            span {
              background: url("../../../../../assets/images/icon/noeye.png")
                no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .btn_div {
      margin: 10vw 0;
      & > div {
        width: 60%;
        color: #fff;
        font-size: 14px;
        border-radius: 50px;
        text-align: center;
        margin: 0 auto;
        span {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          &::before {
            display: inline-block;
            content: "";
            width: 22px;
            height: 25px;
            vertical-align: middle;
            margin-right: 10px;
          }
        }
        &.show_btn {
          background-color: #5160f1;
          span::before {
            background: url("../../../../../assets/images/icon/eye.png")
              no-repeat;
            background-size: 100%;
          }
        }
        &.hide_btn {
          background-color: #000;
          span::before {
            background: url("../../../../../assets/images/icon/noeye.png")
              no-repeat;
            background-size: 100%;
          }
        }
      }
    }
  }
}
</style>

