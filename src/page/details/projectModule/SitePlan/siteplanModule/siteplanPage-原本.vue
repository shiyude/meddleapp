<template>
  <div class="siteplanPage">
    <x-header :eft-options.preventGoBack="true" class="nav_head">siteplanPage</x-header>
    <div class="siteplanPageCanvas">
      <div ref="canvasDom" class="canvas_center">
        <canvas id='canvas'></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import canvasData from '../../../../../assets/json/canvasData.json'
export default {
  data() {
    return {
      canvas: '',
      RectArr: [],
      CircleArr: [],
      TriangleArr: [],
      RectNum: -1,
      CircleNum: -1,
      TriangleNum: -1,
      from: {},
    }
  },
  mounted() {
    this.getDataList()
    let Cdoms = document.getElementsByTagName('canvas'), self = this
    let Ddoms = document.getElementsByClassName('canvas-container')[0]
    Ddoms.style.width = '100%'
    // console.log(canvasData.height)

    let ratio = canvasData.height / canvasData.width, Wnum = Ddoms.clientWidth
    Ddoms.style.height = ratio * Wnum + 'px'
    for (let i = 0; i < Cdoms.length; i++) {
      Cdoms[i].style.width = Ddoms.style.width
      Cdoms[i].style.height = Ddoms.style.height
    }
    console.log(self.canvas)

    console.log(this.$refs.canvasDom)

    let pageX, pageY, initX, initY, isTouch = false;
    let start = [];
    this.$refs.canvasDom.addEventListener("touchstart", function (e) {
      // console.log(e)
      //手指按下时的手指所在的X，Y坐标  
      pageX = e.targetTouches[0].pageX;
      pageY = e.targetTouches[0].pageY;
      //初始位置的X，Y 坐标  
      initX = e.target.offsetLeft;
      initY = e.target.offsetTop;
      //记录初始 一组数据 作为缩放使用
      if (e.touches.length >= 2) { //判断是否有两个点在屏幕上
        start = e.touches; //得到第一组两个点
        console.log('第一个手指', start)
      };
      //表示手指已按下  
      isTouch = true;
    }, false);
    //监听 touchmove 事件 手指 移动时 做的事情
    this.$refs.canvasDom.addEventListener("touchmove", function (e) {
      e.preventDefault();
      // console.log(e)
      // 一根 手指 执行 目标元素移动 操作
      if (e.touches.length == 1 && isTouch) {
        //移动目标的 X Y 坐标
        let touchMoveX = e.targetTouches[0].pageX,
          touchMoveY = e.targetTouches[0].pageY;
        //设置当前点击元素的 top left 定位值
        e.target.style.left = parseInt(touchMoveX) - parseInt(pageX) + parseInt(initX) + "px";
        e.target.style.top = parseInt(touchMoveY) - parseInt(pageY) + parseInt(initY) + "px";
        console.log(e.target.style.left, e.target.style.top)
      };
      // 2 根 手指执行 目标元素放大操作
      if (e.touches.length >= 2 && isTouch && e.scale < 2.5) {
        //得到第二组两个点
        let now = e.touches;
        // console.log('两个手指，放大', now, start)
        //得到缩放比例， getDistance 是勾股定理的一个方法
        console.log('测试沟谷定义', self.getDistance(now[0], now[1]),self.getDistance(start[0], start[1]))
        // let scale = (self.getDistance(now[0], now[1]) / self.getDistance(start[0], start[1]));
        let scale = self.getDistance(now[0], now[1]).toFixed(0)
        // 对缩放 比例 取整
        // e.scale = scale.toFixed(2);
        e.target.style.width = e.target.style.width * scale
        e.target.style.height = e.target.style.height * scale
        console.log('得到数值',scale)
        console.log('元素',e.target.style.height,e.target.style.width )
        // 执行目标元素的缩放操作   
        // e.target.style.transform = "scale(" + scale + ")";
      };
    }, false);
    //监听 手指离开屏幕时 
    this.$refs.canvasDom.addEventListener("touchend", function (e) {
      //将 isTouch 修改为false  表示 手指已经离开屏幕
      if (isTouch) {
        isTouch = false;
        console.log('离开屏幕')
      }
    }, false);
    //缩放 勾股定理方法
  },
  methods: {
    getDistance(p1,p2) {
      let x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
      // console.log(x,y)
      return Math.sqrt((x * x) + (y * y));
    },
    getDataList() {
      let self = this
      if (canvasData) {
        // console.log(canvasData)
        let imgs = require(`../../../../assets/images/img/unit.jpg`)
        self.canvas = new fabric.Canvas('canvas', {
          width: parseInt(canvasData.width),
          height: parseInt(canvasData.height),
          // hoverCursor: 'pointer',
          selection: false,
          // targetFindTolerance: 2
        })
        // console.log(self.canvas)

        // self.canvas.selection = false;
        fabric.Image.fromURL(imgs, function (oImg) { // 背景
          oImg.set({
            width: self.canvas.width,
            height: self.canvas.height,
            originX: 'left',
            originY: 'top'
          })
          self.canvas.setBackgroundImage(oImg, self.canvas.renderAll.bind(self.canvas))
        })
        for (let i = 0; i < canvasData.shapeList.length; i++) {
          self.addShape(canvasData.shapeList[i].type, canvasData.shapeList[i])
        }
      }
    },
    addShape(type, objType) {
      let self = this, num, commonData = {}
      commonData = {  // 读取
        left: parseFloat(objType.left),
        top: parseFloat(objType.top),
        width: parseFloat(objType.width),
        height: parseFloat(objType.height),
        angle: parseFloat(objType.angle),
        ulrSite: objType.ulrSite,
        name: objType.name,
        fill: objType.fill,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasBorders: false
      }
      if (objType.radius) { // 如果是圆形数据
        commonData.radius = parseFloat(objType.radius)
        commonData.scaleY = parseFloat(objType.scaleY)
        commonData.scaleX = parseFloat(objType.scaleX)
      }

      switch (type) {
        case 'rect': // 方形
          self.RectNum++
          num = self.RectNum
          self.RectArr[num] = new fabric.Rect(commonData)
          if (!self.RectArr[num].name) {
            self.RectArr[num].name = 'Rect' + num
          }
          self.canvas.add(self.RectArr[num])
          self.addOnSelected(self.RectArr[num])
          break
        case 'circle': // 圆形
          self.CircleNum++
          num = self.CircleNum
          if (!commonData.radius) {
            commonData.radius = 20
          }
          self.CircleArr[num] = new fabric.Circle(commonData)
          if (!self.CircleArr[num].name) {
            self.CircleArr[num].name = 'Circle' + num
          }
          self.canvas.add(self.CircleArr[num])
          self.addOnSelected(self.CircleArr[num])
          break
        case 'triangle': // 三角
          self.TriangleNum++
          num = self.TriangleNum
          self.TriangleArr[num] = new fabric.Triangle(commonData)
          if (!self.TriangleArr[num].name) {
            self.TriangleArr[num].name = 'Triangle' + num
          }
          self.canvas.add(self.TriangleArr[num])
          self.addOnSelected(self.TriangleArr[num])
          break
      }
    },
    addOnSelected(obj) { // 绑定事件
      let _this = this
      obj.on('selected', function () {
        let self = this
        _this.$router.push('/projectDetails/building')
        console.log('点击点击',obj)
      })
    },
  }
}
</script>

<style lang="less">
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.siteplanPage {
  height: 100%;
}
.siteplanPageCanvas {
  position: absolute;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  .canvas_center {
    width: 100%;
  }
}
</style>
