<template>
  <div class="projectList">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">{{headTxt}}</x-header>
    <div ref="divDom" class="project_div">
      <div class="project_div_head" v-if="isSeek">
        <div v-for="(item,index) in label" :key="index" class="project_div_head_txt">{{item}}</div>
      </div>
      <ul class="project_div_box" v-infinite-scroll="loadMore" infinite-scroll-distance="30">
        <li v-for="item in projectData">
          <card-box :type="openType" :itemData="item"></card-box>
        </li>
      </ul>
      <p class="loadingBox" v-if="loading && projectData.length != 0">
        <mt-spinner type="fading-circle"></mt-spinner>
      </p>
      <alert v-if="projectData.length === 0" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>

<script>
import cardBox from "@/components/cardBox.vue";
import alert from "@/components/alert.vue";
export default {
  name: 'projectList',
  components: {
    cardBox,
    alert
  },
  data() {
    return {
      projectData: [],
      label: [],
      pathInfo: {},
      pageSize: 8,
      pageNo: 1,
      isSeek: false,
      loading: false,
      isTrue: true,
      count: '',
      alertConfig: {
        isShow: true,
        img: '/img/alert/noSeek.png',
        err: this.$t('noFind'),
        tips: this.$t('noFindText')
      },
      headTxt: '',
      openType: 'home'
    }
  },
  created() {
    this.$removeScrollNum('projectList')
  },
  mounted() {
    this.pathInfo = this.$route.query
    this.$KeepScrollTop(this.$refs.divDom, 'projectList')
    if (this.pathInfo.info) {
      let data = this.pathInfo.info
      if (data.projectName) this.label.push(data.projectName)
      if (data.country) this.label.push(data.country)
      if (data.location) this.label.push(data.location)
      if (data.minPrice && data.maxPrice) {
        let min = (data.minPrice / 1000) > 1000 ? ((data.minPrice / 1000 / 1000) + 'M') : ((data.minPrice / 1000) + 'K'),
          max = (data.maxPrice / 1000) > 1000 ? ((data.maxPrice / 1000 / 1000) + 'M') : ((data.maxPrice / 1000) + 'K')
        this.label.push(`${min}-${max}`)
      }
      if (data.minArea && data.maxArea) this.label.push(`${data.minArea}-${data.maxArea}SQFT`)
      if(data.projectType) this.label.push(data.projectType)
      this.headTxt = this.$t('SearchResult')
    } else {
      this.headTxt = this.pathInfo.listName
    }
    if(this.pathInfo.openType) {
      this.openType = this.pathInfo.openType
    }
  },
  activated() {
    this.$SetScroll(this.$refs.divDom, 'projectList')
  },
  methods: {
    getProjectListData(params) {
      let url = this.$api.queryProjectList;
      params.permission = 1
      if (this.pathInfo.type == 'coBrokeList' || this.pathInfo.type == 'seekCoBrokeList') {
        url = this.$api.queryCoBrokeList;
         params.permission = 3
        if(this.pathInfo.projectType) {
          params.projectType = this.pathInfo.projectType
        }
      };
      // console.log(url,params)
      this.$Get(url, { pageSize: this.pageSize, pageNo: this.pageNo, ...params }).then(res => {
        if (res.code == 0) {
          let arr = res.datas.lists
          this.count = res.datas.count
          this.projectData = this.projectData.concat(res.datas.lists);
          this.loading = false
          this.isTrue = false
        }
      })
    },
    loadMore() {
      this.loading = true;
      let totalPage, data = {}
      if (this.pathInfo) {
        switch (this.pathInfo.type) {
          case 'coBrokeList':
          case 'list':
            data = {
              propertyGroup: this.pathInfo.listName
            }
            if (this.pathInfo.listName === 'RECENT/UPCOMING') data = {}
            break;
          case 'seekCoBrokeList':
          case 'seek':
            data = this.pathInfo.info
            this.isSeek = true
            break;
        }
        if (this.isTrue) this.getProjectListData(data)
        if (this.count) {
          this.pageNo = this.pageNo + 1
          totalPage = this.count / this.pageSize + 1
          if (this.pageNo < totalPage) this.getProjectListData(data)
          else this.loading = false
        }
      }
    }
  }
}
</script>

<style lang="less">
.projectList {
  height: 100%;
  background: #fff;
  .project_div {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    padding: 15px;
    right: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    .loadingBox {
      text-align: center;
      .mint-spinner-fading-circle {
        display: inline-block;
      }
    }
    .project_div_box {
      margin-bottom: 15px;
      list-style: none;
      li {
        margin-bottom: 2vh;
      }
    }
    .project_div_head {
      // display: flex;
      margin-bottom: 15px;
      .project_div_head_txt {
        display: inline-block;
        padding: 4px 5px;
        background-color: #5160f1;
        margin-right: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 20px;
        font-size: 12px;
        color: #fff;
        line-height: 1;
        font-weight: 100;
      }
    }
  }
}
</style>