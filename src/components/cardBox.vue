<template>
  <div class="cardBox" @click="btnCardDetails(itemData)">
    <div class="cardBox_top">
      <img :src="url+itemData.mainImage">
      <div class="collect_div no_collect" :class="{'collect':itemData.collectId}" @click.stop="collectProject(itemData)" v-if="isFavorite"></div>
    </div>
    <div class="cardBox_bom">
      <flexbox>
        <flexbox-item :span="7/12">
          <div class="cardBox_bom_hint">
            <h3>{{itemData.projectName}}</h3>
            <p>{{itemData.streetAddress}}</p>
            <p>{{itemData.projectType}}</p>
          </div>
        </flexbox-item>
        <flexbox-item :span="2/12">
          <div class="cardBox_bom_num">
            <!-- <h3>{{ parseInt(itemData.allCount) - parseInt(itemData.availableCount) }}</h3> -->
            <h3>{{parseInt(itemData.availableCount) }}</h3>
            <p>{{$t('Avalable')}}</p>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="cardBox_bom_chart">
            <x-circle :percent="ratio" :stroke-width="6" :trail-width="6" :stroke-color="['#36D1DC', '#5B86E5']" trail-color="#ececec">
              <span style="color:#36D1DC">{{ ratio }}%</span>
            </x-circle>
          </div>
        </flexbox-item>
      </flexbox>
      <div class="card_bottom">
        <div class="price_psf">
          <p v-if="itemData.priceFromText">
            <span>{{$t('fr')}}</span> ${{itemData.priceFromText}}</p>
          <p v-if="itemData.psfFromText">
            <span>{{$t('fr')}}</span> ${{itemData.psfFromText}} {{$t('psf')}}</p>
        </div>
        <div class="view_love">
          <div class="love">
            <img class="icon" src="../assets/images/icon/love.png" @click.stop="giveLike(itemData)" />
            <span @click.stop="giveLike(itemData)">{{itemData.likeNum == null?0:itemData.likeNum}}</span>
          </div>
          <div class="view">
            <img class="icon" src="../assets/images/icon/view.png" />
            <span>{{itemData.viewNum == null?0:itemData.viewNum }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XCircle, Search } from "vux";
export default {
  components: {
    XCircle,
    Search
  },
  props: {
    itemData: Object,
    type: {
      type: String,
      default: "home"
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      url: localStorage.getItem("imgUlr")
    };
  },
  computed: {
    ratio: function() {
      let percentageNum;
      if (!this.itemData.allCount && !this.itemData.availableCount) {
        percentageNum = 0;
      } else {
        let aNum = parseInt(this.itemData.availableCount),
          bNum = parseInt(this.itemData.allCount);
        percentageNum = aNum / bNum * 100;
      }
      return parseInt(percentageNum);
    }
  },
  methods: {
    giveLike(data) {
      if (localStorage.getItem("userInfo")) {
        if (data.isLike == 0) {
          //未点赞
          this.$Get(this.$api.insertProjectLike, {
            projectId: data.projectId
          })
            .then(res => {
              if (res.code == 0) {
                this.$vux.toast.text(this.$t("Successfully_like"), "middle");
                data.likeNum == null && (data.likeNum = 0);
                data.likeNum += 1;
                data.isLike = 1;
              } else {
                this.$vux.toast.text(this.$t("failure_like"), "middle");
              }
            })
            .catch(err => {
              this.$vux.toast.text(this.$t("failure_like"), "middle");
            });
        } else {
          this.$vux.toast.text(this.$t("Liked"), "middle");
        }
      } else {
        this.$vux.toast.text(this.$t("not_login"), "middle");
      }
    },
    btnCardDetails(info) {
      this.$router.push({
        path: "/projectDetails",
        query: {
          name: info.projectName,
          id: info.projectId,
          type: this.type
        }
      });
      info.viewNum == null && (info.viewNum = 0);
      info.viewNum += 1;
    },
    collectProject(item) {
      //取消收藏
      this.$Get(this.$api.cancelCollect, {
        collectId: item.collectId
      })
        .then(res => {
          if (res.code == 0) {
            this.itemData.collectId = "";
            this.$emit("cancelCollect", item);
            this.$vux.toast.text(this.$t("CancelCollection"), "middle");
          } else {
            this.$vux.toast.text(this.$t("CancelFailure"), "middle");
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$t("CancelFailure"), "middle");
        });
    }
  }
};
</script>

<style lang="less">
.cardBox {
  .cardBox_top {
    width: 100%;
    // height: 70%;
    padding-bottom: 65%;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
    .collect_div {
      position: absolute;
      bottom: 2vh;
      right: 2vh;
      height: 4vh;
      width: 4vh;
      &.no_collect {
        background: url("../assets/images/icon/noCollect.png") no-repeat;
        background-size: 100% 100%;
      }
      &.collect {
        background: url("../assets/images/icon/collect.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .cardBox_bom {
    margin-top: 7px;
    .card_bottom {
      margin-top: 7px;
      background-color: #f7f7f7;
      border-radius: 4px;
      &::after {
        display: table;
        content: "";
        clear: both;
      }
      & > div {
        float: left;
        height: 30px;
        box-sizing: border-box;
        padding: 0 2%;
        &::after {
          display: table;
          content: "";
          clear: both;
        }
        &.price_psf {
          width: 58%;
          p {
            float: left;
            line-height: 30px;
            width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              color: #6c7b8a;
              font-weight: 600;
            }
          }
        }
        &.view_love {
          width: 42%;
          div {
            float: left;
            line-height: 30px;
            width: 50%;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .icon {
              height: 18px;
              width: 18px;
              vertical-align: sub;
            }
            span {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
    // .price_psf {
    //   margin-top: 7px;
    //   &::after {
    //     display: table;
    //     content: "";
    //     clear: both;
    //   }
    //   p {
    //     float: left;
    //     width: 50%;
    //     overflow: hidden;
    //     white-space: nowrap;
    //     text-overflow: ellipsis;
    //   }
    // }
    // .view_love {
    //   &::after {
    //     display: table;
    //     content: "";
    //     clear: both;
    //   }
    //   & > div {
    //     float: left;
    //     width: 50%;
    //     overflow: hidden;
    //     white-space: nowrap;
    //     text-overflow: ellipsis;
    //     .icon {
    //       height: 18px;
    //       width: 18px;
    //       vertical-align: sub;
    //     }
    //     span {
    //       font-size: 12px;
    //       color: #999;
    //     }
    //   }
    // }
    h3 {
      font-size: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.5;
    }
    p {
      font-size: 12px;
      color: #999;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cardBox_bom_num {
      h3,
      p {
        text-align: center;
      }
    }
    .vux-circle {
      width: 60px;
      height: 60px;
      .vux-circle-content {
        top: 50%;
      }
    }
    @media screen and (min-width: 767px) {
      .vux-circle {
        width: 70px;
        height: 70px;
      }
      h3 {
        font-size: 17px;
        line-height: 2.5;
      }
      p {
        font-size: 14px;
        line-height: 1.5;
      }
    }
    @media screen and (max-width: 320px) {
      .vux-circle {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
