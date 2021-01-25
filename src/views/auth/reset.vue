<template>
  <div class="auth">
    <div class="auth-main">
      <div class="auth-box">
        <div class="auth-title">{{ appName }}</div>
        <div class="auth-con">
          <div class="form-con">
            <template>
              <Form
                ref="resetFormEle"
                :model="resetForm"
                :rules="validateRules"
                @keydown.enter.native="handleValidate('resetFormEle')"
              >
                <FormItem prop="password">
                  <Input v-model="resetForm.password" size="large" placeholder="新密码" password type="password">
                  <span slot="prepend">
                    <Icon :size="18" type="ios-lock-outline" />
                  </span>
                  </Input>
                </FormItem>
                <FormItem prop="checkPassword">
                  <Input
                    v-model="resetForm.checkPassword"
                    size="large"
                    placeholder="确认新密码"
                    password
                    type="password"
                  >
                  <span slot="prepend">
                    <Icon :size="18" type="ios-lock-outline" />
                  </span>
                  </Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" size="large" long @click="handleValidate('resetFormEle')">重置密码</Button>
                </FormItem>
              </Form>
            </template>
          </div>
          <div class="other-con">
            <router-link to="/register">注册帐户</router-link>
            <router-link to="/login">返回登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiAuth from '@/api/auth';

export default {
  data() {
    const validateCheckPassword = (rule, value, callback) => {
      if (value !== this.resetForm.password) {
        callback(new Error('输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      resetForm: {
        password: '',
        checkPassword: '',
        verify_md5: this.$route.params.md5
      },
      validateRules: {
        // 校验规则
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '至少6位字符', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { type: 'string', validator: validateCheckPassword, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    appName() {
      return this.$config.title;
    }
  },
  methods: {
    // 校验所有填写内容
    handleValidate(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.handleSubmitReset();
        } else {
          this.$Message.error('请检查输入内容!');
        }
      });
    },
    async handleSubmitReset() {
      const res = await apiAuth.resetPassword(this.resetForm);
      if (res.code === 1) {
        this.$Message.success(res.msg);
        setTimeout(() => {
          this.$router.push({
            name: 'login'
          });
        }, 1000);
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
