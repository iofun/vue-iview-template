<template>
  <div class="auth">
    <div class="auth-main">
      <div class="auth-box">
        <div class="auth-title">{{ appName }}</div>
        <div class="auth-con">
          <div class="form-con">
            <template>
              <Form
                ref="loginFormEle"
                :model="loginForm"
                :rules="validateRules"
                @keydown.enter.native="handleValidate('loginFormEle')"
              >
                <FormItem prop="username">
                  <Input v-model="loginForm.username" size="large" placeholder="请输入账号" type="text">
                  <span slot="prepend">
                    <Icon :size="18" type="ios-contact-outline" />
                  </span>
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <Input v-model="loginForm.password" size="large" placeholder="密码" type="password" password>
                  <span slot="prepend">
                    <Icon :size="18" type="ios-lock-outline" />
                  </span>
                  </Input>
                </FormItem>
              </Form>
            </template>
          </div>
          <div class="remember-con">
            <Checkbox v-model="rememberPwd" @on-change="rememberOnChange">记住密码</Checkbox>
            <!-- <router-link to="/forget">忘记密码?</router-link> -->
          </div>
          <div class="action-con">
            <Button type="primary" size="large" long @click="handleValidate('loginFormEle')">登 入</Button>
          </div>
          <!-- <div class="other-con">
            <router-link to="/forget">忘记密码?</router-link>
            <router-link to="/register">注册帐户</router-link>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiAuth from '@/api/auth';
import { setCookies, getCookies, removeCookies } from '@/utils/cookies';
import config from '@/config';

export default {
  data() {
    return {
      rememberPwd: false, // 是否记住账号密码
      loginForm: {
        username: '',
        password: ''
      },
      // 校验规则
      validateRules: {
        username: [
          { required: true, message: '请输入账户名', trigger: 'blur' }
          // { type: 'email', message: '请输入正确的账户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '至少6位字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    appName() {
      return this.$config.title;
    }
  },
  mounted() {
    // 获取记住密码
    this.setDefaultName();
  },
  methods: {
    ...mapActions(['actionLogin']),
    // 校验所有填写内容
    handleValidate(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.handleSubmitLogin();
        } else {
          this.$Message.error('请检查输入内容!');
        }
      });
    },
    // 记住密码
    rememberOnChange(val) {
      if (!val) {
        removeCookies(`${config.tokenPrefix}TOKEN`);
        removeCookies(`${config.tokenPrefix}PASSWORD`);
      }
    },
    // 默认账号密码
    setDefaultName() {
      if (getCookies(`${config.tokenPrefix}USER`) && getCookies(`${config.tokenPrefix}USER`) !== 'null') {
        this.loginForm.username = getCookies(`${config.tokenPrefix}USER`);
        if (getCookies(`${config.tokenPrefix}PASSWORD`) && getCookies(`${config.tokenPrefix}PASSWORD`) !== 'null') {
          this.loginForm.password = atob(getCookies(`${config.tokenPrefix}PASSWORD`));
          this.rememberPwd = true;
        }
      }
    },
    async handleSubmitLogin() {
      // 请求登录
      const res = await apiAuth.login(this.loginForm);
      if (res.code === 1) {
        const token = res.data.token;
        this.actionLogin(token);
        if (this.rememberPwd) {
          setCookies(`${config.tokenPrefix}TOKEN`, token, { expires: 1 });
          setCookies(`${config.tokenPrefix}USER`, this.loginForm.username, { expires: 1 });
          setCookies(`${config.tokenPrefix}PASSWORD`, btoa(this.loginForm.password), { expires: 1 });
        } else {
          setCookies(`${config.tokenPrefix}TOKEN`, token);
          removeCookies(`${config.tokenPrefix}USER`);
          removeCookies(`${config.tokenPrefix}PASSWORD`);
        }
        this.$router.push({
          name: this.$config.pageName.home
        });
      } else {
        this.$Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../style/auth.less';
</style>
