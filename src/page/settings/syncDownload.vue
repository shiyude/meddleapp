<template>
  <div class="sync_download">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">SYNC / DOWNLOAD</x-header>
    <div class="content">
      <div class="tab">
        <tab active-color="#000" :line-width="2" v-model="initIndex">
          <tab-item>DOWNLOAD</tab-item>
          <tab-item>SETTING</tab-item>
        </tab>
      </div>
      <div class="tab_content">
        <div class="download" v-show="initIndex == 0">
          <div class="title">
            PROJECT LIST
          </div>
          <div class="project_list">
            <div class="project_item" v-for="item in projectList">
              <div class="project_name">{{item.name}}</div>
              <div class="project_btn">
                <template v-if="item.type==1">
                  <x-button mini plain type="primary" class="blue_btn">Download</x-button>
                </template>
                <template v-else>
                  <x-button mini plain type="primary" class="blue_btn">Update</x-button>
                  <x-button mini plain type="warn">GO Online</x-button>
                </template>
              </div>
            </div>

          </div>
          <div class="download_btn">
            <x-button class="btns">Option</x-button>
          </div>
        </div>
        <div class="setting" v-show="initIndex == 1">
          <div class="title">
            AUTO DATA SYNC
          </div>
          <div class="auto_sync">
            <div class="auto_sync_left">
              <div>DisableAutoData Sync</div>
              <p>Enabling this setting will allow project data to auto update in background</p>
            </div>
            <div class="auto_sync_right">
              <x-switch v-model="xxx" class="smpt_switch" title=""></x-switch>
            </div>
          </div>
          <div class="setting_btn">
            <x-button class="btns">Save</x-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XSwitch } from "vux";
export default {
  name: "syncDownload",
  components: {
    XSwitch
  },
  data() {
    return {
      initIndex: 0,
      xxx: false,
      projectList: [
        { name: "10 EVELYN", type: 1 },
        { name: "555 COLINS", type: 2 },
        { name: "8 FARRER SUITES", type: 2 },
        { name: "8 HULLT", type: 1 },
        { name: "8 ST THOMAS", type: 2 }
      ]
    };
  }
};
</script>
<style lang="less">
.sync_download {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .content {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    .tab_content {
      position: absolute;
      top: 44px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
      .title {
        padding: 1vh;
        font-size: 1.4vh;
        color: #768492;
        padding-left: 2.5vh;
        background-color: #f4f6f9;
      }
      .download {
        min-height: 100%;
        position: relative;
        padding-bottom: 90px;
        box-sizing: border-box;
        .project_list {
          .project_item {
            &::after {
              display: table;
              content: "";
              clear: both;
            }
            padding: 2vh 2.5vh;
            background-color: #fff;
            border-bottom: 2px solid #f4f6f9;
            .project_name {
              font-size: 1.6vh;
              font-weight: 600;
              float: left;
              width: 35%;
              line-height: 2.3;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .project_btn {
              float: left;
              width: 65%;
              text-align: right;
              .blue_btn{
                color:#84A4F5;
                // border:#84A4F5;
                border-color:#84A4F5;
              }
              .weui-btn + .weui-btn {
                margin-top: 0;
              }
              .weui-btn_mini {
                font-size: 1.4vh;
                padding: 0 1.5vh;
              }
              .weui-btn_plain-warn {
                &::before {
                  content: "x";
                }
              }
            }
          }
        }
        .download_btn {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          .btns {
            width: 70%;
            background: -moz-linear-gradient(left, #49ccfa 0%, #5160f1 100%);
            background: -webkit-linear-gradient(left, #49ccfa 0%, #5160f1 100%);
            background: -o-linear-gradient(
              left,
              #49ccfa 0%,
              #5160f1 100%
            ) !important;
            background: -ms-linear-gradient(left, #49ccfa 0%, #5160f1 100%);
            background: linear-gradient(to right, #49ccfa 0%, #5160f1 100%);
            border-radius: 50px;
            color: #fff;
            font-size: 1.6vh;
            line-height: 3.2;
          }
        }
      }
      .setting {
        min-height: 100%;
        position: relative;
        background-color: #f4f6f9;
        .auto_sync {
          padding: 2vh 2.5vh;
          background-color: #fff;
          &::after {
            content: "";
            display: table;
            clear: both;
          }
          .auto_sync_left {
            float: left;
            width: 80%;
            div {
              font-size: 2vh;
              font-weight: 600;
            }
            p {
              font-size: 1.6vh;
              color: #999;
            }
          }
          .auto_sync_right {
            float: left;
            width: 20%;
            text-align: right;
            .weui-switch:checked,
            .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
              border-color: #49ccfa;
              background-color: #49ccfa;
            }
          }
        }
        .setting_btn {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          .btns {
            width: 40%;
            background-color: #43d4ba;
            border-radius: 50px;
            color: #fff;
            font-size: 1.6vh;
            line-height: 3.2;
          }
        }
      }
    }
  }
}
</style>


