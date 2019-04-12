<template>
  <div class="Facilities">
    <div class="Facilities_box" v-html="detailsInfo.facilities"></div>
    <alert v-if="!detailsInfo.facilities" :alertConfig="alertConfig"></alert>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
export default {
  nama: 'Facilities',
  props: {
    detailsInfo: {
      type: Object
    }
  },
  components: {
    alert
  },
  data() {
    return {
      alertConfig: {
        isShow: true,
        img: '/img/alert/noContent.png',
        err: this.$t('ComingSoon'),
        tips: this.$t('noContent')
      },
    }
  },
  mounted() {
    console.log(this.detailsInfo.facilities)
  },
  methods: {

  }
}
</script>

<style lang="less">
.Facilities {
  height: 100%;
  .Facilities_box {
    position: absolute;
    top: 1vh;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
    overflow-y: scroll;
    padding-top: 0;
    ul,ol{
      list-style: none;
    }
    img{
      width: 100%;
    }
  }
}
</style>