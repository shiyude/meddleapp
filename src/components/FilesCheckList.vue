<template>
  <div @change="$emit('change', currentValue)" class="FilesCheckList">
    <div v-for="option in options">
      <div class="check_div">
        <div @click="pdfShowFn(option)">
          <h4>{{option.title}}</h4>
          <p>{{option.createTime}}</p>
        </div>
        <label class="check_div_label">
          <span class="mint-checkbox">
            <input
              class="mint-checkbox-input"
              type="checkbox"
              v-model="currentValue"
              :disabled="option.disabled"
              :value="option.value || option"
            >
            <span class="mint-checkbox-core"></span>
          </span>
        </label>
      </div>
    </div>
    <!-- <div v-transfer-dom>
      <popup v-model="pdfShow" height="100%" style="background:#fff;">
        <div class="PdfDiv">
          <group>
            <x-switch :title="pdfText" v-model="pdfShow"></x-switch>
          </group>
          <div class="pdfDivContent">
            <iframe :src="previewUrl" width="100%" height="100%"></iframe>
          </div>
        </div>
      </popup>
    </div>-->
  </div>
</template>

<script>
import { TransferDom, Popup, XSwitch } from 'vux'
import openPdf from '../util/unitDock/pdf';
export default {
  name: 'FilesCheckList',
  directives: {
    TransferDom
  },
  components: {
    Popup,
    XSwitch
  },
  props: {
    max: Number,
    title: String,
    align: String,
    options: {
      type: Array,
      required: true
    },
    value: Array
  },
  data() {
    return {
      currentValue: this.value,
      pdfShow: false,
      pdfText: '',
      url: localStorage.getItem('imgUlr'),
      previewUrl: ''
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    pdfShowFn(info) {
      let url = this.url + info.url
      openPdf(url)
      // this.pdfText = info.title
      // this.pdfShow = true
      // this.previewUrl = this.url + info.url
      // console.log(info.title)
      // this.$router.push({
      //   path: '/PDFpage',
      //   query: {
      //     text: info.title,
      //     PDFUrl: this.url + info.url
      //   }
      // })
    }
  }
};
</script>

<style lang="less">
.FilesCheckList {
  .check_div {
    padding: 1vh 8vh 1vh 6vh;
    border-bottom: 1px solid #ddd;
    position: relative;
    h4 {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0px;
    }
    p {
      color: #999;
      font-size: 12px;
    }
    .check_div_label {
      position: absolute;
      right: 3vh;
      top: 50%;
      margin-top: -15px;
    }
  }
  .check_div::after {
    content: " ";
    position: absolute;
    width: 3vh;
    height: 3vh;
    content: "";
    top: 50%;
    margin-top: -1.5vh;
    background: url("../assets/images/icon/file_icon.png") no-repeat 0 0;
    background-size: 100% 100%;
    left: 2vh;
  }
}
</style>
