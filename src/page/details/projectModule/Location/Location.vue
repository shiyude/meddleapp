<template>
  <div class="Location">
    <div id="map" v-if="detailsInfo.latitude && detailsInfo.longitude"></div>
    <alert v-if="detailsInfo.latitude=='' || detailsInfo.longitude==''" :alertConfig="alertConfig"></alert>
  </div>
</template>

<script>
import alert from "@/components/alert.vue";
export default {
  nama: 'Location',
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
    this.initMap(this.detailsInfo)
    console.log(this.detailsInfo)
  },
  methods: {
    initMap(info) {
      if (info.latitude && info.longitude) {
        let myLatLng = { lat: parseFloat(info.latitude), lng: parseFloat(info.longitude) };
        console.log(info.latitude, info.longitude)
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 18,
          center: myLatLng,
          // disableDefaultUI: true
        });

        let marker = new google.maps.Marker({
          position: myLatLng,
          map: map
        });
      }
    }
  }
}
</script>

<style lang="less">
.Location {
  height: 100%;
  #map {
    height: 100%;
    // a[href^="http://maps.google.com/maps"] {
    //   display: none !important;
    // }
    // a[href^="https://maps.google.com/maps"] {
    //   display: none !important;
    // }

    // .gmnoprint a,
    // .gmnoprint span,
    // .gm-style-cc {
    //   display: none;
    // }
    // .gmnoprint div {
    //   // background:none !important;
    // }
  }
}
</style>