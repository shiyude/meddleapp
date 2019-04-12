<template>
  <div class="seekPopup">
    <popup class="rt_popup_view" width="65%" v-model="isRightShow" position="right">
      <div class="rt_popup_view_box">
        <!-- 盒子开始 -->
        <div class="selector_div">
          <!-- 顶部文字 -->
          <div class="selector_div_top">
            <flexbox :gutter="0">
              <flexbox-item :span="8">
                <div>{{$t('FILTER')}}</div>
              </flexbox-item>
              <flexbox-item :span="4">
                <div class="selector_div_top_rt">
                  <x-icon @click="rtClose" class="rt_close_btn" type="ios-close-empty" size="20"></x-icon>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
          <!-- 搜索 -->
          <div class="search_conter">
            <mt-search cancel-text :placeholder="$t('KeyWord')" v-model="searchVal"></mt-search>
          </div>
          <div v-if="!isIos">
            <template v-if="type == 0">
              <div class="caseBox">
                <optionList :placeholder="$t('Country')" :options="countryList" v-model="country"></optionList>
              </div>
              <div class="caseBox">
                <optionList
                  :placeholder="$t('AllDistricts')"
                  :options="allDistrictsList"
                  v-model="allDistricts"
                ></optionList>
              </div>
            </template>
            <template v-if="type == 1">
              <div class="caseBox">
                <optionList :placeholder="$t('block')" :options="blockList" v-model="block"></optionList>
              </div>
              <div class="caseBox">
                <optionList
                  :placeholder="$t('unitType')"
                  :options="unitTypeList"
                  v-model="unitType"
                ></optionList>
              </div>
              <div class="caseBox">
                <optionList
                  :placeholder="$t('floorPlan')"
                  :options="floorPlanList"
                  v-model="floorPlan"
                ></optionList>
              </div>
              <div class="caseBox">
                <optionList :placeholder="$t('status')" :options="statusList" v-model="status"></optionList>
              </div>
            </template>
            <template v-if="type == 2">
              <div class="caseBox">
                <optionList
                  :placeholder="$t('projectType')"
                  :options="projectTypeLsit"
                  v-model="projectType"
                ></optionList>
              </div>
            </template>
          </div>
          <group v-if="isIos">
            <template v-if="type == 0">
              <selector :placeholder="$t('Country')"  v-model="country" :options="countryList"></selector>
              <selector
                :placeholder="$t('AllDistricts')"
                v-model="allDistricts"
                :options="allDistrictsList"
              ></selector>
            </template>
            <template v-if="type == 1">
              <selector :placeholder="$t('block')" v-model="block" :options="blockList"></selector>
              <selector :placeholder="$t('unitType')" v-model="unitType" :options="unitTypeList"></selector>
              <selector :placeholder="$t('floorPlan')" v-model="floorPlan" :options="floorPlanList"></selector>
              <selector :placeholder="$t('status')" v-model="status" :options="statusList"></selector>
            </template>
            <template v-if="type == 2">
              <selector
                :placeholder="$t('projectType')"
                v-model="projectType"
                :options="projectTypeLsit"
              ></selector>
            </template>
          </group>
          <!-- 滑块1 -->
          <div class="range_div">
            <div class="new-filter">
              <flexbox class="new-filter-text" :gutter="0">
                <flexbox-item :span="6">
                  <div>{{$t('PRICE')}}</div>
                </flexbox-item>
                <flexbox-item class="new-filter-text-rt" :span="6">
                  <div>${{PriceMin}} - ${{PriceMax}}</div>
                </flexbox-item>
              </flexbox>
              <span class="multi-range">
                <input type="range" min="0" max="10000" v-model="minPrice" id="lower">
                <input type="range" min="0" max="10000" v-model="maxPrice" id="upper">
              </span>
            </div>
          </div>
          <!-- 滑块2 -->
          <div class="range_div">
            <div class="new-filter">
              <flexbox class="new-filter-text" :gutter="0">
                <flexbox-item :span="6">
                  <div>{{$t('sizesqft')}}</div>
                </flexbox-item>
                <flexbox-item class="new-filter-text-rt" :span="6">
                  <div>{{SizeMin}} - {{SizeMax}}</div>
                </flexbox-item>
              </flexbox>
              <span class="multi-range">
                <input type="range" min="300" max="10000" v-model="minSize" id="lower2">
                <input type="range" min="300" max="10000" v-model="maxSize" id="upper2">
              </span>
            </div>
          </div>
          <div class="popup_btns">
            <flexbox class="popup_btns_box" :gutter="0">
              <!-- <flexbox-item :span="6">
                <div>
                  <mt-button type="primary">{{$t('RESET')}}</mt-button>
                </div>
              </flexbox-item> -->
              <flexbox-item class="new-filter-text-rt" :span="12">
                <div>
                  <mt-button @click="screenBtn" type="danger">{{$t('SEARCH')}}</mt-button>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import areaData from "@/assets/json/area.json";
import { PopupPicker } from 'vux'
import optionList from "./optionList.vue";
export default {
  name: "seekPopup",
  components: {
    PopupPicker,
    optionList
  },
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isRightShow: false,
      searchVal: "",
      country: '',
      countryList: areaData.country,
      allDistricts: "",
      allDistrictsList: areaData.district[0].province,
      minPrice: 0,
      maxPrice: 2000,
      minSize: 300,
      maxSize: 6000,
      block: "",
      unitType: "",
      floorPlan: "",
      status: "",
      statusList: ['AVAILABLE', 'SOLD', 'NOT RELEASED'],
      blockList: [],
      unitTypeList: [],
      floorPlanList: [],
      projectTypeLsit: [
        'RESIDENTIAL',
        'COMMERCIAL',
        'INTERNATIONAL'
      ],
      isIos: undefined,
      projectType: ''
    };
  },
  computed: {
    PriceMax: function () {
      let num =
        Number(this.minPrice) > Number(this.maxPrice)
          ? this.minPrice
          : this.maxPrice;
      return this.priceComputed(num);
    },
    PriceMin: function () {
      let num =
        Number(this.minPrice) > Number(this.maxPrice)
          ? this.maxPrice
          : this.minPrice;
      return this.priceComputed(num);
    },
    SizeMax: function () {
      return Number(this.minSize) > Number(this.maxSize)
        ? this.minSize
        : this.maxSize;
    },
    SizeMin: function () {
      return Number(this.minSize) > Number(this.maxSize)
        ? this.maxSize
        : this.minSize;
    }
  },
  mounted() {
    if (this.type == 1) {
      let id = this.$route.query.id;
      this.getFilterData("building", id);
      this.getFilterData("type", id);
      this.getFilterData("floorPlan", id);
    }
    this.isPhone()
  },
  methods: {
    isPhone() {
      let u = navigator.userAgent, app = navigator.appVersion;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; 
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
      if (isAndroid) {
        this.isIos = false
        // console.log('安卓', isAndroid)
      }
      if (isIOS) {
        this.isIos = true
        // console.log('IOS', isIOS)
      }
      if (!isAndroid && !isIOS) {
        this.isIos = false
      }
    },
    getFilterData(type, id) {
      this.$Get(this.$api.getFilterList, {
        projectId: id,
        filterType: type,
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        if (res.code == 0) {
          if (type == "building") {
            this.blockList = res.datas.map(item => {
              return item.key
            })
          } else if (type == "type") {
            this.unitTypeList = res.datas.map(item => {
              return item.key
            })
          } else {
            this.floorPlanList = res.datas.map(item => {
              return item.key
            })
          }
        }
      });
    },
    rtClose() {
      this.isRightShow = false;
    },
    openSeek() {
      this.isRightShow = true;
    },
    priceComputed(num) {
      let newNum;
      if (num > 0 ||num == 0 && num < 1000) {
        newNum = num + "K";
      } else if (num > 1000) {
        newNum = num / 1000 + "M";
      }
      return newNum;
    },
    screenBtn() {
      let minPrice = parseInt(this.minPrice),
        maxPrice = parseInt(this.maxPrice),
        minSize = parseInt(this.minSize),
        maxSize = parseInt(this.maxSize);
      let data = {};
      if (this.type == 1) {
        data = {
          unitName: this.searchVal,
          building: this.block,
          type: this.unitType,
          floorPlan: this.floorPlan,
          purchaseStatus: this.status,
          priceMin: (minPrice < maxPrice ? minPrice : maxPrice) * 1000,
          priceMax: (minPrice > maxPrice ? minPrice : maxPrice) * 1000,
          areaMin: minSize < maxSize ? minSize : maxSize,
          areaMax: minSize > maxSize ? minSize : maxSize
        };
        this.searchVal = "";
        this.block = "";
        this.unitType = "";
        this.floorPlan = "";
        this.status = "";
        this.isRightShow = false;
        this.$emit("seekPopupFn", data);
      } else if (this.type == 0) {
        data = {
          projectName: this.searchVal,
          country: this.country,
          location: this.allDistricts,
          minPrice: (minPrice < maxPrice ? minPrice : maxPrice) * 1000,
          maxPrice: (minPrice > maxPrice ? minPrice : maxPrice) * 1000,
          minArea: minSize < maxSize ? minSize : maxSize,
          maxArea: minSize > maxSize ? minSize : maxSize
        };
        this.searchVal = "";
        this.country = "";
        this.allDistricts = "";
        this.$emit("seekPopupFn", data);
      } else if (this.type == 2) {
        data = {
          projectName: this.searchVal,
          projectType: this.projectType,
          minPrice: (minPrice < maxPrice ? minPrice : maxPrice) * 1000,
          maxPrice: (minPrice > maxPrice ? minPrice : maxPrice) * 1000,
          minArea: minSize < maxSize ? minSize : maxSize,
          maxArea: minSize > maxSize ? minSize : maxSize
        };
        this.searchVal = "";
        this.projectType = "";
        this.$emit("seekPopupFn", data);
        // console.log('第二个')
      }
    }
  }
};
</script>

<style lang="less">
.seekPopup {
  .caseBox {
    padding: 10px 20px;
  }
  .rt_popup_view {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background-color: #fff;
    .selector_div {
      .weui-cell:before,
      .weui-cells:before,
      .weui-cells:after {
        display: none;
      }
      .popup_btns {
        position: absolute;
        width: 100%;
        bottom: 5vh;
        .popup_btns_box {
          text-align: center;
          .mint-button {
            height: 35px;
            font-size: 14px;
            width: 120px;
          }
          .mint-button--primary {
            background-color: #676572;
          }
          .mint-button--danger {
            background-color: #5370e5;
          }
        }
      }
      .range_div {
        padding: 0 20px;
        // margin-top: 20px;
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        .new-filter-text {
          margin-bottom: 10px;
          font-size: 14px;
          color: #333;
          .new-filter-text-rt {
            text-align: right;
            color: #666;
            font-size: 12px;
          }
        }
        input[type="range"] {
          box-sizing: border-box;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          margin: 0;
          padding: 0 2px;
          overflow: hidden;
          border: 0;
          border-radius: 1px;
          outline: none;
          background: none;
          pointer-events: none;
        }
        input[type="range"]:active,
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          height: 20px;
          width: 20px;
          border-radius: 20px;
          border: 2px solid #49ccfa;
          background-color: #fff;
          position: relative;
          margin: 5px 0;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
          pointer-events: all;
          box-shadow: 0 1px 4px 0.5px rgba(0, 0, 0, 0.25);
        }
        // input[type="range"]::-webkit-slider-thumb::before {
        //   content: " ";
        //   display: block;
        //   position: absolute;
        //   top: 13px;
        //   left: 100%;
        //   height: 2px;
        // }
        .multi-range {
          position: relative;
          height: 40px;
          display: inline-block;
          width: 100%;
        }
        .multi-range::before {
          content: " ";
          position: absolute;
          width: 100%;
          background: -moz-linear-gradient(
            left,
            #49ccfa 0%,
            #5160f1 100%
          ) !important;
          background: -webkit-linear-gradient(
            left,
            #49ccfa 0%,
            #5160f1 100%
          ) !important;
          background: -o-linear-gradient(
            left,
            #49ccfa 0%,
            #5160f1 100%
          ) !important;
          background: -ms-linear-gradient(
            left,
            #49ccfa 0%,
            #5160f1 100%
          ) !important;
          background: linear-gradient(
            to right,
            #49ccfa 0%,
            #5160f1 100%
          ) !important;
          top: 50%;
          margin-top: -7px;
          height: 4px;
        }
        .multi-range input[type="range"] {
          position: absolute;
        }
        // .multi-range
        //   input[type="range"]:nth-child(1)::-webkit-slider-thumb::before {
        //   background: none;
        // }
        // .multi-range input[type="range"]:nth-child(2) {
        //   background: none;
        // }
        // .multi-range
        //   input[type="range"]:nth-child(2)::-webkit-slider-thumb::before {
        //   background-color: none;
        // }
      }
      .selector_div_top {
        margin-top: 6vh;
        height: 6vh;
        padding: 0 20px;
        .selector_div_top_rt {
          text-align: right;
        }
        .rt_close_btn {
          background-color: #ddd;
          border-radius: 5px;
          color: #fff;
          width: 25px;
          height: 25px;
        }
      }
      .search_conter {
        padding: 20px;
        padding-bottom: 0;
        margin-bottom: 10px;
        .mint-search {
          height: 100%;
          box-shadow: 0 2px 10px #ddd;
          border-radius: 5px;
          .mint-searchbar {
            padding: 0;
            background-color: #fff;
            .mint-searchbar-inner {
              padding: 6px 10px;
            }
            .mint-searchbar-core {
              padding-left: 10px;
            }
          }
        }
      }
      .weui-cells {
        margin: 0;
        padding: 20px;
        padding-top: 0;
      }
      .vux-selector {
        border-radius: 5px;
        margin-top: 10px;
        box-shadow: 0px 2px 10px #ddd;
        color: #666 !important;
      }
      .weui-cell_select {
        .weui-select {
          color: #666 !important;
          font-size: 14px;
        }
        .weui-cell__bd:after {
          transform: none;
          width: 0;
          height: 0;
          border-style: none !important;
          border-left: 6px solid transparent !important;
          border-right: 6px solid transparent !important;
          border-top: 12px solid #999 !important;
        }
      }
    }
  }
  .weui-select {
    height: 40px;
    line-height: 40px;
  }
}
</style>
