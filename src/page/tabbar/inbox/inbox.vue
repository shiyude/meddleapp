<template>
  <div class="tabInbox">
    <div class="InboxSearch">
      <search
        class="search_box"
        @result-click="resultClick"
        :results="results"
        v-model="search"
        position="absolute"
        :placeholder="$t('search')"
        :cancel-text="$t('cancel')"
        auto-scroll-to-top
        @on-focus="onFocusFn"
        @on-blur="blurFn"
        @on-change="onCancel(search)"
        ref="search"
      ></search>
    </div>
    <div class="inBox_box">
      <tab
        class="inBox_box_tab"
        :animate="false"
        :line-width="2"
        active-color="#000"
        v-model="isTabActive"
      >
        <tab-item
          class="vux-center"
          :selected="isTabActive === index"
          v-for="(item, index) in tabData"
          @click.native="setTab(index)"
          :key="index"
        >
          <div class="vux-tab-item_div">
            {{item}}
            <badge v-if="index == 0 && MessageReadNum != 0" :text="MessageReadNum"></badge>
          </div>
        </tab-item>
      </tab>
    </div>
    <div class="inBox_center" ref="tabInboxDom">
      <div class="inBox_center_box" v-if="isTabActive == 1">
        <alert v-if="NotificationList.length == 0" :alertConfig="alertConfig"></alert>
        <swipeout v-if="NotificationList">
          <ul v-infinite-scroll="loadMore" infinite-scroll-distance="30">
            <li v-for="(item, index) in NotificationList" :key="index">
              <swipeout-item :threshold=".5" transition-mode="follow" :disabled="true">
                <div slot="right-menu">
                  <swipeout-button
                    @click.native="onButtonClick('fav')"
                    background-color="#D23934"
                    type="primary"
                  >{{$t('DELETE')}}</swipeout-button>
                </div>
                <div slot="content" class="message-queue vux-1px-t">
                  <div class="message-queue-box">
                    <div class="message-queue-lf">
                      <div class="badge_div">
                        <!-- <badge></badge> -->
                      </div>
                      <div>
                        <img src="../../../assets/images/icon/sold_active.png" alt>
                      </div>
                    </div>
                    <div class="message-queue-md">
                      <h3>{{item.projectName}}</h3>
                      <h4>{{item.unitName}}</h4>
                      <p>{{item.purchaseStatus}}</p>
                    </div>
                    <div class="message-queue-rt">
                      <span>{{item.createTime}}</span>
                    </div>
                  </div>
                </div>
              </swipeout-item>
            </li>
          </ul>
          <p class="loadingBox" v-if="NotificatioLoading && NotificationList.length != 0">
            <mt-spinner type="fading-circle"></mt-spinner>
          </p>
        </swipeout>
      </div>

      <div class="inBox_center_box" v-if="isTabActive == 0">
        <alert v-if="MessageList.length == 0" :alertConfig="alertConfig"></alert>
        <swipeout>
          <swipeout v-if="MessageList">
            <ul v-infinite-scroll="MessageLoadMore" infinite-scroll-distance="30">
              <li v-for="(item, index) in MessageList" :key="index">
                <swipeout-item
                  :threshold=".5"
                  transition-mode="follow"
                  @click.native="GoToMessage(index, item)"
                  :disabled="true"
                >
                  <div slot="right-menu">
                    <swipeout-button
                      @click.native="onButtonClick('fav')"
                      background-color="#D23934"
                      type="primary"
                    >{{$t('DELETE')}}</swipeout-button>
                  </div>
                  <div slot="content" class="message-queue vux-1px-t">
                    <div class="message-queue-box">
                      <div class="message-queue-lf">
                        <div class="badge_div">
                          <badge v-if="item.isRead === 0"></badge>
                        </div>
                        <div>
                          <img src="../../../assets/images/icon/sold_active.png" alt>
                        </div>
                      </div>
                      <div class="message-queue-md">
                        <h3>{{item.title}}</h3>
                        <h4>{{item.projectName}}</h4>
                        <p>{{item.content}}</p>
                      </div>
                      <div class="message-queue-rt">
                        <span>{{item.createTime}}</span>
                      </div>
                    </div>
                  </div>
                </swipeout-item>
              </li>
            </ul>
            <p class="loadingBox" v-if="MessageLoading && MessageList.length != 0">
              <mt-spinner type="fading-circle"></mt-spinner>
            </p>
          </swipeout>
        </swipeout>
      </div>
    </div>
  </div>
</template>

<script>
import { Search, Swipeout, SwipeoutItem, SwipeoutButton, Badge } from 'vux'
import alert from "@/components/alert.vue";
export default {
  name: 'tabInbox',
  components: {
    Search,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Badge,
    alert
  },
  data() {
    return {
      search: '',
      isTabActive: 0,
      tabData: [this.$t('MESSAGE'), this.$t('Notification')],
      results: [],
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      },
      NotificatioLoading: false,
      NotificatioIsLoadMore: false,
      projectIds: '',
      NotificatioPageNo: 1,
      NotificatioSize: 20,
      NotificationList: [],
      NotificatioCount: '',
      MessageLoading: false,
      MessageISloadMore: false,
      MessagePageNo: 1,
      MessageSize: 20,
      MessageList: [],
      MessageCount: '',
      MessageReadNum: 0,
    }
  },
  created() {
    this.$removeScrollNum('tabInboxDom')
  },
  activated() {
    if (localStorage.getItem('message')) {
      this.$SetScroll(this.$refs.tabInboxDom, 'tabInboxDom')
      localStorage.removeItem('message')
    } else {
      this.projectIds = JSON.parse(localStorage.getItem('SetInbox')).join(",")
      this.NotificationList = []
      this.MessageList = []
      this.MessagePageNo = 1
      this.NotificatioPageNo = 1
      this.getNotification(this.projectIds,true)
      this.GetInboxMessageList(this.projectIds)
    }
  },
  mounted() {
    this.$KeepScrollTop(this.$refs.tabInboxDom, 'tabInboxDom')
    // this.projectIds = JSON.parse(localStorage.getItem('SetInbox')).join(",")
    // this.NotificationList = []
    // this.MessageList = []
    // this.MessagePageNo = 1
    // this.NotificatioPageNo = 1
    // this.getNotification(this.projectIds)
    // this.GetInboxMessageList(this.projectIds)
    // console.log('刷新')
    // console.log(this.projectIds)
  },
  methods: {
    getNotification(projectIdData,isLoading=false) {
      this.NotificatioLoading = true
      let data = {
        pageNo: this.NotificatioPageNo,
        pageSize: this.NotificatioSize,
        search: this.search,
        projectIds: projectIdData,
        type: 1
      }
      this.$Get(this.$api.getNotificationList, data,isLoading).then(res => {
        if (res.code == 0) {
          if (res.datas.lists) {
            this.NotificationList = this.NotificationList.concat(res.datas.lists);
            this.NotificatioCount = res.datas.count
            this.NotificatioIsLoadMore = true
            if (this.NotificationList.length < this.NotificatioSize) this.NotificatioLoading = false
          }
        }
      })
    },
    GetInboxMessageList(projectIdData, isPaging) {
      this.MessageLoading = true
      let data = {
        pageNo: this.MessagePageNo,
        pageSize: this.MessageSize,
        search: this.search,
        projectIds: projectIdData,
        type: 1
      }
      this.$Get(this.$api.queryInboxMessageList, data).then(res => {
        if (res.code == 0) {
          if (res.datas.lists) {
            this.MessageList = this.MessageList.concat(res.datas.lists);
            this.MessageCount = res.datas.count
            this.MessageISloadMore = true
            if (this.MessageList.length < this.MessageSize) this.MessageLoading = false
          }
          if (!isPaging) {
            this.MessageReadNum = res.datas.readNum
          }
        }
      })
    },
    loadMore() {
      if (this.NotificatioIsLoadMore) {
        let totalPage = Math.ceil(this.NotificatioCount / this.NotificatioSize);
        if (this.NotificatioPageNo == totalPage || this.NotificatioCount == 0) {
          this.NotificatioIsLoadMore = false;
          this.NotificatioLoading = false;
        } else {
          this.NotificatioPageNo++;
          this.getNotification(this.projectIds);
        }
      }
    },
    MessageLoadMore() {
      if (this.MessageISloadMore) {
        let totalPage = Math.ceil(this.MessageCount / this.MessageSize);
        if (this.MessagePageNo == totalPage || this.MessageCount == 0) {
          this.MessageISloadMore = false;
          this.MessageLoading = false;
        } else {
          this.MessagePageNo++;
          this.GetInboxMessageList(this.projectIds, 'pading');
        }
      }
    },
    GoToMessage(index, item) {
      if (item.isRead == 0) {
        this.$Get(this.$api.messageUpdateIsRead, { id: item.id, 
        projectIds: this.projectIds, search: this.search, type: 1 }).then(res => {
          if (res.code == 0) {
            item.isRead = 1
            this.MessageReadNum = res.datas
            window.location.href = 'uniwebview://removePush';
          }
        })
      }
      this.$router.push({
        path: "/inBox/messageDetails",
        query: {
          ...item
        }
      });
      console.log('11111')
    },
    resultClick(item) {
      this.search = item.title
      console.log('1111',this.search)
      if (this.isTabActive == 1) {
        this.NotificationList = []
        this.NotificatioPageNo = 1
        this.getNotification(this.projectIds)
      }
      if (this.isTabActive == 0) {
        this.MessageList = []
        this.MessagePageNo = 1
        this.GetInboxMessageList(this.projectIds)
      }
      // this.search = ''
    },
    onCancel(search) {
      this.results = []
      if (this.isTabActive == 1) {
        this.NotificationList = []
        this.NotificatioPageNo = 1
        this.getNotification(this.projectIds)
      }
      if (this.isTabActive == 0) {
        this.MessageList = []
        this.MessagePageNo = 1
        this.GetInboxMessageList(this.projectIds)
      }
      let RecentSearch = JSON.parse(localStorage.getItem('RecentSearch'))
      if (search != '') {
        if (RecentSearch) {
          RecentSearch.unshift({
            title: search,
            other: search
          })
          if (RecentSearch.length > 3) {
            RecentSearch.pop()
          }
          localStorage.setItem('RecentSearch', JSON.stringify(RecentSearch))
        } else {
          let arr = [{
            title: search,
            other: search
          }]
          localStorage.setItem('RecentSearch', JSON.stringify(arr))
        }
      }
    },
    onFocusFn() {
      let RecentSearch = JSON.parse(localStorage.getItem('RecentSearch'))
      if (RecentSearch) {
        this.results = RecentSearch
      }
    },
    onButtonClick(type) {
      // alert('on button click ' + type)
    },
    setTab(index) {
      this.isTabActive = index
      this.$refs.tabInboxDom.scrollTop = 0
      // console.log(index)
    },
    blurFn() {
      this.results = []
    }
  }
}
function getResult(val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
    console.log(rs)
  }
  return rs
}
</script>

<style lang="less">
.tabInbox {
  height: 100%;
  .InboxSearch {
    height: 6vh;
    .search_box {
      .weui-search-bar {
        background: #fff;
        height: 6vh;
        line-height: 6vh;
        padding: 0;
        box-shadow: 0px 5px 6px #ddd;
        border-top: 1px solid #ddd;
        .weui-search-bar__form {
          background: #fff;
          .weui-icon-clear {
            display: none;
          }
        }
      }
      .weui-search-bar__form:after {
        border: 0;
      }
      .weui-search-bar_focusing {
        .weui-icon-search {
          line-height: 6vh;
        }
      }
      .weui-search-bar__cancel-btn {
        margin-right: 20px;
        color: blue;
        line-height: 6vh;
      }
    }
    .weui-cells.vux-search_show .weui-cell:last-child {
      margin-bottom: 0;
    }
    .weui-cells.vux-search_show {
      box-shadow: 0 10px 10px #ddd;
      .weui-cell {
        padding-left: 50px;
        position: relative;
        font-size: 14px;
        color: #666;
      }
      .weui-cell:after {
        position: absolute;
        content: "";
        width: 30px;
        height: 30px;
        top: 50%;
        margin-top: -15px;
        left: 15px;
        background: url("../../../assets/images/icon/searchIcon.png") no-repeat
          0 0;
        background-size: 100% 100%;
      }
    }
  }
  .inBox_box {
    .inBox_box_tab {
      height: 6vh;
      padding-top: 0;
      .vux-tab-container {
        box-shadow: none;
        height: 100%;
        border-bottom: 1px solid #ddd;
      }
      .vux-tab {
        background: transparent;
        height: 100%;
      }
      .vux-tab-item {
        line-height: 6vh;
        background: transparent;
        // font-size: 2vh;
        .vux-tab-item_div {
          display: inline-block;
          padding-left: 2.5vh;
          position: relative;
        }
        .vux-tab-item_div:after {
          content: "";
          position: absolute;
          width: 2.5vh;
          height: 2.5vh;
          top: 50%;
          left: 0;
          margin-top: -1.25vh;
          background-position: 0 0;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .vux-badge {
          margin-top: -1.5vh;
        }
      }
      .vux-tab-item:nth-child(2) {
        .vux-tab-item_div:after {
          background-image: url("../../../assets/images/icon/sold_active.png");
        }
      }
      .vux-tab-item:nth-child(3) {
        .vux-tab-item_div:after {
          background-image: url("../../../assets/images/icon/canceled_active.png");
        }
      }
      .vux-tab-item:nth-child(1) {
        .vux-tab-item_div:after {
          background-image: url("../../../assets/images/icon/message_active.png");
        }
      }
      .vux-tab-item.vux-tab-selected:nth-child(2) {
        .vux-tab-item_div:after {
          background-image: url("../../../assets/images/icon/sold.png");
        }
      }
      .vux-tab-item.vux-tab-selected:nth-child(3) {
        .vux-tab-item_div:after {
          background-image: url("../../../assets/images/icon/canceled.png");
        }
      }
      .vux-tab-item.vux-tab-selected:nth-child(1) {
        .vux-tab-item_div:after {
          background-image: url("../../../assets/images/icon/message.png");
        }
      }
    }
  }
  .vux-1px-t:before {
    display: none;
  }
  .inBox_center {
    position: absolute;
    top: 12.5vh;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    .inBox_center_box {
      .vux-swipeout-item {
        border-bottom: 1px solid #ddd;
      }
      .message-queue {
        .message-queue-box {
          position: relative;
          padding: 1vh 10vh 1vh 8vh;
          h3 {
            font-size: 14px;
            font-weight: 500;
          }
          h4 {
            font-size: 12px;
            font-weight: 400;
            color: #666;
          }
          p {
            font-size: 12px;
            color: #999;
            height: 22px;
          }
        }
        .message-queue-lf {
          position: absolute;
          left: 0;
          width: 6vh;
          top: 0;
          bottom: 0;
          text-align: center;
          // padding-top: 2vh;
          .badge_div {
            height: 25px;
          }
          img {
            width: 3vh;
            height: 3vh;
          }
        }
        .message-queue-md {
          padding-right: 1vh;
          h3,
          h4,
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          h3 {
            height: 23px;
          }
        }
        .message-queue-rt {
          position: absolute;
          width: 10vh;
          right: 0;
          top: 0;
          bottom: 0;
          // padding-top: 2vh;
          span {
            font-size: 12px;
            color: #999;
            // line-height: 1.5;
          }
        }
      }
    }
  }
  .loadingBox {
    text-align: center;
    height: 60px;
    .mint-spinner-fading-circle {
      display: inline-block;
    }
  }
}
</style>