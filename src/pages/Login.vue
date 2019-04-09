<template>
<div class='login-container'>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px">
    <h3 class="title">高危作业系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input :type="pwdType" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" @keyup.enter.native="handleSubmit"></el-input>
      <i class='el-icon-view seePwd' @click='showPwd'></i>
    </el-form-item>
    <div class="options">
      <el-radio v-model="loginType" label="outSide" style='color: #acabab;width: 50%;'>外部用户</el-radio>
      <el-radio v-model="loginType" label="inner" style='color: #acabab'>内部用户</el-radio>
    </div>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import { innerLogin, outLogin, getRootList } from '../api/api'
  import MenuUtils from '../utils/createMenu.js'
  export default {
    data() {
      return {
        pwdType: 'password',
        logining: false,
        loginType: 'inner',
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        para: {
          pager: { rows: 9999, page: 1, sort: '', order: 'DESC', totalRows: 0, totalPages: 0 },
          queryStr: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        routers: [],
        checked: true
      };
    },
    methods: {
      handleReset () {
          this.ruleForm2.account = '',
          this.ruleForm2.checkPass = ''
      },
      createTree (data) {
        MenuUtils(this.routers, data)
      },
      handleSubmit (ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { UserName: this.ruleForm2.account, Password: this.ruleForm2.checkPass };
            if (this.loginType === 'inner') {
              innerLogin(loginParams).then(data => {
                this.logining = false;
                let { type, value, message } = data.data;
                if ( type !== 1) {
                  this.$notify({
                    title: '错误',
                    message: message,
                    type: 'error',
                    duration: 1000
                  });
                } else {
                  this.para.queryStr = value.split(',')[1]
                  getRootList(this.para).then(res => {
                    if (res.data.rows.length != 0) {
                      sessionStorage.setItem('treeString', res.data.rows[0].ModuleID)
                      this.$emit('login');
                      this.$router.push({path: '/welcome'})
                    }  
                  })
                  sessionStorage.setItem('only_sign', value)
                  sessionStorage.setItem('user', this.ruleForm2.account)
                  sessionStorage.setItem('userType', this.loginType)
                }
              })
            }else {
              outLogin(loginParams).then(data => {
                this.logining = false;
                let { type, value, message } = data.data;
                if ( type !== 1) {
                  this.$notify({
                    title: '错误',
                    message: message,
                    type: 'error',
                    duration: 1000
                  });
                } else {
                  this.para.queryStr = value.split(',')[1]
                  getRootList(this.para).then(res => {
                    if (res.data.rows.length != 0) {
                      sessionStorage.setItem('treeString', res.data.rows[0].ModuleID)
                      this.$emit('login');
                    }
                    this.$router.push({path: '/welcome'})
                  })
                  sessionStorage.setItem('only_sign', value)
                  sessionStorage.setItem('user', this.ruleForm2.account)
                  sessionStorage.setItem('userType', this.loginType)
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      showPwd () {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        }else {
          this.pwdType = 'password'
        }
      }
    },
    mounted () {
     sessionStorage.clear();
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    background: url('../../static/login_bg.png') no-repeat center center;
    background-size: cover;
    height: 100%;
    width: 100%;
    height: 100vh;
    form {
      position: absolute;
      left: 0;
      right: 0;
      width: 350px;
      padding: 35px 35px 15px;
      margin: 120px auto;
      background: rgba(32, 44, 60, 0.7);
      border-radius: 4px;
      .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        .seePwd {
          position: absolute;
          top: 14px;
          right: 10px;
          cursor: pointer;
        }
      }
      .title {
        font-size: 26px;
        font-weight: 400;
        color: #eee;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #eee;
        height: 47px;
      }
    }
    .options {
      width:95%;
      margin:0 auto;
      margin-bottom: 10px;
      .reset {
        text-align: right;
        color: #acabab;
        cursor: pointer
      }
    }
  }
</style>
