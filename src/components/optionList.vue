<template>
  <div ref="optionList" class="opionList" @click.stop>
    <div class="opionList_box" @click="show=!show">{{text}}</div>
    <div class="opionList_list" ref="list" v-show="show">
      <ul>
        <li
          :class="{'actiov': item === value}"
          v-for="(item, index) in options"
          :key="index"
          @click="activeFn(item)"
        >{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'opionList',
  props: {
    value: {
      default: ''
    },
    placeholder: String,
    options: Array
  },
  data() {
    return {
      currentValue: '',
      text: '',
      show: false
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
      if(val == '') {
        this.text = this.placeholder
      }
    },
    currentValue(val) {
      this.$emit('input', val)
      this.$emit('on-change', val)
    }
  },
  mounted() {
    if (this.value == '') {
      this.text = this.placeholder
    } else {
      this.text = this.value
    }
    this.getTop(this.$refs.optionList)
    document.body.addEventListener('click', () => {
      this.show = false;
    }, false);

  },
  methods: {
    activeFn(item) {
      this.text = item
      this.currentValue = item
      this.show = false
    },
    isShow() {
      this.show = true
    },
    getTop(e) {
      let objHeight = e.clientHeight, objTop = e.offsetTop, viewHeight = document.documentElement.clientHeight
      let bottom = viewHeight - objHeight - objTop
      if(bottom < 300) {
        this.$refs.list.style.maxHeight = `${bottom}px`
      }
    }
  }
}
</script>

<style lang="less">
.opionList {
  padding: 0 30px 0 10px;
  box-shadow: 0 2px 10px #ddd;
  border-radius: 5px;
  color: #666;
  font-size: 13px;
  position: relative;
  .opionList_box {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 10px 0;
  }
  .opionList_list {
    position: absolute;
    background-color: #fff;
    z-index: 100;
    left: 0;
    right: 0;
    top: 110%;
    border-radius: 5px;
    box-shadow: 0 0 10px #ddd;
    max-height: 300px;
    overflow-y: scroll;
    ul {
      list-style: none;
      position: relative;
      li {
        padding: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
      }
      li.actiov {
        background-color: #7fb7e2;
        color: #fff;
      }
    }
  }
}
.opionList::before {
  content: " ";
  position: absolute;
  -webkit-transform: none;
  transform: none;
  width: 0;
  height: 0;
  border-style: none !important;
  border-left: 6px solid transparent !important;
  border-right: 6px solid transparent !important;
  border-top: 12px solid #999 !important;
  right: 15px;
  top: 50%;
  margin-top: -6px;
}
</style>
