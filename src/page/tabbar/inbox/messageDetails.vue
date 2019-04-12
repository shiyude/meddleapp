<template>
  <div class="messageDetails">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">
      {{info.title}}
    </x-header>
    <div class="messageDetails_continer">
      <p v-if="info.projectName && info.createTime">{{info.projectName}} --- {{info.createTime}}</p>
      <div>{{info.content}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'messageDetails',
  data() {
    return {
      info: {}
    }
  },
  mounted() {
    this.info = this.$route.query
    console.log(this.info)
    localStorage.setItem('message', '1')
  },
  methods: {
    
  },
}
</script>
<style lang="less">
.messageDetails{
  height: 100%;
  .messageDetails_continer{
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
    overflow-y: scroll;
    word-wrap:break-word;
    p{
      font-size: 14px;
      color: #999;
      margin-bottom: 10px;
    }
  }
}
</style>
