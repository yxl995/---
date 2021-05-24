<template>
  <div class="container">
    <div style="width: 30%;margin: 50px 0 0 0">
      <img style="width: 100%" src="../assets/imgs/logo.png">
    </div>
    <h2 style="margin: 10px;">淘不到宝</h2>
    <van-field label-width="60" left-icon="envelop-o" center
               style="border-radius: 5px;margin: 10px 0;width: 80%"
               v-model="email" label="邮箱" placeholder="请输入邮箱" @update:model-value="checkEmail">
      <template v-if="mode!='login'" #right-icon>
        <van-icon v-if="emailIsLegal" color="#DF6C7E" name="checked"></van-icon>
        <van-icon v-else-if="emailIsLegal==false" color="#7232dd" name="clear"></van-icon>
      </template>
    </van-field>
    <transition name="van-slide-down">
      <div v-show="mode!='login'&&emailIsLegal==false"
           style="width: 80%;background-color: rgb(254,240,240);border-radius: 5px;text-align: initial;display: flex;align-items: center;padding: 5px;margin-top:-5px">
        <van-icon name="warning" color="rgb(245,108,108)"></van-icon>
        <span style="font-size: 14px;margin-left: 5px">请输入正确格式的邮箱</span>
      </div>
    </transition>
    <van-field type="password" label-width="60" left-icon="lock" center
               style="border-radius: 5px;margin: 10px 0;width: 80%" v-model="password"
               label="密码" placeholder="请输入密码" @update:model-value="checkPassword">
      <template v-if="mode!='login'" #right-icon>
        <van-icon v-if="passwordIsLegal" color="#DF6C7E" name="checked"></van-icon>
        <van-icon v-else-if="passwordIsLegal==false" color="#7232dd" name="clear"></van-icon>
      </template>
    </van-field>
    <transition name="van-slide-down">
      <div v-show="mode!='login'&&passwordIsLegal==false"
           style="width: 80%;background-color: rgb(254,240,240);border-radius: 5px;text-align: initial;display: flex;align-items: center;padding: 5px;margin-top:-5px">
        <van-icon name="warning" color="rgb(245,108,108)"></van-icon>
        <span style="font-size: 14px;margin-left: 5px">密码须由6-20位除空格外的字符组成</span>
      </div>
    </transition>
    <van-field v-if="mode!='login'" type="password" label-width="60" left-icon="lock" center
               style="border-radius: 5px;margin: 10px 0;width: 80%"
               v-model="confirmPassword" label="确认密码" placeholder="请再次确认密码" @update:model-value="checkConfirmPassword">
      <template #right-icon>
        <van-icon v-if="confirmPasswordIsLegal" color="#DF6C7E" name="checked"></van-icon>
        <van-icon v-else-if="confirmPasswordIsLegal==false" color="#7232dd" name="clear"></van-icon>
      </template>
    </van-field>
    <transition name="van-slide-down">
      <div v-show="mode!='login'&&confirmPasswordIsLegal==false"
           style="width: 80%;background-color: rgb(254,240,240);border-radius: 5px;text-align: initial;display: flex;align-items: center;padding: 5px;margin-top:-5px">
        <van-icon name="warning" color="rgb(245,108,108)"></van-icon>
        <span style="font-size: 14px;margin-left: 5px">密码不一致</span>
      </div>
    </transition>
    <van-field v-if="mode=='register'" label-width="60" left-icon="user-o" center
               style="border-radius: 5px;margin: 10px 0;width: 80%"
               v-model="name" label="昵称" placeholder="请输入昵称" @update:model-value="checkName">
      <template #right-icon>
        <van-icon v-if="nameIsLegal" color="#DF6C7E" name="checked"></van-icon>
        <van-icon v-else-if="nameIsLegal==false" color="#7232dd" name="clear"></van-icon>
      </template>
    </van-field>
    <transition name="van-slide-down">
      <div v-show="mode=='register'&&nameIsLegal==false"
           style="width: 80%;background-color: rgb(254,240,240);border-radius: 5px;text-align: initial;display: flex;align-items: center;padding: 5px;margin-top:-5px">
        <van-icon name="warning" color="rgb(245,108,108)"></van-icon>
        <span style="font-size: 14px;margin-left: 5px">昵称不能超过10位</span>
      </div>
    </transition>
    <div v-if="mode=='reset'" style="margin: 10px 0;width: 80%;display: flex;justify-content: space-between">
      <van-field label-width="42" left-icon="youzan-shield" center style="border-radius: 5px;width: 64%"
                 v-model="code"
                 label="验证码" placeholder="请输入验证码"/>
      <van-button style="border-radius: 5px;width: 34%" color="#DF6C7E" @click="getCode" :disabled="timerID!=null">
        {{ codeBtnText }}
      </van-button>
    </div>
    <van-button v-if="mode=='register'" style="width: 80%;font-size: large;margin: 10px 0" round
                color="linear-gradient(to right, #DF6C7E, #E1B6D3)" @click="register">注册并登录
    </van-button>
    <van-button v-else-if="mode=='reset'" style="width: 80%;font-size: large;margin: 10px 0" round
                color="linear-gradient(to right, #DF6C7E, #E1B6D3)" @click="resetPassword">重置并登录
    </van-button>
    <van-button v-else style="width: 80%;font-size: large;margin: 10px 0" round
                color="linear-gradient(to right, #DF6C7E, #E1B6D3)" @click="login">登录
    </van-button>
    <div v-if="mode=='login'" style="margin: 10px">
      <span @click="toRegister">注册账号</span> |
      <span @click="toReset">忘记密码</span>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";
import {request} from "../network/request";

export default {
  name: "Login",
  mounted() {
    this.$store.state.token = ""
  },
  data() {
    return {
      code: "",
      codeBtnText: "获取验证码",
      mode: "login",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      nameIsLegal: null,
      emailIsLegal: null,
      passwordIsLegal: null,
      confirmPasswordIsLegal: null,
      timerID: null
    }
  },
  methods: {
    checkName() {
      if (this.name == "") this.nameIsLegal = null
      else {
        if (this.name.length > 10) this.nameIsLegal = false
        else this.nameIsLegal = true
      }
    },
    checkEmail() {
      if (this.email == "") this.emailIsLegal = null
      else {
        let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.+com$/
        this.emailIsLegal = reg.test(this.email);
      }
    },
    checkPassword() {
      if (this.password == "") this.passwordIsLegal = null
      else {
        let reg = /^[\S]{6,20}$/
        this.passwordIsLegal = reg.test(this.password);
      }
    },
    checkConfirmPassword() {
      if (this.confirmPassword == "") this.confirmPasswordIsLegal = null
      else {
        if (this.password == this.confirmPassword) this.confirmPasswordIsLegal = true
        else this.confirmPasswordIsLegal = false
      }
    },
    login() {
      if (this.emailIsLegal && this.passwordIsLegal) {
        let data = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch("login", data)
      } else Toast.fail("邮箱或密码不合法")
    },
    toRegister() {
      this.$store.state.headerTitle = "注册账号"
      this.mode = "register"
      this.email = ""
      this.password = ""
      this.emailIsLegal = null
      this.passwordIsLegal = null
    },
    register() {
      if (this.nameIsLegal && this.emailIsLegal && this.passwordIsLegal && this.confirmPasswordIsLegal) {
        request({
          url: "/api/auth/register",
          method: "post",
          data: {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.confirmPassword
          }
        }).then(() => {
          Toast.success("注册成功")
          this.$store.dispatch("login", {email: this.email, password: this.password})
        }).catch(() => {
          Toast.fail("邮箱已被注册")
        })
      } else Toast.fail("昵称、邮箱或密码不合法")
    },
    toReset() {
      this.$store.state.headerTitle = "重置密码"
      this.mode = "reset"
      this.email = ""
      this.password = ""
      this.emailIsLegal = null
      this.passwordIsLegal = null
    },
    getCode() {
      if (this.emailIsLegal != true) Toast.fail("请输入合法邮箱")
      else {
        request({
          url: "/api/auth/reset/password/email/code",
          method: "post",
          data: {
            email: this.email
          }
        }).then(() => {
          Toast.success("发送成功")
          let time = 900
          this.timerID = setInterval(() => {
            time--
            if (time == 0) {
              this.codeBtnText = "获取验证码"
              window.clearInterval(this.timerID)
              this.timerID = null
            } else this.codeBtnText = time + "s"
          }, 1000)
        }).catch(() => {
          Toast.fail("邮箱不存在")
        })
      }
    },
    resetPassword() {
      if (this.emailIsLegal && this.code != "" && this.passwordIsLegal && this.confirmPasswordIsLegal) {
        request({
          url: "/api/auth/reset/password/email",
          method: "post",
          data: {
            code: this.code,
            email: this.email,
            password: this.password,
            password_confirmation: this.confirmPassword
          }
        }).then(() => {
          Toast.success("重置成功")
          this.$store.dispatch("login", {email: this.email, password: this.password})
        }).catch(err => {
          Toast.fail(err.response.data.message);
        })
      } else if (!this.emailIsLegal) Toast.fail("请输入合法邮箱")
      else if (this.code == "") Toast.fail("验证码不能为空")
      else Toast.fail("请输入合法密码")
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>