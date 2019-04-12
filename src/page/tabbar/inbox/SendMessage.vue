<template>
  <div class="SendMessage">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">
      {{$t('messageSet')}}
      <!-- <span slot="right">Preview</span> -->
    </x-header>
    <div class="SendMessage_continer">
      <group label-width="5em">
        <popup-picker
          :title="$t('Project')"
          :data="projectList"
          v-model="projectId"
          :columns="1"
          :show-name="true"
          value-text-align="center"
          cancel-text="cancel"
          confirm-text="OK"
          :placeholder="$t('SelectItem')"
        ></popup-picker>
        <popup-picker
          :title="$t('Audience')"
          :data="AudienceList"
          :show-name="true"
          :columns="1"
          v-model="Audience"
          value-text-align="center"
          cancel-text="cancel"
          confirm-text="OK"
          :placeholder="$t('SelectPermissions')"
        ></popup-picker>
        <x-input  :title="$t('Title')" :placeholder="$t('Title')" v-model="titleVal"></x-input>
        <x-textarea
          name="description"
          :placeholder="$t('details')"
          :show-counter="false"
          :height="300"
          v-model="textareaVal"
        ></x-textarea>
      </group>
      <div class="SendBtn_box">
        <mt-button class="SendBtn" @click="postMessage">
          <img src="@/assets/images/icon/postSend.png" height="20" width="20" slot="icon">
          {{$t('POST')}}
        </mt-button>
      </div>
    </div>
    <toast position="middle" v-model="isToast" type="text" width="20em">{{errorText}}</toast>
  </div>
</template>
<script>
import { AlertModule } from 'vux'
import { PopupPicker, Toast } from 'vux'
export default {
  name: 'SendMessage',
  components: {
    PopupPicker,
    Toast
  },
  data() {
    return {
      projectList: [],
      projectId: [],
      AudienceList: [{
        name: 'Internal Only',
        value: '1',

      }, {
        name: 'Co-Broke Only',
        value: '2',

      }, {
        name: 'Internal & Co-Broke',
        value: '3',

      }],
      Audience: [],
      errorText: '',
      isToast: false,
      titleVal: '',
      textareaVal: ''
    }
  },
  mounted() {
    this.getProjectList()
  },
  methods: {
    getProjectList() {
      this.$Get(this.$api.queryBrokeProject, { type: 2 }).then(res => {
        if (res.code == 0) {
          if (res.datas) {
            this.projectList = res.datas.map(item => {
              let data = {
                name: item.projectName,
                value: item.projectId
              }
              return data
            })
          }
        }
      })
    },
    postMessage() {
      if (!this.projectId.length) {
        this.isToast = true
        this.errorText = this.$t('SelectItem')
      } else if (!this.Audience.length) {
        this.isToast = true
        this.errorText = this.$t('SelectPermissions')
      } else if (!this.titleVal) {
        this.isToast = true
        this.errorText = this.$t('FillInTheTitle')
      } else if (!this.textareaVal) {
        this.errorText = this.$t('fillInTheContent')
        this.isToast = true
      } else {
        let data = {
          audience: this.Audience[0],
          projectId: this.projectId[0],
          content: this.textareaVal,
          title: this.titleVal
        }
        let self = this
        this.$Post(this.$api.sendInBox, data).then(res => {
          if (res.code == 0) {
            AlertModule.show({
              title: self.$t('sendSuccessfully'),
              buttonText: 'OK',
              onHide() {
                self.Audience = []
                self.projectId = []
                self.textareaVal = ''
                self.titleVal = ''
                self.$router.go(-1)
              }
            })
            console.log(res)
          }
        })
        this.isToast = false
      }
    }
  },
}
</script>
<style lang="less">
.SendMessage {
  height: 100%;
  .SendMessage_continer {
    position: absolute;
    top: 80px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-y: scroll;
    .vux-no-group-title {
      margin-top: 0;
    }
    .vux-cell-box:not(:first-child):before,
    .weui-cells:before,
    .weui-cells:after,
    .weui-cell:before {
      display: none;
    }
    .weui-cell {
      border-bottom: 1px solid #f4f4f4;
      padding: 15px;
      .vux-cell-value {
        color: #333;
      }
      .weui-label {
        color: #999;
      }
    }
    .SendBtn_box {
      text-align: center;
      margin: 30px 0;
    }
    .SendBtn {
      background: #5160f1;
      color: #ddd;
      font-size: 16px;
      width: 60%;
      border-radius: 5vh;
    }
    .weui-cell_access .weui-cell__ft:after {
      border-width: 0 2px 2px 0;
    }
  }
}
</style>