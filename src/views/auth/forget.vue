<template>
  <div class="auth">
    <div class="auth-main">
      <div class="auth-box">
        <div class="auth-title">忘记密码</div>
        <div class="auth-con">
          <div class="form-con">
            <template>
              <Form
                ref="forgetFormEle"
                :model="forgetForm"
                :rules="validateRules"
                @keydown.enter.native="handleSubmitForget"
              >
                <FormItem prop="userEmail">
                  <Input
                    v-model="forgetForm.userEmail"
                    size="large"
                    placeholder="请输入邮箱"
                    type="text"
                    :maxlength="30"
                  >
                  <span slot="prepend">
                    <Icon :size="18" type="ios-contact-outline" />
                  </span>
                  </Input>
                </FormItem>
                <FormItem prop="verifyCode">
                  <Row type="flex" justify="space-between">
                    <Col span="15">
                    <Input
                      v-model="forgetForm.verifyCode"
                      size="large"
                      placeholder="验证码"
                      type="text"
                      :maxlength="6"
                    >
                    <span slot="prepend">
                      <Icon :size="18" type="md-checkmark-circle-outline" />
                    </span>
                    </Input>
                    </Col>
                    <Col span="8" class="col-right">
                    <Button type="default" size="large" long @click="handleValidateField('forgetFormEle')">
                      {{ getVerifyCodeText }}
                    </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  <Button type="primary" size="large" long @click="handleValidate('forgetFormEle')">找回密码</Button>
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
    return {
      getVerifyCodeText: '获取验证码',
      isCanSend: true, // 是否可以发送验证码
      forgetForm: {
        userEmail: '',
        verifyCode: ''
      },
      validateRules: {
        // 校验规则
        userEmail: [{ type: 'email', required: true, message: '请输入邮箱', trigger: 'blur' }],
        verifyCode: [{ type: 'string', required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 校验所有填写内容
    handleValidate(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.handleSubmitForget();
        } else {
          this.$Message.error('请检查输入内容!');
        }
      });
    },
    // 校验个别填写内容
    handleValidateField(name) {
      this.$refs[name].validateField('userEmail', (error) => {
        if (error) return false;
        this.handleSendVerifyCode();
      });
    },
    // 获取验证码
    async handleSendVerifyCode() {
      if (!this.isCanSend) return false;

      // 获取验证码参数
      const params = {
        to: this.forgetForm.userEmail,
        subject: '找回密码获取验证码',
        text: '找回密码获取验证码',
        tpl: 'forget'
      };
      const res = await apiAuth.getForgetVerifyCode(params);
      if (res.code === 1) {
        this.$Message.success('发送成功，注意邮件查收');
        this.handleCountdown();
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 忘记密码接口
    async handleSubmitForget() {
      const res = await apiAuth.forget(this.forgetForm);
      if (res.code === 1) {
        this.$Message.success(res.msg);
        setTimeout(() => {
          this.$router.push({
            name: 'login'
          });
          this.$router.push({
            name: 'resetPassword',
            params: { md5: res.data }
          });
        }, 1000);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 倒计时
    handleCountdown() {
      let timer = 60;
      this.isCanSend = false;
      const codeIimer = setInterval(() => {
        timer = timer - 1;
        if (timer <= 0) {
          clearInterval(codeIimer);
          this.getVerifyCodeText = '获取验证码';
          this.isCanSend = true;
        } else {
          this.getVerifyCodeText = '重新发送( ' + timer + 's )';
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../style/auth.less';
</style>
