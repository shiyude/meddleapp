<template>
  <div class="language">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">
      {{$t('language')}}
      <!-- <a class="header_right" slot="right">{{$t('save')}}</a> -->
    </x-header>
    <div class="content">
      <group :title="$t('changeLanguage')">
        <radio :options="languageList" @on-change="change" v-model="language"></radio>
      </group>
    </div>
  </div>
</template>
<script>
import alert from "@/components/alert";
import { Radio, AlertModule } from "vux";
export default {
  name: "language",
  components: {
    Radio
  },
  data() {
    return {
      language: this.$t('ENGLISH'),
      languageList: [
        this.$t('ENGLISH'),
        this.$t('CHINESE')
      ]
    };
  },
  created() {
    let lang = localStorage.getItem('lang')
    if (lang) {
      switch (lang) {
        case 'en':
          this.language = this.$t('ENGLISH')
          break;

        case 'zh':
          this.language = this.$t('CHINESE')
          break;
      }
    }
  },
  methods: {
    change(value, label) {
      let self = this
      localStorage.setItem('cutLan','1')
      switch (value) {
        case this.$t('ENGLISH'):
          this.$setLang('en')
          // AlertModule.show({
          //   title: self.$t('SwitchSuccess'),
          //   buttonText: self.$t('sure'),
          //   onHide() {
          //     self.$router.back()
          //   }
          // })
          break;

        case this.$t('CHINESE'):
          this.$setLang('zh')
          // AlertModule.show({
          //   title: self.$t('SwitchSuccess'),
          //   buttonText: self.$t('sure'),
          //   onHide() {
          //     self.$router.back()
          //   }
          // })
          break;
      }
    }
  }
};
</script>
<style lang="less">
.language {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .header_right {
    // padding-top: 25px;
    color: #fff;
  }
  .content {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    .weui-cells__title {
      margin: 0;
      padding: 1vh;
      font-size: 1.4vh;
      color: #768492;
      padding-left: 2.5vh;
      background-color: #f4f6f9;
    }
    .weui-cell {
      font-size: 2vh;
      padding: 2vh 2.5vh;
      font-weight: 600;
      &::before {
        left: 0;
      }
    }
    .weui-cells_radio .weui-check:checked + .weui-icon-checked:before {
      color: #5c7be7;
    }
  }
}
</style>


