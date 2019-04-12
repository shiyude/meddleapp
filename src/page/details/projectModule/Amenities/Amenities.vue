<template>
  <div class="Amenities">
    <div v-if="detailsInfo.nearbyAmenities" class="Amenities_box" v-html="detailsInfo.nearbyAmenities"></div>
    <alert v-if="!detailsInfo.nearbyAmenities" :alertConfig="alertConfig"></alert>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
export default {
  nama: 'Amenities',
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

  },
  methods: {

  }
}
</script>

<style lang="less">
.Amenities {
  height: 100%;
  .Amenities_box {
    position: absolute;
    top: 1vh;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
    padding-top: 0;
    overflow-y: scroll;
    ul,ol{
      list-style: none;
    }
    img{
      width: 100%;
    }
  }
}
</style>