<template>
  <div class="starBuy" ref="starBuy">
    <loadMore :loadMoreData="loadMoreData" @refresh="refresh" :alertConfig="alertConfig" @loadMore="loadMore">
      <div v-for="(item,index) in starBuyLists" v-if="item.value.length">
        <div class="listHead" v-if="item.key">
          {{item.key}}
          <span v-if="item.location">({{item.location}})</span>
        </div>
        <div class="table">
          <div class="tableTh" v-if="item.key">
            <div class="unit">{{$t('UnitNo')}}</div>
            <div class="type">{{$t('Type')}}</div>
            <div class="size">
              {{$t('Size')}}
              <span>({{$t('Sqft')}})</span>
            </div>
            <div class="price">{{$t('Price')}}</div>
          </div>
          <div class="tbody">
            <div class="tableTd" v-for="tdSinger in item.value" @click="goToUnitInfo(tdSinger)">
              <div class="unit">{{tdSinger.unitNo}}</div>
              <div class="type">{{tdSinger.type}}</div>
              <div class="size">{{tdSinger.size}}</div>
              <div class="price">
                <p>{{tdSinger.price}}</p>
                <p v-if="tdSinger.psf">{{$t('PSF')}}{{tdSinger.psf}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </loadMore>
  </div>
</template>

<script>
import loadMore from "@/components/loadMore";
import { AlertModule } from "vux";
import { Toast } from "mint-ui";
export default {
  name: "starBuy",
  components: {
    loadMore
  },
  data() {
    return {
      loadMoreData: {
        allLoaded: true, //是否不允许上拉加载
        isRefresh: false, //是否刷新完成
        isLoadMore: false //是否加载完成
      },
      alertConfig: {},
      pageSize: 20,
      page: 1,
      starBuyLists: []
    };
  },
  created() {
    this.$removeScrollNum("starBuy");
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.starBuy, "starBuy");
    this.getStarBuyData(true, "", 1);
  },
  activated() {
    this.$SetScroll(this.$refs.starBuy, "starBuy");
  },
  methods: {
    refresh() {
      this.getStarBuyData(false, 1, 1);
    },
    loadMore() {
      this.page++;
      this.getStarBuyData(false, 2, this.page);
    },
    goToUnitInfo(item) {
      if (item.access == "yes") {
        this.$router.push({
          path: "/projectDetails/unitInfo",
          query: {
            unitId: item.unitId,
            projectId: item.projectId,
            unitName: item.unitNo,
            projectName: item.projectName
          }
        });
      } else {
        AlertModule.show({
          title: "ERROR",
          content: "do not have permission",
          buttonText: "OK"
        });
      }
    },
    getStarBuyData(isLoading, type, page) {
      this.$Get(
        this.$api.queryStarBuyList,
        {
          pageNo: page,
          pageSize: this.pageSize
        },
        isLoading
      )
        .then(res => {
          if (type == 1) {
            this.loadMoreData.isRefresh = true;
          } else if (type == 2) {
            this.loadMoreData.isLoadMore = true;
          }
          if (res.code == 0) {
            if (type == 2) {
              //上拉加载更多
              let arr = res.datas.lists.map(item => {
                for (let i = 0; i < this.starBuyLists.length; i++) {
                  if (item.key === this.starBuyLists[i].key) {
                    item.key = "";
                  }
                }
                return item;
              });
              this.starBuyLists = this.starBuyLists.concat(arr);
            } else {
              //下拉刷新或者页面初始化
              this.page = 1;
              this.starBuyLists = res.datas.lists;
              if (!this.starBuyLists.length) {
                this.alertConfig = {
                  isShow: true,
                  img: "/img/alert/noContent.png",
                  err: this.$t("ComingSoon"),
                  tips: this.$t("noContent")
                };
              }
            }
            let totalPage = Math.ceil(res.datas.count / this.pageSize); //总页数
            if (this.page < totalPage) {
              this.loadMoreData.allLoaded = false; //允许上拉加载更多
            } else if (this.page == totalPage || this.page > totalPage) {
              this.loadMoreData.allLoaded = true; //不允许上拉加载更多
            }
          } else {
            if (isLoading) {
              this.alertConfig = {
                isShow: true,
                img: "/img/alert/serverErr.png",
                err: this.$t("serverErr"),
                tips: this.$t("serverTips"),
                btnText: this.$t("tryAgain")
              };
            } else {
              Toast({
                message: res.msg || "Fail",
                duration: 1000
              });
            }
            if (type == 2) {
              this.page--;
            }
          }
        })
        .catch(err => {
          if (type == 1) {
            this.loadMoreData.isRefresh = true;
          } else if (type == 2) {
            this.page--;
            this.loadMoreData.isLoadMore = true;
          } else {
            this.alertConfig = {
              isShow: true,
              img: "/img/alert/serverErr.png",
              err: this.$t("serverErr"),
              tips: this.$t("serverTips"),
              btnText: this.$t("tryAgain")
            };
          }
        });
    }
  }
};
</script>

<style lang="less">
.starBuy {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 1.6vh;
  .listHead {
    padding: 0.5vh 15px;
    background: -webkit-linear-gradient(
      left,
      #5979ef,
      #4d62ef,
      #4149ef
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
      left,
      #5979ef,
      #4d62ef,
      #4149ef
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
      left,
      #5979ef,
      #4d62ef,
      #4149ef
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(left, #5979ef, #4d62ef, #4149ef);
    /* 标准的语法 */
    color: #fff;
    font-weight: 600;
  }
  .table {
    text-align: center;
    .unit {
      width: 15%;
      text-align: left;
    }
    .type {
      width: 30%;
    }
    .size {
      width: 20%;
      span {
        font-size: 1.2vh;
        font-weight: 200;
      }
    }
    .price {
      width: 35%;
    }
    .tableTh {
      display: flex;
      padding: 1vh 15px;
      font-weight: 600;
    }
    .tbody {
      .tableTd {
        padding: 1.5vh 15px;
        border-top: 1px solid #f3f5f6;
        display: flex;
        align-items: center;
        div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.price {
            position: relative;
            &::after {
              display: block;
              content: "";
              height: 2.5vh;
              width: 2.5vh;
              right: 0;
              top: 50%;
              position: absolute;
              background: url("../../../assets/images/icon/right.png") no-repeat;
              background-size: 100% 100%;
              margin-top: -1.25vh;
            }
            p {
              padding: 0 2vh 0 1vh;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:first-child {
                font-weight: 600;
              }
              &:last-child {
                color: #6c7b8a;
                font-size: 1.4vh;
              }
            }
          }
        }
      }
    }
  }
}
</style>