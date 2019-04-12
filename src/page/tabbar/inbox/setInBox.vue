<template>
  <div class="setInBox">
    <x-header :eft-options.preventGoBack="true" class="nav_head" :left-options="{backText: ''}">
      {{$t('messageSet')}}
      <!-- <span slot="right">Save</span> -->
    </x-header>
    <div class="setInBox_continer">
      <cell
        class="setAll"
        :title="$t('SelectAll')"
        :inline-desc="$t('GetStatusPpdatedForSelectedProjects')"
      >
        <mt-switch @change="SetAllFn" v-model="setAll"></mt-switch>
      </cell>
      <mt-checklist
        class="projectList"
        align="right"
        :title="$t('ProjectList')"
        v-model="activeProject"
        :options="projectList"
      ></mt-checklist>
    </div>
  </div>
</template>
<script>
export default {
  name: 'setInBox',
  data() {
    return {
      projectList: [],
      activeProject: [],
      setAll: false
    }
  },
  watch: {
    activeProject(val) {
      if(val.length === this.projectList.length) {
        this.setAll = true
      } else {
        this.setAll = false
      }
      localStorage.setItem('SetInbox', JSON.stringify(this.activeProject))
    }
  },
  mounted() {
    this.queryBrokeAgentProject()
  },
  methods: {
    SetAllFn(val) {
       if(!val) {
        this.activeProject = this.projectList.map(item => {
          return item.value
        })
      } else {
        this.activeProject = []
      }
      console.log(val)
    },
    queryBrokeAgentProject() {
      this.$Get(this.$api.queryBrokeProject, {type: 1}).then(res => {
        if(res.code == 0) {
          if(res.datas) {
            this.projectList = res.datas.map(item => {
              let data = {
                label: item.projectName,
                value: item.projectId
              }
              return data
            })
            let setInboxInfo = JSON.parse(localStorage.getItem('SetInbox'))
            this.activeProject = setInboxInfo
            if(!setInboxInfo) {
              this.activeProject = this.projectList.map(item => {
                return item.value
              })
            } else {
              this.activeProject = setInboxInfo
            }
          }
        }
      })
    }
  },
}
</script>
<style lang="less">
.setInBox {
  height: 100%;
  .setInBox_continer {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    .setAll {
      border-bottom: 5px solid #f4f4f4;
      .vux-label-desc {
        color: #999;
      }
    }
    .projectList {
      .mint-checklist-title {
        margin: 10px 15px 0 15px;
        font-size: 15px;
      }
      .mint-cell {
        border-bottom: 1px solid #f4f4f4;
        .mint-cell-wrapper {
          padding: 0 15px;
          background-image:none;
          .mint-checklist-label {
            padding: 0;
            .mint-checkbox-label {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
