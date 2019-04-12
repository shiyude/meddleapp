<template>
  <div class="developerSellBlock">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">{{unitInfo.unitName}}</x-header>
    <div class="developerSellBlock_tab">
      <mt-navbar v-model="selected">
        <mt-tab-item id="Summary">{{$t('Summary')}}</mt-tab-item>
        <mt-tab-item id="Buyer">{{$t('Buyer')}}</mt-tab-item>
        <mt-tab-item id="Documents">{{$t('Documents')}}</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="developerSellBlock_content">
      <mt-tab-container v-model="selected">
        <mt-tab-container-item class="Summary" id="Summary">
          <div class="sellBlock_box_head">
            <h3 class="sellBlock_box_head_h3">
              {{unitInfo.projectName}} - {{unitInfo.unitName}}
              <span class="SOLD" v-if="blockInfo.purchaseStatus === 'SOLD'">{{blockInfo.purchaseStatus}}</span>
              <span class="AVAILABLE" v-if="blockInfo.purchaseStatus === 'AVAILABLE'">{{blockInfo.purchaseStatus}}</span>
              <span class="NOTRELEASED" v-if="blockInfo.purchaseStatus === 'NOT RELEASED'">{{blockInfo.purchaseStatus}}</span>
              <span class="PENDINGRESERVED" v-if="blockInfo.purchaseStatus === 'PENDING RESERVED'">{{blockInfo.purchaseStatus}}</span>
              <span class="RESERVED" v-if="blockInfo.purchaseStatus === 'RESERVED'">{{blockInfo.purchaseStatus}}</span>
              <span class="SPASIGN" v-if="blockInfo.purchaseStatus === 'SPA SIGN'">{{blockInfo.purchaseStatus}}</span>
              <span class="SPASTAMP" v-if="blockInfo.purchaseStatus === 'SPA STAMP'">{{blockInfo.purchaseStatus}}</span>
              <span class="REQUESTCANCEL" v-if="blockInfo.purchaseStatus === 'REQUEST CANCEL'">{{blockInfo.purchaseStatus}}</span>
            </h3>
            <p v-if="blockInfo.operateTime&&blockInfo.operateName">{{$t('CreatedBy')}} {{blockInfo.operateName}} {{blockInfo.operateTime}}</p>
          </div>
          <div class="summaryContent">
            <group :title="$t('soldByOtherAgency')" label-width="22vh">
              <!-- 经济公司 -->
              <popup-picker :title="$t('SelectAgency')" :data="projectBrokeList" v-model="form.buyBrokeId" :columns="1" :show-name="true" placeholder cancel-text="cancel" confirm-text="OK" @on-change="changeBuybroke(form.buyBrokeId[0])"></popup-picker>
            </group>

            <group :title="$t('transactuibDetatls')" label-width="22vh">
              <!-- 交易价格 -->
              <mt-radio align="right" v-model="price" :options="priceList"></mt-radio>
              <x-input :title="$t('UnitPrice')" v-model="form.transactionPrice"></x-input>
              <!-- 交易时间 -->
              <datetime cancel-text="cancel" confirm-text="OK" :title="$t('Date')" v-model="form.transactionDate"></datetime>
              <popup-picker :title="$t('InterestBallot')" :data="ballotList" :columns="1" :show-name="true" placeholder v-model="form.ballot" cancel-text="cancel" confirm-text="OK"></popup-picker>
              <x-textarea :max="999" :placeholder="$t('comss')" v-model="form.comment"></x-textarea>
            </group>
            <!-- 经纪人 -->
            <group :title="$t('SalesRep')" label-width="22vh">
              <popup-picker :title="$t('SalesRep')" :data="agentList" v-model="form.salesRepId" :columns="1" :show-name="true" placeholder cancel-text="cancel" confirm-text="OK"></popup-picker>
            </group>
            <group :title="$t('Deposit')" label-width="22vh">
              <x-input :title="$t('Amount')" type="number" v-model="form.amount"></x-input>
              <popup-picker cancel-text="cancel" confirm-text="OK" :title="$t('Method')" :data="sellBlockData.Methods" v-model="form.method"></popup-picker>
              <x-input :title="$t('ChequeNo')" v-model="form.chequeNo"></x-input>
              <x-input :title="$t('BankName')" v-model="form.bankName"></x-input>
              <datetime cancel-text="cancel" confirm-text="OK" :title="$t('ChequeBank-inDate')" v-model="form.chequeBankDate"></datetime>
            </group>
            <group :title="$t('SpecialSPADate')" label-width="22vh">
              <datetime cancel-text="cancel" confirm-text="OK" :title="$t('SpecialSPADate')" v-model="form.specialSPADate"></datetime>
              <x-textarea :max="999" :placeholder="$t('OtherRemarks')" v-model="form.otherRemarks"></x-textarea>
            </group>
            <div class="SellBlockBtns">
              <!-- 
                Not Released 不释放
                Released 释放
                Pending Reserved 准备保留
                Reserved 保留
                Sold 卖出
                SPA Signed 签字
                SPA Stamp 确认
                Request Cancel 准备取消
                Cancel 取消
                UpDate 上传数据
              -->
              <mt-button type="primary" v-if="blockInfo.purchaseStatus === 'AVAILABLE' && jurisdictionData.Set_Not_Release == 1" @click="upDataInfo('NotReleased')">{{$t('NotReleased')}}</mt-button>
              <mt-button type="primary" v-if="blockInfo.purchaseStatus === 'NOT RELEASED' && jurisdictionData.Release == 1" @click="upDataInfo('Released')">{{$t('Released')}}</mt-button>
              <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'REQUEST CANCEL') && jurisdictionData.Mark_Pending_Reserve == 1
                " @click="upDataInfo('PendingReserved')">{{$t('PendingReserved')}}</mt-button>
              <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED') && jurisdictionData.Mark_Reserved == 1
                " @click="upDataInfo('Reserved')">{{$t('Reserved')}}</mt-button>
              <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'RESERVED') && jurisdictionData.Mark_Sold == 1
                " @click="upDataInfo('Sold')">{{$t('Sold')}}</mt-button>
              <mt-button type="primary" v-if="
                  blockInfo.purchaseStatus === 'SOLD' 
                  && jurisdictionData.Mark_SPA_Signed == 1
                " @click="upDataInfo('SPASigned')">{{$t('SPASigned')}}</mt-button>
              <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD') && jurisdictionData.Mark_SPA_Stamped == 1
                " @click="upDataInfo('SPAStamp')">{{$t('SPAStamp')}}</mt-button>
              <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED'
                 ) 
                  && (jurisdictionData.Cancel_Reserved == 1
                      || jurisdictionData.Cancel_Pending_Reserve == 1
                  )
                " @click="upDataInfo('RequestCancel')">{{$t('RequestCancel')}}</mt-button>
              <mt-button type="primary" v-if="
                  (
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'REQUEST CANCEL'||
                  blockInfo.purchaseStatus === 'SPA STAMP') && jurisdictionData.Comfirm_Cancel == 1
                " @click="upDataInfo('Cancel')">{{$t('Cancel')}}</mt-button>
              <mt-button type="primary" v-if="
                  (
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'SPA STAMP')
                " @click="upDataInfo('UpDate')">{{$t('UpDate')}}</mt-button>
            </div>
          </div>
        </mt-tab-container-item>

        <!-- 买家 -->
        <mt-tab-container-item class="Buyer" id="Buyer">
          <div class="BuyersInformation">
            <div class="Buyer_list_head">{{$t('BuyersInformation')}}</div>
            <div v-for="(item,index) in Buyers" :key="index">
              <group class="Buyer_list_box" label-width="20vh">
                <div class="Buyer_list_box_head">
                  <span class="Buyer_list_box_head_text">{{$t('Buyer')}} -- {{index + 1}}</span>
                  <span class="Buyer_list_box_head_btn">
                    <img src="@/assets/images/icon/add_Buyer.png" @click="findBuery(index)" alt>
                    <img src="@/assets/images/icon/delete_Buyer.png" v-if="index!==0" @click="deleteBuery(index)" alt>
                  </span>
                </div>
                <popup-picker :title="$t('CustomerType')" :data="sellBlockData.CustomerTypeData" v-model="item.customerType" :columns="1" :show-name="true" placeholder cancel-text="cancel" confirm-text="OK"></popup-picker>
                <x-input v-model="item.buyerName" :title="$t('Name')"></x-input>
                <datetime cancel-text="cancel" confirm-text="OK" :title="$t('DateOfBirth')" v-model="item.dateOfBirth" :min-year="1900"></datetime>
                <popup-picker :title="$t('Gender')" :data="sellBlockData.GenderData" v-model="item.gender" :columns="1" :show-name="true" placeholder cancel-text="cancel" confirm-text="OK"></popup-picker>
                <popup-picker :title="$t('AreaCode')" :data="sellBlockData.countryCallingCodeData" v-model="item.countryCallingCode" :columns="1" :show-name="true" placeholder cancel-text="cancel" confirm-text="OK"></popup-picker>
                <x-input v-model="item.buyerMobile" :title="$t('Mobile')"></x-input>
                <x-input v-model="item.buyerEmail" :title="$t('Email')"></x-input>
                <popup-picker :title="$t('Nationality')" :data="sellBlockData.CitizenshipData" v-model="item.nationality" cancel-text="cancel" confirm-text="OK"></popup-picker>
                <x-input v-model="item.nricPassport" :title="$t('NRICPassport')"></x-input>
                <x-input v-model="item.unitNo" :title="$t('Unit')"></x-input>
                <x-input v-model="item.block" :title="$t('Block')"></x-input>
                <x-input v-model="item.streetName" :title="$t('StreetName')"></x-input>
                <x-input v-model="item.postalCode" :title="$t('PostalCode')"></x-input>
                <popup-picker :title="$t('Country')" :data="sellBlockData.CitizenshipData" v-model="item.country" cancel-text="cancel" confirm-text="OK"></popup-picker>
                <popup-picker :title="$t('District')" :data="sellBlockData.DistrictData" v-model="item.district" cancel-text="cancel" confirm-text="OK"></popup-picker>
                <mt-checklist align="right" v-model="item.singaporePR" :options="[{label: 'SingaporePR',value: '1'}]"></mt-checklist>
                <x-input v-model="item.noOfProperties" :title="$t('NoOfProperties')"></x-input>
                <x-input v-model="item.occupation" :title="$t('Occupation')"></x-input>
                <popup-picker :title="$t('Citizenship')" :data="sellBlockData.CitizenshipData" v-model="item.citizenship" cancel-text="cancel" confirm-text="OK"></popup-picker>
                <popup-picker :title="$t('Residential')" :data="sellBlockData.residentialData" v-model="item.residential" cancel-text="cancel" confirm-text="OK"></popup-picker>
              </group>
            </div>
            <div class="buyerAddBtn">
              <mt-button v-if="Buyers.length < 5" type="primary" @click="addBuery">{{$t('AddBuyer')}}</mt-button>
            </div>
          </div>
          <div class="AgentInformation">
            <group :title="$t('AgentInformation')" class="Buyer_list_box" label-width="20vh">
              <x-input v-model="form.agentName" :title="$t('AgentName')"></x-input>
              <x-input v-model="form.agentContact" :title="$t('AgentContact')"></x-input>
            </group>
          </div>
          <div class="SellBlockBtns">
            <!-- 
                Not Released 不释放
                Released 释放
                Pending Reserved 准备保留
                Reserved 保留
                Sold 卖出
                SPA Signed 签字
                SPA Stamp 确认
                Request Cancel 准备取消
                Cancel 取消
                UpDate 上传数据
              -->
            <mt-button type="primary" v-if="blockInfo.purchaseStatus === 'AVAILABLE' && jurisdictionData.Set_Not_Release == 1" @click="upDataInfo('NotReleased')">{{$t('NotReleased')}}</mt-button>
            <mt-button type="primary" v-if="blockInfo.purchaseStatus === 'NOT RELEASED' && jurisdictionData.Release == 1" @click="upDataInfo('Released')">{{$t('Released')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'REQUEST CANCEL') && jurisdictionData.Mark_Pending_Reserve == 1
                " @click="upDataInfo('PendingReserved')">{{$t('PendingReserved')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED') && jurisdictionData.Mark_Reserved == 1
                " @click="upDataInfo('Reserved')">{{$t('Reserved')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'RESERVED') && jurisdictionData.Mark_Sold == 1
                " @click="upDataInfo('Sold')">{{$t('Sold')}}</mt-button>
            <mt-button type="primary" v-if="
                  blockInfo.purchaseStatus === 'SOLD' 
                  && jurisdictionData.Mark_SPA_Signed == 1
                " @click="upDataInfo('SPASigned')">{{$t('SPASigned')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD') && jurisdictionData.Mark_SPA_Stamped == 1
                " @click="upDataInfo('SPAStamp')">{{$t('SPAStamp')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED'
                 ) 
                  && (jurisdictionData.Cancel_Reserved == 1
                      || jurisdictionData.Cancel_Pending_Reserve == 1
                  )
                " @click="upDataInfo('RequestCancel')">{{$t('RequestCancel')}}</mt-button>
            <mt-button type="primary" v-if="
                  (
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'REQUEST CANCEL'||
                  blockInfo.purchaseStatus === 'SPA STAMP') && jurisdictionData.Comfirm_Cancel == 1
                " @click="upDataInfo('Cancel')">{{$t('Cancel')}}</mt-button>
            <mt-button type="primary" v-if="
                  (
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'SPA STAMP')
                " @click="upDataInfo('UpDate')">{{$t('UpDate')}}</mt-button>
            <!-- <mt-button type="primary" v-if="blockInfo.purchaseStatus === 'AVAILABLE' && jurisdictionData.Set_Not_Release == 1" @click="upDataInfo('NotReleased')">{{$t('NotReleased')}}</mt-button>
            <mt-button type="primary" v-if="blockInfo.purchaseStatus === 'NOT RELEASED' && jurisdictionData.Release == 1" @click="upDataInfo('Released')">{{$t('Released')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'SOLD' || 
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SPA STAMP' ||
                  blockInfo.purchaseStatus === 'REQUEST CANCEL') && jurisdictionData.Mark_Pending_Reserve == 1
                " @click="upDataInfo('PendingReserved')">{{$t('PendingReserved')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'SOLD' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SPA STAMP' ||
                  blockInfo.purchaseStatus === 'REQUEST CANCEL') && jurisdictionData.Mark_Reserved == 1
                " @click="upDataInfo('Reserved')">{{$t('Reserved')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SPA STAMP' ||
                  blockInfo.purchaseStatus === 'REQUEST CANCEL') && jurisdictionData.Mark_Sold == 1
                " @click="upDataInfo('Sold')">{{$t('Sold')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA STAMP' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'REQUEST CANCEL') && jurisdictionData.Mark_SPA_Signed == 1
                " @click="upDataInfo('SPASigned')">{{$t('SPASigned')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'REQUEST CANCEL') && jurisdictionData.Mark_SPA_Stamped == 1
                " @click="upDataInfo('SPAStamp')">{{$t('SPAStamp')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'SPA STAMP') 
                  && (jurisdictionData.Cancel_SPA_Signed_Stamped == 1
                      || jurisdictionData.Cancel_Reserved == 1
                      || jurisdictionData.Cancel_Sold == 1
                      || jurisdictionData.Cancel_Pending_Reserve == 1
                  )
                " @click="upDataInfo('RequestCancel')">{{$t('RequestCancel')}}</mt-button>
            <mt-button type="primary" v-if="
                  (blockInfo.purchaseStatus === 'AVAILABLE' || 
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'REQUEST CANCEL' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'SPA STAMP') && jurisdictionData.Comfirm_Cancel == 1
                " @click="upDataInfo('Cancel')">{{$t('Cancel')}}</mt-button>
            <mt-button type="primary" v-if="
                  (
                  blockInfo.purchaseStatus === 'RESERVED' || 
                  blockInfo.purchaseStatus === 'REQUEST CANCEL' || 
                  blockInfo.purchaseStatus === 'PENDING RESERVED' || 
                  blockInfo.purchaseStatus === 'SPA SIGN' ||
                  blockInfo.purchaseStatus === 'SOLD' ||
                  blockInfo.purchaseStatus === 'SPA STAMP')
                " @click="upDataInfo('UpDate')">{{$t('UpDate')}}</mt-button> -->
          </div>
          <buyerBox :projectId="unitInfo.projectId" @getBuyerInfoFn="getSonBuyerFn($event)" :istrue="buyerIsShow"></buyerBox>
        </mt-tab-container-item>

        <!-- 合同 -->
        <mt-tab-container-item class="Documents" id="Documents">
          <div class="PDFList" v-for="(item,index) in DocumentsList.generat" :key="index">
            <h3>{{item.title}}</h3>
            <p>{{item.createTime}} - {{item.agentName}}</p>
            <div class="PDFListBtn">
              <mt-button type="primary" @click="pdfLook(item.url)">{{$t('View')}}</mt-button>
              <mt-button type="primary" @click="pdfShowFn(item)">{{$t('Version')}}</mt-button>
              <mt-button type="primary" @click="builderPdf(item)">{{$t('Generate')}}</mt-button>
            </div>
          </div>
          <div class="imgList">
            <div class="imgList_box" v-for="(item,index) in DocumentsList.img" :key="index">
              <img :src="hostUrl+item.url" class="testImg" style="display:none">
              <div class="imgList_box_lf">
                <div class="imgList_box_lf_box">
                  <h4>{{item.title}}</h4>
                  <p>{{item.createTime}} - {{item.agentName}}</p>
                </div>
              </div>
              <div class="imgList_box_rt">
                <span class="upImg">
                  <input @change="upPdfImg($event,item,index)" type="file" name="image" accept="image/*">
                </span>
                <span class="LookImg" @click="examineImg(index,item.url)"></span>
              </div>
            </div>
          </div>
          <div v-transfer-dom>
            <previewer ref="previewer" :list="list"></previewer>
          </div>
          <div class="PdfLst" v-transfer-dom>
            <popup class="PdfLstPopup" v-model="pdfListShow" height="70%">
              <div class="PdfLstPopupBox">
                <ul class="PdfLstPopupBoxList">
                  <li v-for="(item,index) in pdfListData" :key="index">
                    <flexbox :gutter="0">
                      <flexbox-item :span="9">
                        <div class="flex-div">{{index+1}} - {{item.createTime}} by {{item.agentName}}</div>
                      </flexbox-item>
                      <flexbox-item>
                        <div class="flex-div">
                          <mt-button type="primary" @click="pdfLook(item.url)">{{$t('View')}}</mt-button>
                        </div>
                      </flexbox-item>
                    </flexbox>
                  </li>
                </ul>
              </div>
            </popup>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import { AlertModule } from "vux";
import sellBlockData from "@/assets/json/sellBlockData.json";
import { Datetime, PopupPicker, Picker, Toast, Popup } from "vux";
import buyerBox from "@/components/buyerBox.vue";
import { Previewer, TransferDom } from "vux";
import openPdf from "@/util/unitDock/pdf.js";
export default {
  name: "Interest",
  directives: {
    TransferDom
  },
  components: {
    PopupPicker,
    Picker,
    Datetime,
    Toast,
    buyerBox,
    Previewer,
    Popup
  },
  data() {
    return {
      hostUrl: window.localStorage.getItem("imgUlr") || "",
      list: [
        {
          src: "",
          h: 0,
          w: 0
        }
      ],
      selected: "Summary",
      unitInfo: {},
      TransactionData: {},
      form: {},
      jurisdictionData: {}, // 权限
      priceList: [], // 价格列表
      projectBrokeList: [], // 经济公司列表
      agentList: [], // 经纪人列表
      ballotList: [], // 抽签号码列表
      sellBlockData: sellBlockData,

      // buyer 页面数据
      price: "",
      Buyers: [
        {
          singaporePR: []
        }
      ],
      configItem: JSON.parse(localStorage.getItem("projectSet")),
      blockInfo: {},
      buyerIsShow: false,
      buyerListIndex: Number,
      // 合同页面数据
      DocumentsList: {
        generat: [],
        img: []
      },
      pdfListData: [],
      pdfListShow: false
    };
  },
  watch: {
    price(val) {
      this.form.transactionPrice = val;
    }
  },
  mounted() {
    this.unitInfo = this.$route.query;
    this.getUnitTransaction();
    this.getUnitRoleAccess();
    this.queryDocumentsList();
  },
  methods: {
    getUnitTransaction(type) {
      let self = this;
      this.$Get(this.$api.getUnitTransaction, {
        unitId: this.unitInfo.unitId,
        projectId: this.unitInfo.projectId
      }).then(res => {
        if (res.code == 0) {
          this.blockInfo = res.datas;
          this.priceList = [];
          // 换算金额列表
          for (let i = 0; i < res.datas.priceList.length; i++) {
            let data = {
              label: `${res.datas.priceList[i].key} (${
                res.datas.priceList[i].value
              })`,
              value: (
                Math.floor(
                  res.datas.priceList[i].value.replace(/[^0-9.]/gi, "") * 100
                ) / 100
              ).toString(),
              disabled: res.datas.priceList[i].tran == 1 ? true : false
            };
            this.priceList.push(data);
          }
          // 重置经纪公司列表
          if (res.datas.projectBrokeList) {
            this.projectBrokeList = res.datas.projectBrokeList.map(item => {
              let data = {
                name: item.brokeName,
                value: item.brokeId
              };
              return data;
            });
          }
          // if (res.datas.agentList) {
          //   this.agentList = res.datas.agentList.map(item => {
          //     let data = {
          //       name: item.agentName,
          //       value: item.agentId
          //     }
          //     return data
          //   })
          // }
          if (res.datas.ballotList) {
            this.ballotList = res.datas.ballotList.map(item => {
              let data = {
                name: item,
                value: item
              };
              return data;
            });
          }
          self.summaryFormFn(res.datas);
          this.$Get(this.$api.getBuyer, { recordId: res.datas.recordId }).then(
            res => {
              if (res.code == 0) {
                self.Buyers = [];
                self.Buyers = res.datas.map(item => {
                  return self.BuyersInfoFn(item);
                });
              }
            }
          );
        }
      });
    },
    changeBuybroke(id) {
      let name = "";
      for (let i = 0; i < this.projectBrokeList.length; i++) {
        if (this.projectBrokeList[i].value === id) {
          name = this.projectBrokeList[i].name;
        }
      }
      this.$Get(this.$api.getSalesRepList, {
        projectId: this.unitInfo.projectId,
        sellingEntities: name
      }).then(res => {
        if (res.code == 0) {
          console.log(res);
          this.agentList = res.datas.map(item => {
            let data = {
              name: item.agentName,
              value: item.agentId
            };
            return data;
          });
        }
      });
      // console.log("触发", id, name)
    },
    summaryFormFn(data) {
      // 填充form表单
      this.form = {
        buyBrokeId: [],
        transactionPrice: "",
        transactionDate: "",
        ballot: [],
        comment: "",
        salesRepId: [],
        amount: "",
        method: [],
        chequeNo: "",
        bankName: "",
        chequeBankDate: "",
        specialSPADate: "",
        otherRemarks: "",
        agentName: "",
        agentContact: ""
      };
      if (data.transactionDate)
        this.form.transactionDate = data.transactionDate;
      if (data.comment) this.form.comment = data.comment;
      if (data.amount) this.form.amount = data.amount;
      if (data.chequeNo) this.form.chequeNo = data.chequeNo;
      if (data.bankName) this.form.bankName = data.bankName;
      if (data.chequeBankDate) this.form.chequeBankDate = data.chequeBankDate;
      if (data.specialSPADate) this.form.specialSPADate = data.specialSPADate;
      if (data.otherRemarks) this.form.otherRemarks = data.otherRemarks;
      if (data.agentName) this.form.agentName = data.agentName;
      if (data.agentContact) this.form.agentContact = data.agentContact;

      if (data.transactionPrice)
        this.form.transactionPrice = data.transactionPrice.toString();
      if (data.transactionPrice) this.price = data.transactionPrice.toString();
      if (data.ballot) this.form.ballot.push(data.ballot);
      if (data.salesRepId) this.form.salesRepId.push(data.salesRepId);
      if (data.method) this.form.method.push(data.method);
      if (data.buyBrokeId) this.form.buyBrokeId.push(data.buyBrokeId);
    },
    BuyersInfoFn(item) {
      // 处理买家信息
      let data = {};
      for (let key in item) {
        if (item[key]) {
          switch (key) {
            case "customerType":
            case "gender":
            case "countryCallingCode":
            case "nationality":
            case "country":
            case "district":
            case "singaporePR":
            case "citizenship":
            case "residential":
              data[key] = [item[key].toString()];
              break;
            case "buyerId":
              data[key] = "";
              break;
            default:
              data[key] = item[key].toString();
              break;
          }
        } else {
          switch (key) {
            case "customerType":
            case "gender":
            case "countryCallingCode":
            case "nationality":
            case "country":
            case "district":
            case "singaporePR":
            case "citizenship":
            case "residential":
              data[key] = [];
              break;
            case "buyerId":
              data[key] = "";
              break;
            default:
              data[key] = "";
              break;
          }
        }
      }
      return data;
    },
    getSonBuyerFn(item) {
      // 获取选择数据关闭弹窗
      this.buyerIsShow = false;
      let index = this.buyerListIndex;
      if (item !== 1) {
        this.$set(this.Buyers, index, this.BuyersInfoFn(item));
      }
    },
    processingSummaryData(data) {
      // 处理 Summary 页面数据
      let obj = JSON.parse(JSON.stringify(data));
      if (obj.buyBrokeId) obj.buyBrokeId = obj.buyBrokeId[0];
      if (obj.salesRepId) obj.salesRepId = obj.salesRepId[0];
      if (obj.method) obj.method = obj.method[0];
      if (obj.ballot) obj.ballot = obj.ballot[0];
      return obj;
    },
    processingBuyersData(data) {
      // 处理buyers页面数据
      let obj = data.slice().map(item => {
        return JSON.parse(JSON.stringify(item));
      });
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].customerType) obj[i].customerType = obj[i].customerType[0];
        if (obj[i].gender) obj[i].gender = obj[i].gender[0];
        if (obj[i].countryCallingCode)
          obj[i].countryCallingCode = obj[i].countryCallingCode[0];
        if (obj[i].nationality) obj[i].nationality = obj[i].nationality[0];
        if (obj[i].country) obj[i].country = obj[i].country[0];
        if (obj[i].district) obj[i].district = obj[i].district[0];
        if (obj[i].singaporePR) obj[i].singaporePR = obj[i].singaporePR[0];
        if (obj[i].citizenship) obj[i].citizenship = obj[i].citizenship[0];
        if (obj[i].residential) obj[i].residential = obj[i].residential[0];
      }
      return obj;
    },
    upDataInfo(type) {
      // 区分行为处理数据
      // Not Released 不释放
      // Released 释放
      // Pending Reserved 准备保留
      // Reserved 保留
      // Sold 卖出
      // SPA Signed 签字
      // SPA Stamp 确认
      // Request Cancel 准备取消
      // Cancel 取消
      // UpDate 上传数据
      let self = this;
      let summaryData = this.processingSummaryData(this.form);
      let buyersData = this.processingBuyersData(this.Buyers);
      if (buyersData.length > 5) {
        // 暂做处理
        buyersData = buyersData.slice(0, 5);
      }
      let NecessaryParameters = {
        unitId: self.unitInfo.unitId,
        projectId: self.unitInfo.projectId,
        recordId: self.blockInfo.recordId
      };
      // console.log(buyersData)
      switch (type) {
        case "NotReleased": // 1
          self.submitFn({ type: 1, ...NecessaryParameters });
          break;
        case "Released": // 8
          self.submitFn({ type: 8, ...NecessaryParameters });
          break;
        case "PendingReserved": // 5
          self.submitFn({
            type: 5,
            ...NecessaryParameters,
            ...summaryData,
            buyerArr: JSON.stringify(buyersData)
          });
          break;
        case "Reserved": // 2
          self.submitFn({
            type: 2,
            ...NecessaryParameters,
            ...summaryData,
            buyerArr: JSON.stringify(buyersData)
          });
          break;
        case "Sold": // 3
          self.submitFn({
            type: 3,
            ...NecessaryParameters,
            ...summaryData,
            buyerArr: JSON.stringify(buyersData)
          });
          break;
        case "SPASigned": // 7
          self.submitFn({
            type: 7,
            ...NecessaryParameters,
            ...summaryData,
            buyerArr: JSON.stringify(buyersData)
          });
          break;
        case "SPAStamp": // 6
          self.submitFn({
            type: 6,
            ...NecessaryParameters,
            ...summaryData,
            buyerArr: JSON.stringify(buyersData)
          });
          break;
        case "RequestCancel": // 9
          self.submitFn({
            type: 9,
            ...NecessaryParameters
          });
          break;
        case "Cancel": // 4
          self.submitFn({
            type: 4,
            ...NecessaryParameters
          });
          break;
        case "UpDate": // 10
          self.submitFn({
            type: 10,
            ...NecessaryParameters,
            ...summaryData,
            buyerArr: JSON.stringify(buyersData)
          });
          break;
      }
    },
    submitFn(data) {
      // 提交方法
      this.$Get(this.$api.addTransaction, data).then(res => {
        if (res.code == 0) {
          this.getUnitTransaction();
          this.getUnitRoleAccess();
          AlertModule.show({
            title: "succeed",
            content: res.msg,
            buttonText: "OK"
          });
          this.queryDocumentsList()
        } else {
          AlertModule.show({
            title: "error",
            content: res.msg,
            buttonText: "OK"
          });
        }
      });
    },
    getUnitRoleAccess() {
      // 获取按钮权限
      this.$Get(this.$api.getUnitRoleAccess, {
        unitId: this.unitInfo.unitId,
        projectId: this.unitInfo.projectId
      }).then(res => {
        if (res.code == 0) {
          this.jurisdictionData = res.datas;
          console.log(this.jurisdictionData);
        }
      });
    },
    findBuery(index) {
      // 开启弹窗，记录数组下标
      this.buyerIsShow = true;
      this.buyerListIndex = index;
    },
    addBuery() {
      this.Buyers.push({
        singaporePR: []
      });
    },
    deleteBuery(index) {
      this.Buyers.splice(index, 1);
    },
    upPdfImg(event, item, index) {
      // 上传合同图片
      let img = event.target.files[0];
      let user = JSON.parse(window.localStorage.getItem("userInfo") || "{}");
      let self = this;
      let formData = new FormData();
      formData.append("type", "transactionImg");
      formData.append("brokeId", user.brokeId);
      formData.append("token", user.token);
      formData.append("agentId", user.agentId);
      formData.append("projectId", self.unitInfo.projectId);
      formData.append("unitId", self.unitInfo.unitId);
      formData.append("file", img);
      this.$PostFormData(this.$api.uploadTransactionFile, formData).then(
        res => {
          if (res.code == 0) {
            let data = {
              docId: item.docId,
              id: item.id,
              projectId: self.unitInfo.projectId,
              unitId: self.unitInfo.unitId,
              recordId: self.blockInfo.recordId,
              url: res.datas.filePath
            };
            self.$Get(self.$api.saveDocumentsUrl, data).then(res => {
              if (res.code == 0) {
                let obj = item;
                obj.url = data.url;
                self.$set(self.DocumentsList.img, index, obj);
                // console.log(data.url)
                console.log(
                  "测试图片1",
                  this.hostUrl + data.url,
                  this.hostUrl + self.DocumentsList.img[index].url
                );
                self.queryDocumentsList();
              }
            });
          }
        }
      );
    },
    queryDocumentsList() {
      // 获取上传合同列表
      this.$Get(this.$api.queryDocumentsList, {
        projectId: this.unitInfo.projectId,
        unitId: this.unitInfo.unitId
      }).then(res => {
        if (res.code == 0) {
          this.DocumentsList["generat"] = [];
          this.DocumentsList["img"] = [];
          for (let i = 0; i < res.datas.length; i++) {
            if (res.datas[i].allowGenerate == 0) {
              this.DocumentsList["generat"].push(res.datas[i]);
            } else {
              this.DocumentsList["img"].push(res.datas[i]);
            }
          }
        }
      });
    },
    examineImg(index, img) {
      // 查看图片
      let originImg = document.querySelectorAll(".testImg")[index];
      let originImgW = originImg.naturalWidth;
      let originImgH = originImg.naturalHeight;
      if (img) {
        this.list[0].src = `${this.hostUrl}${img}?=${Math.random()}`;
        this.list[0].h = originImgH;
        this.list[0].w = originImgW;
        this.$refs.previewer.show(0);
      } else {
        AlertModule.show({
          title: "error",
          content: "no pictures",
          buttonText: "OK"
        });
      }
    },
    pdfShowFn(item) {
      // 查看合同列表
      this.$Get(this.$api.queryDocumentsVersion, {
        docId: item.docId,
        unitId: this.unitInfo.unitId
      }).then(res => {
        if (res.code == 0) {
          this.pdfListData = res.datas;
          if (res.datas.length !== 0) {
            this.pdfListShow = true;
          }
        }
      });
    },
    builderPdf(item) {
      // 生成合同
      let self = this;
      let data = {
        docId: item.docId,
        projectId: self.unitInfo.projectId,
        unitId: self.unitInfo.unitId,
        recordId: self.blockInfo.recordId
      };
      // console.log('111111')
      this.$Get(this.$api.transactionGenerate, data, true).then(res => {
        if (res.code == 0) {
          self.queryDocumentsList();
          AlertModule.show({
            title: "succeed",
            content: res.msg,
            buttonText: "OK"
          });
        } else {
          AlertModule.show({
            title: "error",
            content: res.msg,
            buttonText: "OK"
          });
        }
      });
    },
    pdfLook(url) {
      // 查看PDF
      if (url) {
        let hrefData = this.hostUrl + url;
        openPdf(hrefData);
      } else {
        AlertModule.show({
          title: "error",
          content: "no Data",
          buttonText: "OK"
        });
      }
    }
  }
};
</script>

<style lang="less">
.PdfLst {
  .PdfLstPopup {
    .PdfLstPopupBox {
      .PdfLstPopupBoxList {
        li {
          padding: 0 10px;
          border-bottom: 1px solid #ddd;
        }
        .flex-div {
          padding: 10px 0;
          font-size: 12px;
          button {
            font-size: 12px;
            height: 30px;
            border-radius: 20px;
            width: 80%;
          }
        }
      }
    }
  }
}
.developerSellBlock {
  .developerSellBlock_tab {
    position: relative;
    border-bottom: 1px solid #f4f4f4;
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
  .developerSellBlock_content {
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
    .weui-cells__title {
      margin: 0;
      padding: 10px 15px;
      background: #f4f4f4;
      font-size: 13px;
    }
    .weui-cells {
      font-size: 14px;
    }
    .weui-cell:before,
    .vux-cell-box:not(:first-child):before {
      left: 0;
    }
    .weui-cell {
      padding: 15px;
      .vux-popup-picker-select,
      .weui-cell__ft {
        text-align: left !important;
      }
      .weui-cell__bd {
        color: #999;
      }
    }
    .Summary,
    .Buyer,
    .Documents {
      overflow-y: scroll;
      height: 100%;
    }
    .SellBlockBtns {
      text-align: center;
      padding: 20px 0;
      background: #f4f4f4;
      button {
        height: 35px;
        border-radius: 50px;
        // width: 25%;
        font-size: 12px;
        margin-bottom: 10px;
      }
    }
    .Summary {
      .sellBlock_box_head {
        padding: 1vh 15px;
        h3 {
          color: #333;
          position: relative;
          span {
            font-size: 12px;
            padding: 0px 10px;
            border-radius: 5px;
            color: #fff;
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
        p {
          color: #999;
          font-size: 1.5vh;
          line-height: 1;
        }
      }
      .summaryContent {
        .mint-radiolist-title {
          display: none;
        }
        .mint-cell {
          border-bottom: 1px solid #f4f4f4;
          .mint-radiolist-label {
            padding: 0;
            font-size: 14px;
          }
        }
        .mint-cell:last-child {
          border-bottom: 0;
        }
      }
    }
    .Buyer {
      .BuyersInformation {
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
        .mint-checklist {
          border-top: 1px solid #f4f4f4;
          .mint-checklist-title {
            display: none;
          }
          .mint-cell {
            font-size: 14px;
            .mint-checkbox-label {
              font-size: 14px;
            }
          }
          .mint-cell-wrapper {
            padding: 0 15px;
            .mint-checklist-label {
              padding: 0;
              .mint-checkbox-label {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
    .Documents {
      background: #f4f4f4;
      .imgList {
        background: #fff;
        .imgList_box {
          overflow: hidden;
          border-bottom: 1px solid #f4f4f4;
          .imgList_box_lf,
          .imgList_box_rt {
            float: left;
            height: 50px;
            line-height: 50px;
          }
          .imgList_box_lf {
            width: 60%;
            .imgList_box_lf_box {
              padding-left: 15px;
            }
            h4 {
              font-size: 14px;
              font-weight: 400;
              line-height: 1.3;
              margin-top: 8px;
            }
            p {
              font-size: 12px;
              color: #999;
              line-height: 1.3;
            }
          }
          .imgList_box_rt {
            width: 40%;
            text-align: center;
            span {
              display: inline-block;
              width: 30px;
              height: 30px;
              margin-top: 10px;
              margin-left: 15px;
            }
            .upImg {
              background: url("../../../../assets/images/icon/upImg.png")
                no-repeat 0 0;
              background-size: 100% 100%;
              position: relative;
              input {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                overflow: hidden;
              }
            }
            .LookImg {
              background: url("../../../../assets/images/icon/lookImg.png")
                no-repeat 0 0;
              background-size: 100% 100%;
            }
          }
        }
      }
      .PDFList {
        background: #fff;
        border-bottom: 1px solid #f4f4f4;
        padding: 10px 15px;
        h3 {
          font-size: 15px;
          line-height: 1.3;
        }
        p {
          font-size: 12px;
          color: #999;
        }
        .PDFListBtn {
          text-align: center;
          // margin: 5px 0;
          margin-top: 5px;
          button {
            height: 25px;
            // width: 30%;
            margin-left: 2%;
            border-radius: 30px;
            font-size: 13px;
            background-color: #5160f1;
          }
        }
      }
    }
  }
}
</style>
