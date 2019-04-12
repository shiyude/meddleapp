<template>
  <div class="sellBlock">
    <x-header
      :eft-options.preventGoBack="true"
      :left-options="{backText:''}"
      class="nav_head"
    >{{unitInfo.unitName}}</x-header>
    <div class="sellBlock_box">
      <div class="sellBlock_box_head">
        <h3 class="sellBlock_box_head_h3">
          {{unitInfo.projectName}} - {{unitInfo.unitName}}
          <span
            class="SOLD"
            v-if="TransactionData.purchaseStatus === 'SOLD'"
          >{{TransactionData.purchaseStatus}}</span>
          <span
            class="AVAILABLE"
            v-if="TransactionData.purchaseStatus === 'AVAILABLE'"
          >{{TransactionData.purchaseStatus}}</span>
          <span
            class="NOTRELEASED"
            v-if="TransactionData.purchaseStatus === 'NOT RELEASED'"
          >{{TransactionData.purchaseStatus}}</span>
        </h3>
        <p
          v-if="TransactionData.operateTime&&TransactionData.operateName"
        >{{$t('CreatedBy')}} {{TransactionData.operateName}} {{TransactionData.operateTime}}</p>
      </div>
      <div class="sellBlock_box_conter">
        <group :title="$t('soldByOtherAgency')" label-width="15vh">
          <popup-picker
            :title="$t('SelectAgency')"
            :data="TransactionData.projectBrokeList"
            v-model="form.brokeId"
            :columns="1"
            :show-name="true"
            placeholder
            cancel-text="cancel"
            confirm-text="OK"
          ></popup-picker>
        </group>
        <group :title="$t('transactuibDetatls')" label-width="22vh">
          <mt-radio align="right" v-model="price" :options="priceList"></mt-radio>
          <x-input :disabled="isDisabled" :title="$t('UnitPrice')" v-model="form.transactionPrice"></x-input>
          <datetime :title="$t('Date')" v-model="form.transactionDate"></datetime>
          <x-textarea :max="999" :placeholder="$t('comss')" v-model="form.comment"></x-textarea>
        </group>
      </div>
      <div class="btns" v-if="TransactionData.purchaseStatus === 'AVAILABLE'">
        <mt-button
          class="btnsOne"
          type="primary"
          @click="upDataBtn('NOT RELEASED')"
        >{{$t('notReleased')}}</mt-button>
        <mt-button class="btnsTwo" type="primary" @click="upDataBtn('SOLD')">{{$t('SOLD')}}</mt-button>
      </div>
      <div
        class="btns"
        v-if="TransactionData.purchaseStatus === 'NOT RELEASED' || TransactionData.purchaseStatus === 'SOLD'"
      >
        <mt-button
          class="btnsOne"
          style="background:#12D3B8;"
          @click="upDataBtn('AVAILABLE')"
          type="primary"
        >{{$t('FREEUNIT')}}</mt-button>
        <mt-button class="btnsTwo" @click="upDataBtn('UPDATE')" type="primary">{{$t('UPDATE')}}</mt-button>
      </div>
    </div>
    <toast position="middle" v-model="isTrue" type="text" width="20em">{{errorText}}</toast>
  </div>
</template>

<script>
import { Datetime, PopupPicker, Picker, Toast } from 'vux'
export default {
  name: 'sellBlock',
  components: {
    PopupPicker,
    Picker,
    Datetime,
    Toast
  },
  data() {
    return {
      list1: [],
      priceList: [],
      price: '',
      form: {
        transactionPrice: '',
        transactionDate: '',
        brokeId: [JSON.parse(localStorage.getItem('userInfo')).brokeId],
        comment: ''
      },
      unitInfo: {},
      TransactionData: {},
      isTrue: false,
      errorText: '',
      isDisabled: JSON.parse(localStorage.getItem('userInfo')).icTeam == 1 ? false : true
    }
  },
  watch: {
    price(val) {
      this.form.transactionPrice = val
    }
  },
  mounted() {
    this.unitInfo = this.$route.query
    this.getUnitTransaction()
    // console.log(this.unitInfo)
    this.isTrue = false
  },
  methods: {
    getUnitTransaction() {
      let data = {
        unitId: this.unitInfo.unitId,
        projectId: this.unitInfo.projectId,
        agentId: JSON.parse(localStorage.getItem('userInfo')).agentId
      }
      this.$Get(this.$api.getUnitTransaction, data, true).then(res => {
        if (res.code == 0) {
          this.TransactionData = res.datas
          this.priceList = []
          for (let i = 0; i < res.datas.priceList.length; i++) {
            let data = {
              label: `${res.datas.priceList[i].key} (${res.datas.priceList[i].value})`,
              value: (Math.floor((res.datas.priceList[i].value.replace(/[^0-9.]/ig, "")) * 100) / 100).toString(),
              disabled: res.datas.priceList[i].tran == 1 ? true : false
            }
            this.priceList.push(data)
          }
          // console.log(this.priceList)
          if (this.TransactionData.projectBrokeList) {
            this.TransactionData.projectBrokeList = res.datas.projectBrokeList.map(item => {
              let data = {
                name: item.brokeName,
                value: item.brokeId
              }
              return data
            })
          }
          let priceNum = (Math.floor(this.TransactionData.transactionPrice * 100) / 100).toString()
          this.form = {
            transactionPrice: priceNum == 0 ? '' : priceNum,
            transactionDate: this.TransactionData.transactionDate,
            brokeId: [this.TransactionData.brokeId],
            comment: this.TransactionData.comment
          }
          this.price = priceNum == 0 ? '' : priceNum
          // console.log(this.form.transactionPrice)
          // console.log(this.TransactionData)
        }
      })
    },
    setUpdateInfo() {
      let data = {
        unitId: this.unitInfo.unitId,
        projectId: this.unitInfo.projectId,
        agentId: JSON.parse(localStorage.getItem('userInfo')).agentId,
        transactionPrice: this.form.transactionPrice,
        transactionDate: this.form.transactionDate,
        buyBrokeId: '',
        buyBrokeName: '',
        comment: this.form.comment
      }
      if (this.form.brokeId[0]) {
        data.buyBrokeId = this.form.brokeId[0]
      }
      if (this.form.brokeId[0]) {
        for (let i = 0; i < this.TransactionData.projectBrokeList.length; i++) {
          if (this.form.brokeId[0] === this.TransactionData.projectBrokeList[i].value) {
            data.buyBrokeName = this.TransactionData.projectBrokeList[i].name
          }
        }
      }
      if (this.TransactionData.recordId) {
        data.recordId = this.TransactionData.recordId
      }
      return data
    },
    upDataBtn(type) { // 更新状态
      this.isTrue = false
      let api = this.$api.saveTransaction, info = this.setUpdateInfo()
      if (!info.buyBrokeId && type != 'AVAILABLE') {
        this.isTrue = true
        this.errorText = this.$t('PleaseSelectAnAgent')
      } else if (!info.transactionPrice && type != 'AVAILABLE') {
        this.isTrue = true
        this.errorText = this.$t('PleaseFillInThePrice')
      } else if (!info.transactionDate && type != 'AVAILABLE') {
        this.isTrue = true
        this.errorText = this.$t('PleaseSelectTheTradingTime')
      } else {

        switch (type) {
          case 'NOT RELEASED': // 冻结
            info.purchaseStatus = type
            info.type = 1
            this.postUpdata(api, info, this.$t('notReleased'))
            // console.log('NOT RELEASED',info)
            break
          case 'SOLD': // 卖出
            info.purchaseStatus = type
            info.type = 2
            this.postUpdata(api, info, this.$t('SOLD'))
            // console.log('SOLD',info)
            break
          case 'AVAILABLE': // 释放
            let data = {
              unitId: info.unitId,
              projectId: info.projectId,
              agentId: info.agentId,
              recordId: info.recordId,
              purchaseStatus: 'AVAILABLE',
              type: 3
            }
            api = this.$api.udpateTransaction
            this.postUpdata(api, data, this.$t('FREEUNIT'))
            // console.log('AVAILABLE',data)
            break
          case 'UPDATE': // 更新
            info.purchaseStatus = this.TransactionData.purchaseStatus
            info.type = 4
            api = this.$api.udpateTransaction
            this.postUpdata(api, info, this.$t('UPDATE'))
            // console.log('UPDATE',info)
            break
        }
        // info.purchaseStatus = 'NOT RELEASED'
      }
    },

    postUpdata(api, info, text) {
      this.$Post(api, info, true).then(res => {
        if (res.code == 0) {
          this.isTrue = true
          this.errorText = text
          this.getUnitTransaction()
        }
      })
    },
  }
}
</script>
<style lang="less">
.sellBlock {
  height: 100%;
  .sellBlock_box {
    position: absolute;
    top: 80px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-y: scroll;
    background-color: #f4f4f4;
    .mint-radiolist {
      .mint-radiolist-label {
        padding: 0;
      }
      .mint-radiolist-title {
        display: none;
      }
      .mint-cell:last-child {
        background-image: none;
      }
    }
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
      }
      p {
        color: #999;
        font-size: 1.5vh;
        line-height: 1;
      }
    }
    .weui-cells__title {
      margin-top: 2vh;
      margin-bottom: 2vh;
      font-size: 1.6vh;
    }
    .weui-cell {
      color: #999;
      font-size: 1.8vh;
      padding: 2vh 15px;
      .weui-label {
        color: #000;
      }
    }
    .btns {
      text-align: center;
      margin-top: 5vh;
      margin-bottom: 5vh;
      .btnsOne {
        margin-right: 5vh;
        background-color: #676572;
      }
      .btnsTwo {
        background-color: red;
      }
      .mint-button--normal {
        padding: 0 0;
        width: 18vh;
        border-radius: 4vh;
        font-size: 1.8vh;
        height: 4.5vh;
      }
    }
  }
}
</style>