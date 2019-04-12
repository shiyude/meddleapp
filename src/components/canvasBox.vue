<template>
  <div class="canvasBox">
    <div class="canvasBg" ref="canvas" :id="id"></div>
  </div>
</template>

<script>
import { baseURL } from '@/config/evn'
import '@/assets/js/spritejs.min.js'
const { Scene, Sprite, Path } = spritejs
import { AlertModule } from 'vux'
export default {
  name: 'canvasBox',
  props: {
    id: String,
    canvasData: Object
  },
  watch: {
    canvasData(val, odval) {
      if (val) {
        this.Cdata = val
        this.openCanvas(val)
      }
    }
  },
  data() {
    return {
      Cdata: {},
      queryInfo: {}
    }
  },
  mounted() {
    console.log('触发组件CANVAS', this.$route.query)
    this.queryInfo = this.$route.query
  },
  methods: {
    openCanvas(datas) {
      let self = this, data = datas
      let w = data.imgWidth, h = data.imgHeight
      let ratio = h / w, Wnum = this.$refs.canvas.clientWidth
      this.$refs.canvas.style.height = `${ratio * Wnum}px`
      let scene = new Scene(`#${this.id}`, { viewport: [`auto`, `auto`], resolution: [w, h] })
      let layer = scene.layer()
      this.setBgImg(layer, data.img, data.imgWidth, data.imgHeight)
      // console.log(scene.viewport, scene.height)
      for (let i = 0; i < data.siteplans.length; i++) {
        switch (data.siteplans[i].type) {
          case 'rect':
            this.setRect(layer, data.siteplans[i], data.type)
            break
          case 'circle':
            this.setCircle(layer, data.siteplans[i], data.type)
            break
          case 'triangle':
            this.setTriangle(layer, data.siteplans[i], data.type)
            break
        }
      }
    },
    setBgImg(layer, img, w, h) {
      let self = this
      let url = `${baseURL}${self.$api.downloadFile}?url=${img}`
      // console.log(url)

      let bg = new Sprite(url);
      bg.attr({
        anchor: [0, 0],
        x: 0,
        y: 0,
        size: [w, h],
        zIndex: 0
      });
      layer.append(bg);

      // this.$refs.canvas.style.backgroundImage = "url(" + img + ")";
    },
    goToLink(linkTarget, queryInfo) {
      let _this = this
      switch (linkTarget) {
        case 'siteplan':
          _this.$router.push({
            path: '/projectDetails/building',
            query: {
              sitePlanId: queryInfo.sitePlanID,
              projectId: _this.queryInfo.projectId,
              projectName: _this.queryInfo.projectName
            }
          })
          break;
        case 'building':
          if (queryInfo.purchaseStatus && queryInfo.unitID !== '-1' && queryInfo.access == 'yes') {
            _this.$router.push({
              path: '/projectDetails/unitInfo',
              query: {
                unitId: queryInfo.unitID,
                projectId: _this.queryInfo.projectId,
                projectName: _this.queryInfo.projectName
              }
            })
          } else {
            AlertModule.show({
              title: 'ERROR',
              content: this.$t('doNotHavePermission'),
              buttonText: 'OK'
            })
          }
          break;
      }
      // console.log('点击信息', linkTarget, queryInfo)
    },
    setColor(info) {
      let data
      if (info.purchaseStatus) {
        switch (info.purchaseStatus) {
          // case 'AVAILABLE':
          //   info.fill = 'rgba(105,181,105,0.5)'
          //   data = info
          //   break;
          // case 'SOLD':
          //   info.fill = 'rgba(243,28,60,0.5)'
          //   data = info

          //   break;
          // case 'NOT RELEASED':
          //   info.fill = 'rgba(86,81,81,0.5)'
          //   data = info
          //   break;
          // case 'RESERVED':
          //   info.fill = 'rgba(86,81,81,0.5)'
          //   data = info
          //   break
          case 'SOLD':
            info.fill = 'rgba(255,0,0,0.5)'
            data = info
            break;
          case 'AVAILABLE':
            info.fill = 'rgba(18,211,184,0.5)'
            data = info
            break;
          case 'NOT RELEASED':
            info.fill = 'rgba(51,51,51,0.5)'
            data = info
            break;
          case 'PENDING RESERVED':
            info.fill = 'rgba(232,232,88,0.5)'
            data = info
            break;
          case 'RESERVED':
            info.fill = 'rgba(255,153,0,0.5)'
            data = info
            break;
          case 'SPA SIGN':
            info.fill = 'rgba(0,204,255,0.5)'
            data = info
            break;
          case 'SPA STAMP':
            info.fill = 'rgba(0,51,255,0.5)'
            data = info
            break;
          case 'REQUEST CANCEL':
            info.fill = 'rgba(102,0,204,0.5)'
            data = info
            break;
        }
      } else {
        info.fill = 'transparent'
        data = info
      }
      return data
    },
    setRect(layer, infoData, type) {
      let rect = new Sprite(), _this = this
      let info = _this.setColor(infoData)
      if (info) {
        rect.attr({
          pos: [info.left, info.top],
          size: [info.width, info.height],
          bgcolor: info.fill,
          zIndex: 100
        })

        layer.append(rect)
        rect.on('click', (evt) => {
          _this.goToLink(type, info)
        })
      }
    },
    setCircle(layer, infoData, type) {
      let circle = new Path(), _this = this
      let info = _this.setColor(infoData)
      if (info) {
        let cx = 0,
          cy = 0,
          rx = parseInt(info.width) / 2,
          ry = parseInt(info.height) / 2
        let way = this.ellipsePath(cx, cy, rx, ry)
        let L = parseInt(info.left), T = parseInt(info.top)
        // if (parseInt(info.width) != parseInt(info.height)) {
        //   // L = parseInt(info.left) - parseInt(info.width) / 2
        // }
        circle.attr({
          path: {
            d: way,
            transform: {
              rotate: parseInt(0),
            },
            trim: true,
          },
          pos: [L, T],
          fillColor: info.fill,
          zIndex: 100
        })
        layer.append(circle)
        circle.on('click', (evt) => {
          _this.goToLink(type, info)
        })
      }
    },
    setTriangle(layer, infoData, type) {
      let triangle = new Path(), _this = this
      let info = _this.setColor(infoData)
      if (info) {
        let way = `M ${parseInt(info.width) / 2} 0   
                L 0 ${parseInt(info.height)} 
                L ${parseInt(info.width)} ${parseInt(info.height)} Z`
        triangle.attr({
          path: {
            d: way,
            transform: {
              rotate: parseInt(0),
            },
            trim: true,
          },
          fillColor: info.fill,
          pos: [info.left, info.top],
          zIndex: 100
        })
        layer.append(triangle)
        triangle.on('click', (evt) => {
          _this.goToLink(type, info)
        })
      }
    },
    ellipsePath(cx, cy, rx, ry) { // 计算圆型 
      if (isNaN(cx - cy + rx - ry)) { return }
      let path = 'M' + (cx - rx) + ' ' + cy +
        'a' + rx + ' ' + ry + ' 0 1 0 ' + 2 * rx + ' 0' +
        'a' + rx + ' ' + ry + ' 0 1 0 ' + (-2 * rx) + ' 0' + 'z'
      return path
    }
  }
}
</script>



<style lang="less">
.canvasBox {
  height: 100%;
  .canvasBg {
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
#demo-quickStart {
  width: 100%;
  padding-bottom: 26%;
}
</style>