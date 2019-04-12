<template>
  <div class="buyerBox">
    <div v-transfer-dom>
      <popup class="BuyerPopup" v-model="show" height="70%" @on-hide="endInfoFn(1)">
        <div class="BuyerPopupBox">
          <mt-search v-model="searchVal" cancel-text="cancel" placeholder="search"></mt-search>
          <ul class="BuyerPopupBoxList">
            <li @click="endInfoFn(item)" v-for="(item,index) in BuyerList" :key="index">
              <flexbox :gutter="0">
                <flexbox-item>
                  <div class="flex-div">{{item.ballotNo}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="flex-div">{{item.buyerName}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="flex-div">{{item.countryCallingCode}} - {{item.buyerMobile}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="flex-div">{{item.nationality}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="flex-div">{{item.nricPassport}}</div>
                </flexbox-item>
              </flexbox>
            </li>
            <li class="noList" v-if="BuyerList.length === 0">{{$t('NoSearchResults')}}</li>
          </ul>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import { Popup, XSwitch, TransferDomDirective as TransferDom } from 'vux'
export default {
  name: 'buyerBox',
  directives: {
    TransferDom
  },
  components: {
    Popup,
    XSwitch
  },
  props: {
    istrue: Boolean,
    projectId: String
  },
  data() {
    return {
      show: false,
      id: this.projectId,
      searchVal: '',
      BuyerList: []
    }
  },
  watch: {
    istrue(val) {
      this.show = val
    },
    projectId(val) {
      this.id = val
    },
    searchVal(val) {
      if(val !== '') {
        this.selectCustomer(this.id, val)
      } else {
        this.BuyerList = []
      }
    }
  },
  mounted() {
  },
  methods: {
    endInfoFn(item) {
      this.$emit("getBuyerInfoFn", item)
    },
    selectCustomer(id, search) {
      this.$Get(this.$api.selectCustomer, { projectId: id, content: search }).then(res => {
        if (res.code == 0) {
          this.BuyerList = res.datas
          // console.log(res)
        }
      })
    }
  }
}
</script>
<style lang="less">
.BuyerPopup {
  .BuyerPopupBox {
    height: 100%;
    position: relative;
    overflow: hidden;
    .mint-search {
      height: 52px;
      .mint-search-list {
        display: none;
      }
    }
    .BuyerPopupBoxList {
      position: absolute;
      top: 52px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: scroll;
      .noList{
        text-align: center;
        margin-top: 50px;
      }
      .vux-flex-row {
        border-bottom: 1px solid #ddd;
        padding: 8px 0;
      }
      .vux-flexbox .vux-flexbox-item {
        width: 20%;
        padding: 0 2px;
        .flex-div {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
