<template>
  <div class="container" @click="toDetail">
    <div class="img">
      <img style="width: 100%" :src="obj.cover_url">
    </div>
    <div class="name">{{ obj.title.length > 8 ? obj.title.slice(0, 8) + "..." : obj.title }}</div>
    <div class="bottom">
      <div class="price">
        <div style="font-size: 20px">￥</div>
        <div>{{ obj.price }}</div>
      </div>
      <div v-if="obj.hasOwnProperty('stock')" class="stock">库存{{ obj.stock }}件</div>
      <div v-else class="stock">{{ obj.collects_count }}人收藏</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodCard",
  props: {
    obj: Object
  },
  methods: {
    toDetail() {
      this.$router.push({name: 'GoodDetail', params: {id: this.obj.id}})
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  border-radius: 10px;
  padding: 0 10px;
  margin: 10px 10px;
  box-shadow: 5px 5px 5px lightgray;
}

.container:hover {
  box-shadow: 0 0 5px lightgray;
}

.img {
  width: 100%;
  margin: 10px 0;
}

.name {
  width: 100%;
  font-size: 16px;
}

.bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 10px 0;
}

.price {
  display: flex;
  align-items: flex-end;
  color: #fc5185;
  font-weight: bold;
}

.stock {
  color: #8785a2;
  font-size: 10px;
}
</style>