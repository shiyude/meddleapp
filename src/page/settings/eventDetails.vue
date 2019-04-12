<template>
  <div class="event_details">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">{{$t('eventDetails')}}</x-header>
    <div class="event_content">
      <div v-if="detailsData">
        <div class="event_desc">
          <div class="event_title">
            {{detailsData.title}}
          </div>
          <div class="event_time">
            <p>{{detailsData.calendarDate}}</p>
            <p>{{$t('From')}} {{detailsData.startTime}} {{$t('to')}} {{detailsData.endTime}}</p>
          </div>
        </div>
        <div class="event_text">
          <div class="text_note">{{$t('Note')}}</div>
          <div class="text">{{detailsData.content}}</div>
        </div>
        <div class="event_location">
          <div class="text_note">{{$t('Location')}}</div>
          <div class="text">{{detailsData.address}}</div>
        </div>
        <!-- <div class="btn">
          <div>{{$t('ADDTOPHONECALENDER')}}</div>
        </div> -->
      </div>
      <alert v-else :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>
<script>
import alert from "@/components/alert.vue";
export default {
  name: "eventDetails",
  components: {
    alert
  },
  data() {
    return {
      detailsData: "",
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      }
    };
  },
  mounted() {
    let id = this.$route.query.id;
    this.getDetails(id);
  },
  methods: {
    getDetails(id) {
      this.$Get(this.$api.queryCalendarDetail, { id: id }, true).then(res => {
        if (res.code == 0) {
          this.detailsData = res.datas;
        }
      });
    }
  }
};
</script>
<style lang="less">
.event_details {
  height: 100%;
  background: #fff;
  width: 100%;
  overflow: hidden;
  .event_content {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    & > div > div {
      padding: 20px 20px;
      border-bottom: 1px solid #ddd;
    }
    .event_desc {
      .event_title {
        font-size: 3.5vh;
        font-weight: 600;
        word-break: break-all;
      }
      .event_time {
        font-size: 2vh;
        color: #999;
        p {
          word-break: break-all;
        }
      }
    }
    .text_note {
      font-size: 2.2vh;
      font-weight: 600;
    }
    .text {
      font-size: 2vh;
      color: #999;
      word-break: break-all;
    }
    .event_location {
    }
    .btn {
      border: none;
      div {
        background-color: #ee4679;
        color: #eee;
        width: 37vh;
        border-radius: 5vh;
        font-size: 2vh;
        height: 5.5vh;
        margin: 0 auto;
        text-align: center;
        line-height: 5.5vh;
      }
    }
  }
}
</style>


