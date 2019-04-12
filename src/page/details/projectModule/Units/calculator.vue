<template>
  <div class="calculator">
    <div>
      <x-header
        :eft-options.preventGoBack="true"
        :left-options="{backText:''}"
        class="nav_head"
      >{{$t('Calculator')}}</x-header>
      <x-input
        type="number"
        class="totalPriceInput"
        :title="$t('PurchasePrice')"
        v-model="totalPrice"
      ></x-input>
      <mt-navbar class="navList" v-model="selected">
        <mt-tab-item id="Mortgage">{{$t('Mortgage')}}</mt-tab-item>
        <mt-tab-item id="PaymentSchedule">{{$t('PaymentSchedule')}}</mt-tab-item>
        <mt-tab-item id="Currency">{{$t('Currency')}}</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="calculator_content">
      <mt-tab-container v-model="selected">
        <mt-tab-container-item class="Mortgage" id="Mortgage">
          <div class="MortgageInput">
            <x-input
              label-width="150px"
              @on-blur="isPositiveInteger('loan')"
              type="number"
              :title="$t('Loan')"
              v-model="Loan"
            ></x-input>
            <x-input
              label-width="150px"
              type="number"
              disabled
              :title="$t('LoanAmount')"
              v-model="LoanAmount"
            ></x-input>
            <x-input
              label-width="150px"
              type="number"
              :title="$t('LoanTenure')"
              v-model="LoanTenure"
              @on-blur="isPositiveInteger('yrs')"
            ></x-input>
            <x-input
              label-width="150px"
              type="number"
              :title="$t('InterestRate')"
              v-model="InterestRate"
            ></x-input>
            <x-input
              class="MonthlyPayment"
              label-width="150px"
              :title="$t('MonthlyPayment')"
              :placeholder="$t('CalculateToGet')"
              disabled
              v-model="MonthlyPayment"
            ></x-input>
          </div>
          <group class="Obligation" :title="$t('TDSR')">
            <x-input type="number" v-model="Obligation" :placeholder="$t('MonthlyDebt')"></x-input>
            <x-input
              label-width="230px"
              v-model="income"
              disabled
              :title="$t('MinimunHousehold')"
              type="number"
              placeholder
            ></x-input>
          </group>
          <div class="MortgageBtn">
            <mt-button type="primary" @click="MortgageFn">{{$t('Calculate')}}</mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="PaymentSchedule" class="PaymentSchedule">
          <div class="popupPicker">
            <popup-picker
              :title="$t('Residency')"
              :data="Residency"
              @on-change="setABSDNum"
              v-model="ResidencyVal"
              cancel-text="cancel"
              confirm-text="OK"
            ></popup-picker>
            <popup-picker
              :title="$t('PropertyProfile')"
              :data="PropertyProfile"
              @on-change="setABSDNum"
              v-model="PropertyProfileVal"
              cancel-text="cancel"
              confirm-text="OK"
            ></popup-picker>
          </div>
          <group :title="$t('Payment') + ' - 1'">
            <cell-box>{{$t('PaymentTxt1')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.05)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 2'">
            <cell-box>{{$t('PaymentTxt2')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.15)}}</cell-box>
            <cell-box>{{$t('BSD')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.0246)}}</cell-box>
            <cell-box>{{$t('ABSD')}}</cell-box>
            <cell-box class="num_payment">{{ABSD}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 3'">
            <cell-box>{{$t('PaymentTxt3')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.1)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 4'">
            <cell-box>{{$t('PaymentTxt4')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.1)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 5'">
            <cell-box>{{$t('PaymentTxt5')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.05)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 6'">
            <cell-box>{{$t('PaymentTxt6')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.05)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 7'">
            <cell-box>{{$t('PaymentTxt7')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.05)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 8'">
            <cell-box>{{$t('PaymentTxt8')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.05)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 9'">
            <cell-box>{{$t('PaymentTxt9')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.25)}}</cell-box>
          </group>
          <group :title="$t('Payment') + ' - 10'">
            <cell-box>{{$t('PaymentTxt10')}}</cell-box>
            <cell-box class="num_payment">{{parseInt(Number(totalPrice) * 0.15)}}</cell-box>
          </group>
        </mt-tab-container-item>
        <mt-tab-container-item id="Currency" class="Currency">
          <group label-width="8em">
            <cell
              v-for="(item,index) in ExchangeData"
              :key="index"
              primary="content"
              :title="item.type"
              value-align="left"
              :value="parseInt(item.value * totalPrice)"
            ></cell>
          </group>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { PopupPicker } from 'vux'
export default {
  data() {
    return {
      selected: 'Mortgage',
      totalPrice: undefined, // 总价
      Loan: undefined, // 贷款比例
      LoanAmount: 0, // 贷款总额
      LoanTenure: undefined,
      InterestRate: undefined,
      MonthlyPayment: undefined,
      Obligation: undefined,
      income: undefined,
      Residency: [[this.$t('Singaporean'), this.$t('PermanentResident'), this.$t('Foreigner')]],
      ResidencyVal: [this.$t('Singaporean')],
      PropertyProfile: [[this.$t('1st'), this.$t('2nd'), this.$t('3rdPropertyOrMore')]],
      PropertyProfileVal: [this.$t('1st')],
      ABSD: 0, // 额外买家印花税 
      ExchangeData: [],
      currencyArr: [
        'MYR',
        'USD',
        'AUD',
        'CNY',
        'HKD',
        'THB',
        'IDR',
        'JPY',
        'VND'
      ]
    }
  },
  components: {
    PopupPicker
  },
  watch: {
    Loan(val) { // 自动计算贷款总额
      if (this.totalPrice) {
        this.LoanAmount = Math.ceil(Number(this.totalPrice) * (Number(val) / 100))
      }
    },
    totalPrice(val) { // 自动计算贷款总额
      if (this.Loan) {
        this.LoanAmount = Math.ceil(Number(val) * (Number(this.Loan) / 100))
      }
    }
  },
  mounted() {
    this.totalPrice = this.$route.query.totalPrice
    this.getExchange()
  },
  methods: {
    getExchange() {
      let self = this
      this.$Get(this.$api.getExchange, { from: 'SGD' }).then(res => {
        if (res.code == 0) {
          let arr = []
          for (let i = 0; i < self.currencyArr.length; i++) {
            for (let item in res.datas) {
              if (self.currencyArr[i] === item) {
                arr.push({
                  type: item,
                  value: res.datas[item]
                })
              }
            }
          }
          this.ExchangeData = arr
        }
      })
    },
    setABSDNum() {
      let type = this.ResidencyVal[0]
      let Ploidy = this.PropertyProfileVal[0], self = this
      let Singaporean = self.$t('Singaporean'),
        PermanentResident = self.$t('PermanentResident'),
        Foreigner = self.$t('Foreigner'),
        OneSt = self.$t('1st'),
        TowNd = self.$t('2nd'),
        ThreeRdPropertyOrMore = self.$t('3rdPropertyOrMore')
      switch (type) {
        case Singaporean:
          switch (Ploidy) {
            case OneSt:
              self.ABSD = 0
              break;
            case TowNd:
              self.ABSD = parseInt(Number(self.totalPrice) * 0.12)
              break;
            case ThreeRdPropertyOrMore:
              self.ABSD = parseInt(Number(self.totalPrice) * 0.15)
              break;
          }
          break;

        case PermanentResident:
          switch (Ploidy) {
            case OneSt:
              self.ABSD = parseInt(Number(self.totalPrice) * 0.05)
              break;
            case TowNd:
            case ThreeRdPropertyOrMore:
              self.ABSD = parseInt(Number(self.totalPrice) * 0.15)
              break;
          }
          break;
        case Foreigner:
          self.ABSD = parseInt(Number(self.totalPrice) * 0.2)
          break;
      }
    },
    MortgageFn() {
      let self = this,
        totalPrice = Number(self.totalPrice), // 总价
        Loan = Number(self.Loan) / 100, // 贷款比例
        LoanAmount = Number(self.LoanAmount), // 贷款金额
        LoanTenure = Number(self.LoanTenure) * 12, // 贷款期数
        InterestRate = Number(self.InterestRate) / 100, // 贷款利率
        Obligation = Number(self.Obligation) // 其他偿还义务
      if (totalPrice && Loan && LoanAmount && LoanTenure && InterestRate) {

        /* 公式举例：贷款80万，年利率1%，贷30年计算每月还款如下：
          80w * (1% / 12) *  [ (1 + 1% / 12)^360 ]   /  [ (1 + 1% / 12) ^ 360   - 1 ] = 2573.12  
        */

        self.MonthlyPayment = (LoanAmount * (InterestRate / 12) *
          Math.pow((1 + InterestRate / 12), LoanTenure) /
          (Math.pow((1 + InterestRate / 12), LoanTenure) - 1)).toFixed(2)
        if (Obligation) {
          self.income = ((Obligation + Number(self.MonthlyPayment)) / 0.6).toFixed(2)
        }
      } else {
        Toast({
          message: self.$t('PleaseInfoRemind'),
          duration: 1000
        })
      }
    },
    isPositiveInteger(type) { // 年和贷款比例只允许正整数
      switch (type) {
        case 'loan':
          if (this.Loan)
            this.Loan = parseInt(this.Loan)
          break
        case 'yrs':
          if (this.LoanTenure)
            this.LoanTenure = parseInt(this.LoanTenure)
          break
      }
    }
  }
}
</script>
<style lang="less">
.calculator {
  background-color: #f4f4f4;
  .totalPriceInput {
    padding: 0 15px;
    height: 40px;
    background-color: #fff;
    .weui-cell__hd {
      font-size: 13px;
      color: #999;
    }
  }
  .totalPriceInput.weui-cell:before {
    top: auto;
    bottom: 0;
    left: 0;
  }
  .navList {
    // box-shadow: 0 0 15px #999;
    .mint-tab-item {
      padding: 0;
      height: 40px;
      color: #999;
      .mint-tab-item-label {
        line-height: 40px;
      }
    }
    .mint-tab-item.is-selected {
      color: #000;
      border-bottom: 2px solid #000;
    }
  }
  .calculator_content {
    position: absolute;
    top: 162px;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 20px;
    overflow-y: scroll;
    .Mortgage {
      .weui-cell {
        padding: 0 15px;
        height: 50px;
      }
      .Obligation {
        .weui-cell__hd {
          font-size: 12px;
        }
        .weui-cell__bd {
          font-size: 13px;
        }
        .vux-x-input.disabled .weui-input {
          -webkit-text-fill-color: #000;
          font-weight: 600;
        }
        .weui-cell:before {
          bottom: auto;
          top: 0;
        }
      }
      .MortgageInput {
        background-color: #fff;
        .weui-cell:before {
          top: 0;
          bottom: auto;
          left: 0;
        }
        .weui-cell {
          .weui-cell__hd {
            color: #999;
            font-size: 13px;
          }
        }
        .MonthlyPayment {
          font-weight: 600;
          .weui-cell__hd {
            color: #000;
          }
        }
        .MonthlyPayment.vux-x-input.disabled .weui-input {
          -webkit-text-fill-color: #000;
          font-weight: 600;
        }
      }
      .MortgageBtn {
        text-align: center;
        margin: 30px 0;
        button {
          width: 60%;
          border-radius: 20px;
        }
      }
    }
    .PaymentSchedule {
      // background-color: #fff;
      .weui-cells,
      .popupPicker {
        background-color: #fff;
      }
      .vux-cell-box:not(:first-child):before {
        left: 0;
      }
      .weui-cell__hd {
        font-size: 13px;
        color: #999;
      }
      .weui-cell {
        font-size: 13px;
      }
      .num_payment {
        color: #5160f1;
        font-weight: 600;
        font-size: 14px;
      }
      .weui-cells__title {
        // background: #f4f4f4;
      }
    }
    .Currency {
      .weui-cells {
        margin-top: 0;
        font-size: 13px;
      }
      .weui-cell {
        padding: 15px;
        .vux-cell-bd {
          color: #999;
        }
        .weui-cell__ft {
          color: #000;
        }
      }
      .weui-cell:before {
        left: 0;
      }
    }
  }
}
</style>
