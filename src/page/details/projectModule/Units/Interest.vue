<template>
  <div class="Interest">
    <x-header
      :eft-options.preventGoBack="true"
      :left-options="{backText:''}"
      class="nav_head"
    >{{$t('Interest')}}</x-header>
    <div class="Interest_tab">
      <mt-navbar v-model="selected">
        <mt-tab-item id="NewEdit">{{$t('NewEdit')}}</mt-tab-item>
        <mt-tab-item id="List">{{$t('List')}}</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="Interest_tab_content">
      <mt-tab-container v-model="selected">
        <mt-tab-container-item class="NewEdit" id="NewEdit">
          <group class="General_box" :title="$t('General')" label-width="20vh">
            <x-input v-model="Generalfrom.ballotNo" :title="$t('Ballot')"></x-input>
            <x-input v-model="Generalfrom.chequeNo" :title="$t('ChequeNo')"></x-input>
            <x-input v-model="Generalfrom.bankName" :title="$t('BankName')"></x-input>
            <x-input v-model="Generalfrom.agency" :title="$t('Agency')"></x-input>
            <x-input v-model="Generalfrom.agentName" :title="$t('AgentName')"></x-input>

            <popup-picker
              :title="$t('AreaCode')"
              :data="sellBlockData.countryCallingCodeData"
              v-model="Generalfrom.countryCallingCode"
              :columns="1"
              :show-name="true"
              placeholder
              cancel-text="cancel"
              confirm-text="OK"
            ></popup-picker>
            <x-input v-model="Generalfrom.agentMobile" :title="$t('AgentMobile')"></x-input>

            <x-input v-model="Generalfrom.agentCEA" :title="$t('AgentCEA')"></x-input>
            <x-textarea :max="999" :placeholder="$t('Notes')" v-model="Generalfrom.notes"></x-textarea>
            <!-- <x-textarea title="Notes" v-model="Generalfrom.notes"></x-textarea> -->
          </group>
          <div class="Buyer_list">
            <div class="Buyer_list_head">{{$t('BuyersInformation')}}</div>
            <div v-for="(item, index) in BuyersList" :key="index">
              <group class="Buyer_list_box" label-width="20vh">
                <div class="Buyer_list_box_head">
                  <span class="Buyer_list_box_head_text">{{$t('Buyer')}} -- {{index+1}}</span>
                  <span class="Buyer_list_box_head_btn">
                    <img src="@/assets/images/icon/add_Buyer.png" alt @click="findBuery(index)">
                    <img
                      v-if="index !== 0"
                      src="@/assets/images/icon/delete_Buyer.png"
                      @click="remArrFn('buyer',index)"
                    >
                  </span>
                </div>
                <x-input v-model="item.buyerName" :title="$t('Name')"></x-input>
                <popup-picker
                  :title="$t('AreaCode')"
                  :data="sellBlockData.countryCallingCodeData"
                  v-model="item.countryCallingCode"
                  :columns="1"
                  :show-name="true"
                  placeholder
                  cancel-text="cancel"
                  confirm-text="OK"
                ></popup-picker>
                <x-input v-model="item.buyerMobile" :title="$t('Mobile')"></x-input>
                <x-input v-model="item.buyerEmail" :title="$t('Email')"></x-input>
                <popup-picker
                  :title="$t('Nationality')"
                  :data="sellBlockData.CitizenshipData"
                  v-model="item.nationality"
                  cancel-text="cancel"
                  confirm-text="OK"
                ></popup-picker>
                <x-input v-model="item.nricPassport" :title="$t('NRICPassport')"></x-input>
                <x-input v-model="item.unitNo" :title="$t('Unit')"></x-input>
                <x-input v-model="item.block" :title="$t('Block')"></x-input>
                <x-input v-model="item.streetName" :title="$t('StreetName')"></x-input>
                <x-input v-model="item.postalCode" :title="$t('PostalCode')"></x-input>
                <popup-picker
                  :title="$t('Country')"
                  :data="sellBlockData.CitizenshipData"
                  v-model="item.country"
                  cancel-text="cancel"
                  confirm-text="OK"
                ></popup-picker>
              </group>
            </div>
            <div class="buyerAddBtn">
              <mt-button
                v-if="BuyersList.length < 5"
                type="primary"
                @click="addArrFn('buyer')"
              >{{$t('AddBuyer')}}</mt-button>
            </div>
          </div>
          <div class="Buyer_list">
            <div class="Buyer_list_head">{{$t('UnitChoice')}}</div>
            <div v-for="(item,index) in UnitList" :key="index">
              <group class="Buyer_list_box" label-width="20vh">
                <div class="Buyer_list_box_head">
                  <span class="Buyer_list_box_head_text" v-if="index == 0">{{$t('1stChoice')}}</span>
                  <span class="Buyer_list_box_head_text" v-if="index == 1">{{$t('2ndChoice')}}</span>
                  <span class="Buyer_list_box_head_text" v-if="index == 2">{{$t('3rdChoice')}}</span>
                  <span class="Buyer_list_box_head_text" v-if="index == 3">{{$t('4rdChoice')}}</span>
                  <span class="Buyer_list_box_head_text" v-if="index == 4">{{$t('5rdChoice')}}</span>
                  <span class="Buyer_list_box_head_btn">
                    <img
                      v-if="index !== 0"
                      @click="remArrFn('unit',index)"
                      src="@/assets/images/icon/delete_Buyer.png"
                      alt
                    >
                  </span>
                </div>
                <popup-picker
                  :title="$t('Unit')"
                  :data="unitData"
                  v-model="item.unitId"
                  :columns="1"
                  :show-name="true"
                  placeholder
                  cancel-text="cancel"
                  confirm-text="OK"
                ></popup-picker>
                <!-- <x-input v-model="item.unitName" title="Unit"></x-input> -->
                <x-input v-model="item.priceFrom" :title="$t('PriceFrom')"></x-input>
                <x-input v-model="item.priceTo" :title="$t('PriceTo')"></x-input>
              </group>
            </div>
            <div class="buyerAddBtn">
              <mt-button
                v-if="UnitList.length < 3"
                type="primary"
                @click="addArrFn('unit')"
              >{{$t('AddUnitChoice')}}</mt-button>
            </div>
          </div>
          <div class="interestBtn">
            <mt-button type="primary" @click="clearData">{{$t('Reset')}}</mt-button>
            <mt-button type="primary" @click="postData">{{$t('Submit')}}</mt-button>
          </div>
          <buyerBox
            :projectId="unitInfo.projectId"
            @getBuyerInfoFn="getSonBuyerFn($event)"
            :istrue="buyerIsShow"
          ></buyerBox>
        </mt-tab-container-item>
        <mt-tab-container-item id="List" class="List">
          <div class="listHead">
            <flexbox class="listHead_box" :gutter="0">
              <flexbox-item>
                <div class="flex-txt">{{$t('Ballot')}}</div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-txt">{{$t('Agency')}}</div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-txt">{{$t('Agent')}}</div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-txt">{{$t('Buyer')}}</div>
              </flexbox-item>
            </flexbox>
          </div>
          <ul class="List_Ul">
            <li
              class="List_Ul_box"
              v-for="(item,index) in InterestList"
              :key="index"
              @click="examineInfo(item)"
            >
              <flexbox :gutter="0">
                <flexbox-item>
                  <div class="flex-txt">{{item.ballotNo}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="flex-txt">{{item.agencies}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="flex-txt">{{item.agentName}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="flex-txt">{{item.buyerName}}</div>
                </flexbox-item>
              </flexbox>
            </li>
            <li v-if="InterestList.length == 0">
              <alert v-if="InterestList.length === 0" :alertConfig="alertConfig"></alert>
            </li>
          </ul>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import sellBlockData from "@/assets/json/sellBlockData.json";
import { PopupPicker } from 'vux'
import buyerBox from '@/components/buyerBox.vue'
import alert from "@/components/alert.vue";
export default {
  name: 'Interest',
  components: {
    PopupPicker,
    buyerBox,
    alert
  },
  data() {
    return {
      selected: 'NewEdit',
      Generalfrom: {},
      sellBlockData: sellBlockData,
      unitInfo: {},
      BuyersList: [{}],
      UnitList: [{}],
      buyerIsShow: false,
      buyerListIndex: Number,
      InterestList: [],
      unitData: [],
      alertConfig: {
        isShow: true,
        img: '/img/alert/noContent.png',
        err: this.$t('ComingSoon'),
        tips: this.$t('noContent')
      },
    }
  },
  mounted() {
    this.unitInfo = this.$route.query
    this.getInterestList()
    this.getInterestChoice()
  },
  methods: {
    addArrFn(type) {
      switch (type) {
        case 'buyer':
          this.BuyersList.push({})
          break;
        default:
          this.UnitList.push({})
          break;
      }
    },
    remArrFn(type, index) {
      switch (type) {
        case 'buyer':
          this.BuyersList.splice(index, 1)
          break;
        default:
          this.UnitList.splice(index, 1)
          break;
      }
    },
    findBuery(index) { // 开启子组件
      this.buyerIsShow = true
      this.buyerListIndex = index
    },
    getSonBuyerFn(item) { // 子组件传回值
      this.buyerIsShow = false
      let index = this.buyerListIndex
      if (item !== 1) {
        this.$set(this.BuyersList, index, this.disposeData(item))
      }
    },
    getInterestChoice() {
      this.$Get(this.$api.getInterestChoice, { projectId: this.unitInfo.projectId }).then(res => {
        if (res.code == 0) {
          this.unitData = res.datas.map(item => {
            let data = {
              name: item.unitName,
              value: item.unitId
            }
            return data
          })
        }
      })
    },
    disposeData(item) { // 重置子组件过来的数据
      let data = {}
      for (let key in item) {
        if (item[key]) {
          switch (key) {
            case 'countryCallingCode':
            case 'nationality':
            case 'country':
              data[key] = [item[key].toString()]
              break;
            default:
              data[key] = item[key].toString()
              break;
          }
        } else {
          switch (key) {
            case 'countryCallingCode':
            case 'nationality':
            case 'country':
              data[key] = []
              break;
            default:
              data[key] = ''
              break;
          }
        }
      }
      return data
    },
    postData() { // 提交表单
      let BuyersData = this.BuyersList.slice().map(item => {
        return JSON.parse(JSON.stringify(item));
      })
      for (let i = 0; i < this.BuyersList.length; i++) {
        if (this.BuyersList[i].countryCallingCode) {
          BuyersData[i].countryCallingCode = this.BuyersList[i].countryCallingCode[0]
        }
        if (this.BuyersList[i].nationality) {
          BuyersData[i].nationality = this.BuyersList[i].nationality[0]
        }
        if (this.BuyersList[i].country) {
          BuyersData[i].country = this.BuyersList[i].country[0]
        }
      }
      let UnitList = this.UnitList.slice().map(item => {
        return JSON.parse(JSON.stringify(item));
      })
      for (let i = 0; i < this.UnitList.length; i++) {
        if (this.UnitList[i].unitId) {
          UnitList[i].unitId = this.UnitList[i].unitId[0]
        }
      }
      let Generalfrom = JSON.parse(JSON.stringify(this.Generalfrom))
      if (this.Generalfrom.countryCallingCode) {
        Generalfrom.countryCallingCode = this.Generalfrom.countryCallingCode[0]
      }
      let data = {
        ...Generalfrom, 
        unitArr: JSON.stringify(UnitList),
        buyerArr: JSON.stringify(BuyersData),
        projectId: this.unitInfo.projectId
      }
      this.$Get(this.$api.submitInterest, { ...data }).then(res => {
        if (res.code == 0) {
          this.clearData()
          this.getInterestList()
          this.$vux.toast.text('submit successfully', 'middle')
        } else {
          this.$vux.toast.text(res.msg, 'middle')
        }
      })
    },
    clearData() { // 清除表单
      this.Generalfrom = {
        ballotNo: '',
        chequeNo: '',
        bankName: '',
        agentName: '',
        agency: '',
        countryCallingCode: [],
        agentMobile: '',
        agentCEA: '',
        notes: '',
        interestId: ''
      }
      this.BuyersList = [{
        buyerName: '',
        countryCallingCode: [],
        buyerMobile: '',
        buyerEmail: '',
        nationality: [],
        nricPassport: '',
        unitNo: '',
        block: '',
        streetName: '',
        postalCode: '',
        country: []
      }]
      this.UnitList = [{
        unitId: [],
        priceFrom: '',
        priceTo: ''
      }]
    },
    examineInfo(item) { // 选中的数据放入表单
      let self = this
      console.log(item)
      self.$Get(self.$api.getInterestBuyerUnit, {interestId: item.interestId}).then(res => {
        if(res.code == 0) {
          self.Generalfrom = {
            ballotNo: item.ballotNo,
            chequeNo: item.chequeNum,
            bankName: item.bankName,
            agentName: item.agentName,
            agency: item.agencies,
            countryCallingCode: [item.countryCallingCode],
            agentMobile: item.agentMobile,
            agentCEA: item.agentCEA,
            notes: item.notes,
            interestId: item.interestId
          }
          self.BuyersList = []
          self.BuyersList = res.datas.buyerList.map(item => {
            return self.disposeData(item)
          })
          self.UnitList = []
          self.UnitList = res.datas.unitList.map(item => {
            let data = {
              unitId: [item.unitId],
              priceFrom: item.priceFrom,
              priceTo: item.priceTo
            }
            return data
          })
          self.selected = 'NewEdit'
        }
      })
    },
    getInterestList() { // 列表数据
      this.$Get(this.$api.getInterestList, { projectId: this.unitInfo.projectId, pageSize: 1000, pageNo: 1,unitId:this.unitInfo.unitId }).then(res => {
        if (res.code == 0) {
          this.InterestList = res.datas
        }
      })
    }
  }
}
</script>

<style lang="less">
.Interest {
  .Interest_tab {
    position: relative;
    .mint-tab-item {
      padding: 0;
      margin-bottom: 0;
      color: #999;
      .mint-tab-item-label {
        height: 40px;
        line-height: 40px;
      }
      z-index: 100;
    }
    .mint-tab-item.is-selected {
      border-bottom: 2px solid #000;
      color: #000;
    }
  }
  .Interest_tab::before {
    content: "";
    position: absolute;
    bottom: -1px;
    height: 1px;
    background: #ddd;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .Interest_tab_content {
    position: absolute;
    top: 123px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    .mint-tab-container,
    .mint-tab-container-wrap {
      height: 100%;
    }
    .NewEdit,
    .List {
      height: 100%;
      overflow-y: scroll;
    }
    .NewEdit {
      .interestBtn {
        text-align: center;
        padding: 15px 0;
        background-color: #f4f4f4;
        button {
          width: 30%;
          height: 35px;
          font-size: 13px;
          border-radius: 20px;
        }
        button:last-child {
          margin-left: 15px;
        }
      }
      .weui-cells__title {
        background: #f4f4f4;
        margin: 0;
        padding: 8px 15px;
        text-align: center;
        color: #000;
      }
      .weui-cell {
        padding: 15px;
        .weui-cell__ft {
          line-height: 1;
        }
        .vux-popup-picker-select {
          font-size: 14px;
          text-align: left !important;
        }
        .weui-cell__bd {
          font-size: 14px;
          color: #999;
        }
        .weui-cell__hd {
          font-size: 14px;
        }
      }
      .weui-cell:before,
      .vux-cell-box:not(:first-child):before {
        left: 0;
      }
      .Buyer_list {
        .Buyer_list_head {
          padding: 10px 15px;
          text-align: center;
          background-color: #f4f4f4;
        }
        .Buyer_list_box {
          .weui-cells {
            margin-top: 0;
            .Buyer_list_box_head {
              padding: 15px;
              color: #999;
              font-size: 15px;
              position: relative;
              .Buyer_list_box_head_text {
                display: block;
                text-align: center;
              }
              .Buyer_list_box_head_btn {
                position: absolute;
                right: 15px;
                top: 50%;
                margin-top: -15px;
                img {
                  width: 30px;
                  margin-left: 15px;
                }
              }
            }
          }
        }
        .buyerAddBtn {
          text-align: center;
          button {
            width: 70%;
            font-size: 14px;
            border-radius: 30px;
            margin: 15px 0;
            height: 35px;
          }
        }
      }
    }
    .List {
      overflow: hidden;
      position: relative;
      height: 100%;
      .listHead {
        text-align: center;
        background: #f4f4f4;
      }
      .vux-flexbox-item {
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        .flex-txt {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .List_Ul {
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: scroll;
        .List_Ul_box {
          border-bottom: 1px solid #f4f4f4;
          .flex-txt {
            color: #666;
          }
        }
      }
    }
  }
}
</style>