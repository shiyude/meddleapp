<template>
  <div class="PDFpage">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">{{headTxt}}</x-header>
    <div class="pdfContent">
      <div class="PDFBox" v-if="pages">
        <canvas v-for="page in pages" :id="'the-canvas'+page" :key="page"></canvas>
      </div>
      <mt-spinner class="pdfLoadding" v-if="loadding" type="snake"></mt-spinner>
      <alert v-if="isBlank" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>
<script>
import PDFJS from 'pdfjs-dist'
import alert from "@/components/alert.vue";
export default {
  name: 'PDFpage',
  components: {
    alert
  },
  data() {
    return {
      pdfUlr: "",
      headTxt: "",
      title: '',
      pdfDoc: null,
      loadding: true,
      pages: 0,
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      },
      isBlank: false
    }
  },
  mounted() {
    this.pdfUlr = this.$route.query.PDFUrl
    this.headTxt = this.$route.query.text
    this.loadFile(this.pdfUlr)
  },
  methods: {
    renderPage(num) {
      let _this = this
      this.pdfDoc.getPage(num).then(function (page) {
        let canvas = document.getElementById('the-canvas' + num)
        let ctx = canvas.getContext('2d')
        let dpr = window.devicePixelRatio || 1
        let bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1
        let ratio = dpr / bsr
        var viewport = page.getViewport(screen.availWidth / page.getViewport(1).width)
        canvas.width = viewport.width * ratio
        canvas.height = viewport.height * ratio
        canvas.style.width = viewport.width + 'px'
        canvas.style.height = viewport.height + 'px'
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }
        page.render(renderContext)
        if (_this.pages > num) {
          _this.renderPage(num + 1)
        }
        _this.loadding = false
      })
    },
    loadFile(url) {
      let _this = this
      PDFJS.getDocument(url).then(function (pdf) {
        if (pdf) {
          _this.pdfDoc = pdf
          _this.pages = _this.pdfDoc.numPages
          _this.$nextTick(() => {
            setTimeout(
              function () {
                _this.renderPage(1)
              }, 2000
            )
          })
        } else {
          this.isBlank = true
          console.log('没有PDF')
        }
      })
    }
  }
}
</script>
<style lang="less">
.PDFpage {
  width: 100%;
  height: 100%;
  .pdfContent {
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: scroll;
    .pdfLoadding{
      position: fixed;
      top: 40%;
      left: 50%;
    }
    .PDFBox{
      width: 100%;
    }
  }
}
</style>