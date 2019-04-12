<template>
  <div class="Summary">
    <div class="content" ref="summaryContent">
      <div v-if="JSON.stringify(tableData) != '{}'">
        <div class="title">
          <span class="btns" @click="getTableData">{{$t('REFRESH')}}</span>
        </div>
        <div class="canvas_div">
          <v-chart prevent-render @on-render="renderVChart" v-if="isShowCanvas"></v-chart>
        </div>
        <div class="table_lists">
          <div class="table_lists">
            <div class="table" v-if="tableData.unitsByType&&tableData.unitsByType.length">
              <div class="table_head">{{$t('UNITSBYTYPE')}}</div>
              <div class="table_thead">
                <div>{{$t('Type')}}</div>
                <div>{{$t('Reserved')}}</div>
                <div>{{$t('Sold')}}</div>
                <div>{{$t('Avaliable')}}</div>
                <div>{{$t('Total')}}</div>
              </div>
              <div class="table_tbody">
                <div class="tr" v-for="item in tableData.unitsByType">
                  <div>{{item.type}}</div>
                  <div>{{item.notReleased}}</div>
                  <div>{{item.sold}}</div>
                  <div>{{item.available}}</div>
                  <div>{{item.total}}</div>
                </div>
              </div>
            </div>
            <div class="table" v-if="tableData.priceByType&&tableData.priceByType.length">
              <div class="table_head">{{$t('PRICEBYTYPE')}}</div>
              <div class="table_thead">
                <div>{{$t('Type')}}</div>
                <div>{{$t('AvgPSF')}}</div>
                <div>{{$t('LoPrice')}}</div>
                <div>{{$t('HiPrice')}}</div>
              </div>
              <div class="table_tbody">
                <div class="tr" v-for="item in tableData.priceByType">
                  <div>{{item.type}}</div>
                  <div>{{item.avgPsf}}</div>
                  <div>{{item.minPrice}}</div>
                  <div>{{item.maxPrice}}</div>
                </div>
              </div>
            </div>
            <div class="table" v-if="tableData.unitsByBlock&&tableData.unitsByBlock.length">
              <div class="table_head">{{$t('UNITSBYBLOCK')}}</div>
              <div class="table_thead">
                <div>{{$t('Type')}}</div>
                <div>{{$t('Reserved')}}</div>
                <div>{{$t('Sold')}}</div>
                <div>{{$t('Avaliable')}}</div>
                <div>{{$t('Total')}}</div>
              </div>
              <div class="table_tbody">
                <div class="tr" v-for="item in tableData.unitsByBlock">
                  <div>{{item.type}}</div>
                  <div>{{item.notReleased}}</div>
                  <div>{{item.sold}}</div>
                  <div>{{item.available}}</div>
                  <div>{{item.total}}</div>
                </div>
              </div>
            </div>
            <div class="table" v-if="tableData.priceByBlock&&tableData.priceByBlock.length">
              <div class="table_head">{{$t('PRICEBYBLOCK')}}</div>
              <div class="table_thead">
                <div>{{$t('Type')}}</div>
                <div>{{$t('AvgPSF')}}</div>
                <div>{{$t('LoPrice')}}</div>
                <div>{{$t('HiPrice')}}</div>
              </div>
              <div class="table_tbody">
                <div class="tr" v-for="item in tableData.priceByBlock">
                  <div>{{item.type}}</div>
                  <div>{{item.avgPsf}}</div>
                  <div>{{item.minPrice}}</div>
                  <div>{{item.maxPrice}}</div>
                </div>
              </div>
            </div>
            <div class="table" v-if="tableData.unitsByFloorPlan&&tableData.unitsByFloorPlan.length">
              <div class="table_head">{{$t('UNITSBYFLOORPLAN')}}</div>
              <div class="table_thead">
                <div>{{$t('Plan')}}</div>
                <div>{{$t('Reserved')}}</div>
                <div>{{$t('Sold')}}</div>
                <div>{{$t('Avaliable')}}</div>
                <div>{{$t('Total')}}</div>
              </div>
              <div class="table_tbody">
                <div class="tr" v-for="item in tableData.unitsByFloorPlan">
                  <div>{{item.type}}</div>
                  <div>{{item.notReleased}}</div>
                  <div>{{item.sold}}</div>
                  <div>{{item.available}}</div>
                  <div>{{item.total}}</div>
                </div>
              </div>
            </div>
            <div class="table" v-if="tableData.unitsByBedrooms&&tableData.unitsByBedrooms.length">
              <div class="table_head">{{$t('UNITSBYBEDROOMS')}}</div>
              <div class="table_thead">
                <div>{{$t('Bdr')}}</div>
                <div>{{$t('Reserved')}}</div>
                <div>{{$t('Sold')}}</div>
                <div>{{$t('Avaliable')}}</div>
                <div>{{$t('Total')}}</div>
              </div>
              <div class="table_tbody">
                <div class="tr" v-for="item in tableData.unitsByBedrooms">
                  <div>{{item.type}}</div>
                  <div>{{item.notReleased}}</div>
                  <div>{{item.sold}}</div>
                  <div>{{item.available}}</div>
                  <div>{{item.total}}</div>
                </div>
              </div>
            </div>
            <div class="table" v-if="tableData.priceByBedroom&&tableData.priceByBedroom.length">
              <div class="table_head">{{$t('PRICEBYBEDROOM')}}</div>
              <div class="table_thead">
                <div>{{$t('Bdr')}}</div>
                <div>{{$t('AvgPSF')}}</div>
                <div>{{$t('LoPrice')}}</div>
                <div>{{$t('HiPrice')}}</div>
              </div>
              <div class="table_tbody">
                <div class="tr" v-for="item in tableData.priceByBedroom">
                  <div>{{item.type}}</div>
                  <div>{{item.avgPsf}}</div>
                  <div>{{item.minPrice}}</div>
                  <div>{{item.maxPrice}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <alert v-if="JSON.stringify(tableData) == '{}'" :alertConfig="alertConfig"></alert>
    </div>
  </div>
</template>
<script>
import alert from "@/components/alert.vue";
import { VChart } from "vux";
export default {
  nama: "Summary",
  components: {
    VChart,
    alert
  },
  props: {
    detailsInfo: {
      type: Object
    }
  },
  data() {
    return {
      isShowCanvas: false, //是否加载饼图
      total: 0, //饼图的总数量
      colorMap: {
        //饼图的配置
        Reserved: "#1FD7A5",
        Sold: "#FF444D",
        Avaliable: "#E8ECF5"
      },
      legendItems: [], //饼图右侧的描述
      pieData: [], //饼图的数据
      tableData: {}, //表格的数据
      alertConfig: {
        isShow: true,
        img: "/img/alert/noContent.png",
        err: this.$t("ComingSoon"),
        tips: this.$t("noContent")
      },
      projectInfo: {}
    };
  },
  activated() {
    this.$SetScroll(this.$refs.summaryContent, "summaryContent");
  },
  created() {
    this.$removeScrollNum("summaryContent");
    this.projectInfo = this.$route.query
  },

  mounted() {
    this.getTableData();
    this.$KeepScrollTop(this.$refs.summaryContent, "summaryContent");
    // this.projectInfo = this.$route.query
    // console.log(this.projectInfo)
  },
  watch: {},
  methods: {
    changeRightShow() {
      //整理饼图右侧的描述数据
      let seft = this;
      this.legendItems = [];
      this.pieData.map(function(obj) {
        var item = {
          name: obj.name,
          value: "" + obj.percent + "%" + "(" + obj.count + ")",
          marker: {
            symbol: "square",
            fill: seft.colorMap[obj.name],
            radius: 5
          }
        };
        seft.legendItems.push(item);
      });
    },
    renderVChart({ chart }) {
      //绘制饼图
      let seft = this;
      this.changeRightShow();
      chart.source(seft.pieData, {
        percent: {
          formatter: function formatter(val) {
            return val + "%";
          }
        }
      });
      chart.coord("polar", {
        //绘制饼图为圆环状
        transposed: true,
        radius: 0.85,
        innerRadius: 0.7
      });
      chart.guide().text({
        //绘制饼图内的总和数据
        position: ["50%", "50%"],
        content: seft.total,
        style: {
          fontSize: 24
        }
      });
      chart.guide().text({
        //绘制饼图标题
        position: ["100%", "0"],
        content: seft.projectInfo.name,
        style: {
          fontSize: 20,
          fontWeight: "bold", // 文本粗细
          fill: "#000",
        }
      });
      chart.legend({
        //绘制饼图右侧的描述数据
        position: "right",
        custom: true,
        items: seft.legendItems,
        nameStyle: {
          fill: "#808080",
          fontSize: "14"
        }, // 图例项 key 值文本样式
        valueStyle: {
          fill: "#333",
          fontSize: "14",
          fontWeight: "bold" // 图例项 value 值文本样式
        }
      });
      chart.axis(false); //关闭坐标
      chart.tooltip(false); //关闭点击饼图时弹出的提示
      chart
        .interval()
        .position("const*percent") //饼图的横坐标和纵坐标
        .color("name", function(val) {
          //根据名字匹配饼图需绘制的颜色
          return seft.colorMap[val];
        })
        .adjust("stack");

      chart.render();
    },
    getTableData() {
      //加载和刷新接口时重置饼图 以及饼图数据以及表格数据
      this.isShowCanvas = false;
      this.pieData = [];
      this.tableData = {};
      this.$Get(
        this.$api.queryReportForm,
        {
          projectId: this.detailsInfo.projectId
        },
        true
      )
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.datas;
            let length = res.datas.unitsByType.length;
            if (
              !res.datas.priceByBedroom.length &&
              !res.datas.priceByBlock.length &&
              !res.datas.priceByType.length &&
              !res.datas.unitsByBedrooms.length &&
              !res.datas.unitsByBlock.length &&
              !res.datas.unitsByFloorPlan.length &&
              !res.datas.unitsByType.length
            ) {
              this.tableData = {};
            }
            if (length) {
              let pieData = res.datas.unitsByType[length - 1];
              this.isShowCanvas = true;
              this.total = pieData.total;
              for (let key in pieData) {
                if (key == "available") {
                  this.pieData.push({
                    name: "Avaliable",
                    percent:
                      Math.round(pieData[key] / this.total * 10000) / 100.0,
                    const: "const",
                    count: pieData[key]
                  });
                } else if (key == "sold") {
                  this.pieData.push({
                    name: "Sold",
                    percent:
                      Math.round(pieData[key] / this.total * 10000) / 100.0,
                    const: "const",
                    count: pieData[key]
                  });
                } else if (key == "notReleased") {
                  this.pieData.push({
                    name: "Reserved",
                    percent:
                      Math.round(pieData[key] / this.total * 10000) / 100.0,
                    const: "const",
                    count: pieData[key]
                  });
                }
              }
            }
          } else {
            console.log("获取pdf失败");
            this.isNoData = true;
            this.alertConfig.isShow = true;
          }
        })
        .catch(err => {
          this.isNoData = true;
          this.alertConfig.isShow = true;
        });
    }
  }
};
</script>

<style lang="less">
.Summary {
  height: 100%;
  .content {
    position: absolute;
    top: 1vh;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: scroll;
    // background-color: #f1f1f2;
  }
  .title {
    padding: 15px;
    background-color: #fff;
    text-align: right;
    .btns {
      background: #5160f1;
      border-radius: 50px;
      color: #fff;
      font-size: 1.4vh;
      padding: 0.5vh 2vh;
    }
  }
  .table_lists {
    .table {
      &:first-child {
        .table_head {
          border-top: 1px solid #eceaed;
        }
      }
      .table_head {
        padding: 1vh 2vh;
        background-color: #f5f6fa;
        color: #7a848e;
        font-size: 1.8vh;
        font-weight: 600;
        border-bottom: 1px solid #eceaed;
      }
      .table_thead {
        display: flex;
        border-bottom: 1px solid #eceaed;
        background-color: #fff;
        div {
          &:first-child {
            flex: 0 0 25%;
          }
          flex: 1;
          padding: 1.5vh 0.2vh;
          font-size: 1.6vh;
          text-align: center;
          border-right: 1px solid #eceaed;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:last-child {
            border: none;
          }
        }
      }
      .table_tbody {
        .tr {
          display: flex;
          border-bottom: 1px solid #eceaed;
          background-color: #f1f1f2;
          div {
            &:first-child {
              flex: 0 0 25%;
            }
            flex: 1;
            padding: 1.5vh 0.2vh;
            font-size: 1.6vh;
            text-align: center;
            border-right: 1px solid #eceaed;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child {
              border: none;
            }
          }
        }
      }
    }
  }
}
</style>