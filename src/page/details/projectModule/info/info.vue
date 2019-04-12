<template>
  <div class="info" v-if="detailsInfo">
    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('Developer')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.developer}}</div>
      </flexbox-item>
    </flexbox>

    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('Type')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.projectType}}</div>
      </flexbox-item>
    </flexbox>

    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('TotalUnits')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.unitsNum}}</div>
      </flexbox-item>
    </flexbox>

    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('ExpTop')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.expTop}}</div>
      </flexbox-item>
    </flexbox>

    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('Address')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.streetAddress}}</div>
      </flexbox-item>
    </flexbox>

    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('Location')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.location}}</div>
      </flexbox-item>
    </flexbox>

    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('Country')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.country}}</div>
      </flexbox-item>
    </flexbox>

    <flexbox class="info_box">
      <flexbox-item :span="3">
        <div class="info_lf">{{$t('Tenure')}}</div>
      </flexbox-item>
      <flexbox-item>
        <div class="info_rt">{{detailsInfo.tenure}}</div>
      </flexbox-item>
    </flexbox>
    <template>
      <flexbox class="info_box" v-for="(item,k) in detailsInfo.customs" :key="k">
        <flexbox-item :span="3">
          <div class="info_lf">{{item.key}}</div>
        </flexbox-item>
        <flexbox-item>
          <div class="info_rt">{{item.value}}</div>
        </flexbox-item>
      </flexbox>
    </template>

    <div class="info_text">
      <h3>{{$t('DESCRIPTION')}}</h3>
      <p v-html="detailsInfo.description"></p>
    </div>
  </div>
</template>

<script>
export default {
  nama: "info",
  props: {
    detailsInfo: {
      type: Object
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less">
.info {
  height: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  overflow-y: scroll;
  .info_box {
    border-bottom: 1px solid #ddd;
    padding: 1vh 0;
  }
  .info_box:last-child {
    border-bottom: 0;
  }
  .info_lf {
    font-size: 1.8vh;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
  }
  .info_rt {
    font-size: 1.8vh;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #666;
  }
  .info_text {
    margin-top: 2vh;
    h3 {
      margin-bottom: 1vh;
      font-size: 2.2vh;
      color: #666;
    }
    p {
      color: #999;
      word-wrap: break-word;
      word-break: normal;
      font-size: 1.8vh;
    }
    img{
      width: 100%;
    }
  }
}
</style>