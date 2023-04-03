<template>
  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">XX近场XX检测系统</h2>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" @keyup.enter="enter()"></el-input>
      </el-form-item>
      <el-form-item>

        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item style="text-align-last: center;" label-width="0px">
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Login } from '@/api'

import CryptoJS from "crypto-js";

export default {

  data() {
    return {
      checked: false,
      form: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: 'blur' },
          { min: 3, max: 15, message: "用户名3-15位", trigger: 'blur' }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: 'blur' },
          { min: 3, max: 15, message: "密码3-15位", trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(valid) 验证通过为true，有一个不通过就是false
        if (valid) {
          // 通过的逻辑
          var code = null
          // console.log({name:this.form.name,password:this.form.password})
          Login(this.form).then(function (response) {
            console.log(response.data);
            if (response.data.code === "666") {
              this.$store.state.userName = this.form.name
              this.$store.state.userRole = response.data.role
              // this.$store.state.userRole = response.data.id
              // console.log(response.data)
              this.$router.push('home')
              if (this.checked) {
                localStorage.setItem("t", this.Encrypt(this.form.name, "qweqwe", "qweqwe"))
                localStorage.setItem("x", this.Encrypt(this.form.password, "qweqwe", "qweqwe"))
                // localStorage.setItem("e",this.form.password)
              }
              this.$notify({
                title: '成功',
                message: '登录成功',
                type: 'success'
              });
              // console.log('登录成功');
            } else {
              console.log('登录失败');
              this.$notify({
                title: '警告',
                message: '登录失败，检测账号密码是否正确！',
                type: 'warning'
              });
            }
          }.bind(this));
          console.log(code);
          if (code === '666') {
            console.log('go home');
          }
          // 
        } else {
          console.log('验证失败');
          this.$notify({
            title: '警告',
            message: '登录失败，检测服务器是否正常！',
            type: 'warning'
          });
          return false;
        }
      });
    },
    enter() {
      console.log("按下Enter");
    },
    // 点击回车键登录
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.keyCode == 13 || e.keyCode == 100) {
        this.submitForm('form'); // 定义的登录方法
      }
    },
    Encrypt(word, keyStr, ivStr) {
      const key = CryptoJS.enc.Utf8.parse(keyStr);
      const iv = CryptoJS.enc.Utf8.parse(ivStr);
      const srcs = CryptoJS.enc.Utf8.parse(word);
      const encrypted = CryptoJS.DES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },
    Decrypt(word, keyStr, ivStr) {
      // CryptoJS有以下几种
      // Base64
      // Base64url
      // Hex
      // Latin1
      // Utf8
      // Utf16
      // Utf16BE
      // Utf16LE
      const key = CryptoJS.enc.Utf8.parse(keyStr); // 对应上面的加密方法，怎么加密的怎么解密
      const iv = CryptoJS.enc.Utf8.parse(ivStr); // 对应上面的加密方法，怎么加密的怎么解密
      const base64 = CryptoJS.enc.Base64.parse(word);
      const src = CryptoJS.enc.Base64.stringify(base64);
      // 因为加密最后传出来的是Base64的，所以先按照Base64解密
      const decrypt = CryptoJS.DES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC, // 和加密保持一致
        padding: CryptoJS.pad.Pkcs7, // 和加密保持一致
      });

      const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      // 加密是先变成Utf8再变成Base64，所以解密是先Base64后Utf8
      return decryptedStr.toString();
    }

  },
  mounted() {
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
    this.form.name = this.Decrypt(localStorage.getItem("t"), "qweqwe", "qweqwe")
    // console.log(localStorage.getItem("t"))
    // console.log(localStorage.getItem("x"))
    // console.log(this.Decrypt(localStorage.getItem("x"), "qweqwe","qweqwe"))
    // console.log(this.decrypt(localStorage.getItem("x"), "qweqwe", "qweqwe"))
    this.form.password = this.Decrypt(localStorage.getItem("x"), "qweqwe", "qweqwe")
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
};
</script>

<style acoped>
.login-form {
  /* width: 350px; */
  margin: 160px auto;
  /* 上下间距160px，左右自动居中*/
  background-color: rgb(255, 255, 255, 0.8);
  /* 透明背景色 */
  padding: 30px;
  border-radius: 20px;
  /* 圆角 */
  width: 385px;
  /* border: 1px solid #eaeaea; */
  /* margin: 180px auto; */
  /* padding: 35px 35px 15px 35px; */
  /* background-color: #fff; */
  /* border-radius: 15px; */
  box-shadow: 0 0 25px rgb(102, 122, 216);
  box-sizing: border-box;
}

/* 背景 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background: url("../../assets/login.png"); */
  background-color: #8EC5FC;
  background-image: linear-gradient(225deg, #8EC5FC 0%, #E0C3FC 8%, #ffffff 16%, #ffffff 83%, #e0c3fc 92%, #8ec5fc 100%);



}

/* 标题 */
.login-title {
  color: #303133;
  text-align: center;
  margin-bottom: 25px;
}
</style> -->