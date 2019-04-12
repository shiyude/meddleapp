<template>
  <div class="myFile">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">
      {{$t('myFile')}}
      <span class="upload_img" slot="right" @click="actionsheetShow = true"></span>
    </x-header>
    <div class="content">
      <swipeout v-if="fileList.length">
        <swipeout-item v-for="(v,k) in fileList" :key="k">
          <div slot="right-menu">
            <swipeout-button background-color="#EC7063" @click.native="deleteFile(v)">{{$t('delete')}}</swipeout-button>
          </div>
          <div slot="content" class="text_content" @click="pdfShowFn(k,v)">
            <template v-if="v.fileType == 'image'">
              <img :src="url+v.url" class="none_file">
            </template>
            <template v-else>
              <span class="none_file"></span>
            </template>
            <div class="check_div">
              <div>
                <h4>{{v.title}}</h4>
                <p>{{v.createTime}}</p>
              </div>
            </div>
          </div>

        </swipeout-item>
      </swipeout>
      <alert v-if="fileList.length === 0" :alertConfig="alertConfig"></alert>
    </div>
    <div>
      <previewer ref="previewer" :list="list"></previewer>
    </div>
    <input type="file" accept="image/*,.pdf" id="imgToPdfFile" style="display:none" @change="fileChange" multiple>
    <actionsheet v-model="actionsheetShow" :menus="menus" show-cancel :cancel-text="$t('Cancel')" @on-click-menu-upload="onUpload"></actionsheet>
  </div>
</template>
<script>
import {
  Actionsheet,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  Previewer
} from "vux";
import alert from "@/components/alert.vue";
import openPdf from "../../util/unitDock/pdf";
export default {
  name: "myFile",
  components: {
    Actionsheet,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    alert,
    Previewer
  },
  data() {
    return {
      actionsheetShow: false,
      menus: {
        upload: this.$t("ChooseFile")
      },
      fileList: [],
      list: [
        {
          src: ""
        }
      ],
      url: localStorage.getItem("imgUlr"),
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  mounted() {
    this.getFileList();
  },
  methods: {
    pdfShowFn(k, info) {
      let fileType = info.url.split(".")[1];
      let url = this.url + info.url;
      if (fileType.toLowerCase() == "pdf") {
        openPdf(url);
      } else {
        let originImg = document.querySelectorAll(".none_file")[k];
        let originImgW = originImg.naturalWidth;
        let originImgH = originImg.naturalHeight;
        this.list[0].src = `${url}?=${Math.random()}`;
        this.list[0].h = originImgH;
        this.list[0].w = originImgW;
        this.$refs.previewer.show(0);
      }
    },
    deleteFile(v) {
      this.$Get(this.$api.delAgentFile, { id: v.id }, true).then(res => {
        if (res.code == 0) {
          this.getFileList();
          this.$Post(this.$api.deleteFile, {
            path: v.url
          });
        } else {
          this.$vux.toast.show({
            text: "Fail",
            type: "cancel"
          });
        }
      });
    },
    fileChange() {
      let files = document.getElementById("imgToPdfFile").files[0];
      if (files.size / 1024 / 1024 > 5) {
        this.$vux.toast.show({
          text: this.$t("Filesthan5M"),
          type: "text"
        });
        return;
      }
      let formData = new FormData();
      let userInfo = JSON.parse(
        window.localStorage.getItem("userInfo") || "{}"
      );
      formData.append("agentId", userInfo.agentId);
      formData.append("brokeId", userInfo.brokeId);
      formData.append("token", userInfo.token);
      formData.append("file", document.getElementById("imgToPdfFile").files[0]);
      this.$PostFormData(this.$api.uploadAgentFiles, formData).then(res => {
        if (res.code == 0) {
          this.getFileList();
        } else {
          this.$vux.toast.show({
            text: "Fail",
            type: "cancel"
          });
        }
      });
    },
    onUpload() {
      document.getElementById("imgToPdfFile").value = "";
      document.getElementById("imgToPdfFile").click();
    },
    getFileList() {
      this.$Get(this.$api.queryAgentFiles, {}, true).then(res => {
        if (res.code == 0) {
          for (let i = 0; i < res.datas.length; i++) {
            let fileType = res.datas[i].url.split(".")[1];
            if (fileType.toLowerCase() == "pdf") {
              res.datas[i].fileType = "pdf";
            } else {
              res.datas[i].fileType = "image";
            }
          }
          this.fileList = res.datas;
        }
      });
    }
  }
};
</script>
<style lang="less">
.myFile {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .upload_img {
    width: 25px;
    height: 25px;
    display: inline-block;
    background: url("../../assets/images/icon/upload.png") no-repeat 0 0;
    background-size: contain;
  }
  .content {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    .none_file {
      display: none;
    }
    .text_content {
      .check_div {
        padding: 1vh 8vh 1vh 6vh;
        border-bottom: 1px solid #ddd;
        position: relative;
        &::after {
          content: " ";
          position: absolute;
          width: 3vh;
          height: 3vh;
          content: "";
          top: 50%;
          margin-top: -1.5vh;
          background: url("../../assets/images/icon/file_icon.png") no-repeat 0
            0;
          background-size: 100% 100%;
          left: 2vh;
        }
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
    }
  }
}
</style>


