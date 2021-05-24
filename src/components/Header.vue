<template>
  <div class="header">
    <div class="left">
      <slot name="left">
        <van-icon name="arrow-left" @click="back"></van-icon>
      </slot>
    </div>
    <div class="middle">{{ $store.state.headerTitle }}</div>
    <div class="right">
      <van-icon name="share-o" @click="share"></van-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    share() {
      this.$store.commit("changeShowShare")
    },
    back() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  background-color: #E1B6D3;
  color: white;
  font-weight: bold;
  font-size: large;
  height: 50px;
  display: flex;
  align-items: center;
}

.left, .right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.middle {
  flex: 8;
}
</style>