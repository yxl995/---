<template>
  <div v-if="$store.state.token!=''">
    <div class="info">
      <div class="left">
        <img style="width: 100%;height: 100%" :src="$store.state.user.avatar_url" id="head">
      </div>
      <div class="right">
        <van-field label-width="40" center style="border-radius: 5px;margin: 5px 0" v-model="$store.state.tempName"
                   label="昵称" placeholder="请输入昵称" :readonly="!isEdit">
          <template #button>
            <van-button v-if="!isEdit" color="#E08BA7" size="small" @click="changeEdit">修改</van-button>
            <template v-else>
              <van-button style="margin: 0 5px" color="#DF6C7E" size="small" @click="finishEdit">完成</van-button>
              <van-button size="small" @click="changeEdit">取消</van-button>
            </template>
          </template>
        </van-field>
        <van-field label-width="40" center style="border-radius: 5px;margin: 5px 0" v-model="$store.state.user.phone"
                   label="手机"
                   readonly/>
        <van-field label-width="40" center style="border-radius: 5px;margin: 5px 0" v-model="$store.state.user.email"
                   label="邮箱"
                   readonly/>
      </div>
    </div>
    <van-list style="width: 90%;margin: 0 auto">
      <van-cell style="border-bottom:1px solid #E1B6D3;background-color: #F9EAE0;text-align: initial;color: #DF6C7E"
                center icon="star" title="我的收藏"
                is-link to="/collect"/>
      <van-cell style="border-bottom:1px solid #E1B6D3;background-color: #F9EAE0;text-align: initial;color: #DF6C7E"
                center icon="balance-list" title="我的订单"
                is-link to="/orderList"/>
      <van-cell style="border-bottom:1px solid #E1B6D3;background-color: #F9EAE0;text-align: initial;color: #DF6C7E"
                center icon="setting" title="账号管理"
                is-link @click="toManageInfo"/>
      <van-cell style="background-color: #F9EAE0;text-align: initial;color: #DF6C7E"
                center icon="location" title="地址管理"
                is-link to="/manageAddress"/>
    </van-list>
    <van-button @click="logout" style="width: 50%;font-size: large;margin: 10px 0" round
                color="linear-gradient(to right, #DF6C7E, #E1B6D3)">退出登录
    </van-button>
    <van-action-sheet v-model:show="actionShow" :actions="actions" cancel-text="取消" close-on-click-action/>
  </div>
  <div v-else>
    <van-empty description="请先登录"/>
    <van-button @click="login" style="width: 50%;font-size: large;margin: 10px 0" round
                color="linear-gradient(to right, #DF6C7E, #E1B6D3)">登录
    </van-button>
  </div>
</template>

<script>
import {request} from "../network/request";
import {Toast} from "vant"

export default {
  name: "Info",
  mounted() {
    if (this.$store.state.token != "") {
      this.$store.dispatch("getInfo")
      request({
        url: "/api/auth/oss/token",
        headers: {
          'Authorization': "Bearer " + this.$store.state.token
        }
      }).then(res => {
        let uploader = new plupload.Uploader({
          browse_button: 'head',
          url: 'http://oss.aliyuncs.com',
          filters: [{title: "Image files", extensions: "jpg,png"}]
        })
        uploader.init()
        let fileKey
        uploader.bind('FilesAdded', function (uploader, files) {
          fileKey = new Date().getTime() + files[0].name
          let new_multipart_params = {
            'key': fileKey,
            'policy': res.data.policy,
            'OSSAccessKeyId': res.data.accessid,
            'success_action_status': '200',
            'signature': res.data.signature
          }
          uploader.setOption({
            'url': res.data.host,
            'multipart_params': new_multipart_params
          })
          uploader.start()
        })
        uploader.bind('FileUploaded', (uploader, files, data) => {
          if (data.status == 200)
            request({
              url: "/api/user/avatar",
              method: "patch",
              headers: {
                'Authorization': "Bearer " + this.$store.state.token
              },
              data: {
                avatar: fileKey
              }
            }).then(() => {
              this.$toast.success("上传成功")
              this.$store.dispatch("getInfo")
            }).catch(() => {
              this.$toast.fail("上传失败")
            })
        })
      })
    }
  },
  data() {
    return {
      headShow: 0,
      isEdit: false,
      actionShow: false,
      actions: [{
        name: "修改密码",
        callback: () => {
          this.$router.push({name: "ManageInfo", params: {mode: "password"}})
        }
      }, {
        name: "换绑手机",
        callback: () => {
          this.$router.push({name: "ManageInfo", params: {mode: "phone"}})
        }
      }, {
        name: "修改邮箱",
        callback: () => {
          this.$router.push({name: "ManageInfo", params: {mode: "email"}})
        }
      }]
    }
  },
  methods: {
    toManageInfo() {
      this.actionShow = true
    },
    changeEdit() {
      this.isEdit = !this.isEdit
      this.$store.state.tempName = this.$store.state.user.name
    },
    finishEdit() {
      if (this.$store.state.tempName != "") {
        this.isEdit = false
        if (this.$store.state.tempName != this.$store.state.user.name) {
          request({
            url: "/api/user",
            method: "put",
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            },
            data: {
              name: this.$store.state.tempName
            }
          }).then(res => {
            if (res.status == 204) {
              this.$store.state.user.name = this.$store.state.tempName
              Toast.success("修改成功")
            }
          })
        } else
          Toast.success("修改成功")
      } else {
        Toast.fail("昵称不能为空")
      }
    },
    logout() {
      this.$dialog.confirm({
        title: '提示',
        message: '您确认要退出登录吗',
        confirmButtonColor: "#DF6C7E",
        closeOnClickOverlay: true
      }).then(() => {
        this.$store.dispatch("logout")
      }).catch(() => {
      })
    },
    login() {
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 300px;
  justify-content: space-evenly;
}

.left {
  width: 112px;
  height: 112px;
  border-radius: 112px;
  overflow: hidden;
}

.right {
  width: 70%;
}
</style>