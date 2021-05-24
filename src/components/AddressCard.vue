<template>
  <div class="box">
    <slot name="left" :address="address">
      <div class="left">
        <van-icon v-if="address.is_default==1" name="checked"></van-icon>
        <van-icon v-else name="circle" @click="setDefault"></van-icon>
      </div>
    </slot>
    <div class="middle">
      <div class="up">{{ address.name }} {{ address.phone }}
        <div v-if="address.is_default==1" class="default">默认</div>
      </div>
      <div class="down">{{ fullAddress }}</div>
    </div>
    <slot name="right">
      <div class="right">
        <van-icon size="25" name="edit" @click="editAddress"></van-icon>
      </div>
    </slot>
    <slot name="close">
      <div class="close">
        <van-icon name="clear" @click="deleteAddress"></van-icon>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "AddressCard",
  props: {
    address: Object
  },
  data() {
    return {
      fullAddress: ""
    }
  },
  mounted() {
    if (this.address.province == this.address.city) this.fullAddress = this.address.city + this.address.county + this.address.address
    else this.fullAddress = this.address.province + this.address.city + this.address.county + this.address.address
  },
  methods: {
    editAddress() {
      this.$emit("editAddress", this.address)
    },
    deleteAddress() {
      this.$emit("deleteAddress", this.address.id)
    },
    setDefault() {
      this.$emit("setDefault", this.address.id)
    }
  }
}
</script>
<style scoped>
.box {
  width: 90%;
  border-radius: 10px;
  background-color: #8785a2;
  margin: 10px;
  display: flex;
  position: relative;
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.middle {
  display: flex;
  flex-direction: column;
  flex: 7;
  color: white;
  text-align: initial;
}

.right {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 2;
  color: white;
}

.up {
  margin: 10px;
  display: flex;
  align-items: center;
}

.down {
  font-size: 12px;
  margin: 0 0 10px 10px;
}

.close {
  position: absolute;
  top: 5px;
  right: 5px;
}

.default {
  background-color: #DF6C7E;
  font-size: 14px;
  padding: 1px 5px;
  border-radius: 19px;
  margin: 0 5px;
}
</style>