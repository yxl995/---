<template>
  <div class="container">
    <van-collapse style="width: 35%;float: left;position: fixed;top: 50px" v-model="activeCollapse"
                  accordion
                  @change="changeCollapse">
      <van-collapse-item style="background-color: black" v-for="parentBar in categoryList"
                         :key="parentBar.id" :title="parentBar.name"
                         :name="parentBar.name">
        <van-sidebar style="width: 100%" v-model="activeSideBar">
          <van-sidebar-item @click="changeSidebar(childBar)" v-for="childBar in parentBar.children"
                            :key="childBar.id" :title="childBar.name"/>
        </van-sidebar>
      </van-collapse-item>
    </van-collapse>
    <van-list v-model:loading="loading" :finished="finished" :offset="0" @load="getCategoryGood"
              finished-text="没有更多了哦" style="width: 65%;float: right;">
      <van-card v-for="(item,index) in goodList" :key="item.id" :price="item.price" :title="item.title"
                :desc="changeTimeStyle(item.updated_at)"
                :thumb="item.cover_url" @click-thumb.stop="imagePreview(index)" @click="toDetail(item)"/>
    </van-list>
  </div>
</template>

<script>
import {request} from "../network/request";
import {ImagePreview} from "vant";

export default {
  name: "Category",
  data() {
    return {
      activeCollapse: this.$store.state.categoryList[0].name,
      activeSideBar: 0,
      loading: false,
      finished: false,
      categoryList: [],
      checkedSiderBar: {},
      goodList: []
    }
  },
  mounted() {
    this.$store.state.categoryList.forEach(parent => {
      this.categoryList.push(parent)
      parent.children.forEach(child => {
        child.page = 1
      })
    })
    this.checkedSiderBar = this.categoryList[0].children[0]
  },
  methods: {
    changeTimeStyle(time) {
      let temp = time.split('T')
      return temp[0] + " " + temp[1].split('.')[0]
    },
    imagePreview(index) {
      let array = []
      array.push(this.goodList[index].cover_url)
      ImagePreview(array)
    },
    changeCollapse(activeNames) {
      this.activeSideBar = 0
      this.categoryList.forEach(item => {
        if (item.name == activeNames) {
          this.checkedSiderBar = item.children[0]
        }
      })
      document.documentElement.scrollTop = 0
      this.getCategoryGood()
    },
    changeSidebar(item) {
      this.checkedSiderBar.page = 1
      this.checkedSiderBar = item
      this.loading = false
      this.finished = false
      document.documentElement.scrollTop = 0
      this.getCategoryGood()
    },
    getCategoryGood() {
      let params = {
        page: this.checkedSiderBar.page,
        category_id: this.checkedSiderBar.id
      }
      request({
        url: "/api/goods",
        params
      }).then(res => {
        setTimeout(() => {
          this.loading = false
          if (res.data.goods.data.length == 0) this.finished = true
          else this.goodList = res.data.goods.data
        }, 300)
      })
      this.checkedSiderBar.page++
    },
    toDetail(item) {
      this.$router.push({name: 'GoodDetail', params: {id: item.id}})
    }
  }
}
</script>

<style scoped>

.container {
  min-height: calc(100vh - 100px);
  background-color: white;
  overflow: hidden;
}
</style>
