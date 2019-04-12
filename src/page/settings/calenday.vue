<template>
  <div class="calenday_wrapper">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">{{$t('Calenday')}}</x-header>
    <div class="calenday_content">
      <Calendar @choseDay="clickDay" @changeMonth="changeDate" :agoDayHide="agoDayHide" :textTop="topText" :sundayStart="true" :markDateMore="markDateMore"></Calendar>
      <div class="event_lists">
        <div class="event_item" v-for="(v,k) in eventLists" @click="toDetails(v)">
          <div class="event_left">
            <div class="start_time">{{v.startTime}}</div>
            <div class="end_time">{{v.endTime}}</div>
          </div>
          <div class="event_right">
            <div class="event_title">{{v.title}}</div>
            <div class="event_text">{{v.content}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import Calendar from "@/components/calendar";
export default {
  name: "calenday",
  components: {
    Calendar
  },
  data() {
    return {
      topText: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      agoDayHide: "0",
      markDateMore: [],
      eventDays: [],
      eventLists: []
    };
  },
  mounted() {
    let curDate = new Date();
    let year = curDate.getFullYear();
    let month = curDate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    this.agoDayHide = Math.round(preDate.getTime() / 1000).toString(); //设置当前日期以前的日期都不能点击
    this.getDay(`${year}-${month}`);
  },
  methods: {
    toDetails(data) {
      this.$router.push({
        path: "/eventDetails",
        query: {
          id: data.id
        }
      });
    },
    clickDay(data) {
      let year = data.split("/")[0];
      let month = data.split("/")[1];
      let day = data.split("/")[2];
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      let index = this.eventDays.indexOf(`${year}/${month}/${day}`);
      if (index !== -1) {
        this.getEvents(`${year}/${month}/${day}`);
      } else {
        this.eventLists = [];
      }
    },
    changeDate(data) {
      this.eventLists = [];
      let year = data.split("/")[0];
      let month = data.split("/")[1];
      if (month < 10) {
        month = "0" + month;
      }
      this.getDay(`${year}-${month}`);
    },
    getDay(data) {
      this.markDateMore = [];
      this.eventDays = [];
      this.$Get(this.$api.queryCalendar, { calendarDate: data }, true).then(
        res => {
          if (res.code == 0) {
            let data = res.datas;
            this.eventDays = data;
            for (let i = 0; i < data.length; i++) {
              this.markDateMore.push({
                date: data[i],
                className: "mark"
              });
            }
          }
        }
      );
    },
    getEvents(data) {
      this.eventLists = [];
      this.$Get(this.$api.queryCalendarList, { calendarDate: data }, true).then(
        res => {
          if (res.code == 0) {
            this.eventLists = res.datas;
          }
        }
      );
    }
  }
};
</script>
<style lang="less">
.calenday_wrapper {
  height: 100%;
  background: #fff;
  width: 100%;
  overflow: hidden;
  .calenday_content {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    .mark {
      position: relative;
      &::after {
        display: block;
        content: ".";
        font-size: 45px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        color: #ee4679;
      }
    }
    .wh_want_dayhide {
      &.mark {
        &::after {
          color: #ddd;
        }
      }
    }
  }
  .event_lists {
    .event_item {
      padding: 1vh 0;
      border-bottom: 1px solid #ddd;
      position: relative;
      .event_left,
      .event_right {
        line-height: 18px;
        box-sizing: border-box;
        &.event_left {
          width: 100px;
          text-align: center;
          font-size: 14px;
          position: relative;
          //  border-right:1px solid #ee4679;
          &::after {
            content: "";
            display: block;
            position: absolute;
            right: 12px;
            top: 0;
            bottom: 0;
            border-left: 1px solid #ee4679;
          }
          .start_time {
          }
          .end_time {
            color: #bfbfbf;
          }
        }
        &.event_right {
          position: absolute;
          top: 1vh;
          left: 100px;
          bottom: 1vh;
          right: 0;
          font-size: 14px;
          padding-right: 25px;
          div {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .event_title {
            font-size: 16px;
            font-weight: 600;
          }
          .event_text {
            color: #bfbfbf;
          }
        }
      }
    }
  }
}
</style>


