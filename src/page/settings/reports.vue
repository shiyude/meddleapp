<template>
  <div class="reports">
    <x-header :eft-options.preventGoBack="true" :left-options="{backText:''}" class="nav_head">{{$t('reports')}}
    </x-header>
    <div class="content">
      <div class="title">{{$t('projectList')}}</div>
      <group>
        <cell-box is-link v-for="item in reportList" :key="item">
         {{item.name}}
        </cell-box>
      </group>
    </div>
  </div>
</template>
<script>
export default {
  name: "reports",
  data() {
    return {
      reportList: [
        { name: "10 EVELYN" },
        { name: "555 COLINS" },
        { name: "8 FARRER SUITES" },
        { name: "8 HULLT" },
        { name: "8 ST THOMAS" }
      ]
    };
  }
};
</script>
<style lang="less">
.reports {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .content {
    position: absolute;
    top: 80px;
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
    .weui-cells {
      margin-top: 0;
    }
    .weui-cell_access.vux-cell-box {
      padding: 2vh 2.5vh;
      font-size: 1.8vh;
      font-weight: 600;
    }
    .weui-cell:before {
      left: 0;
    }
  }
}
</style>


