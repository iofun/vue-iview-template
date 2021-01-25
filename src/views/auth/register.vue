<template>
  <div class="auth">
    <div class="auth-main">
      <div class="auth-box">
        <div class="auth-title">注册账号</div>
        <div class="auth-con">
          <div class="form-con">
            <template>
              <Form
                ref="registerFormEle"
                :model="registerForm"
                :rules="validateRules"
                @keydown.enter.native="handleSubmitRegister"
              >
                <FormItem prop="userEmail">
                  <Input
                    v-model="registerForm.userEmail"
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
                <FormItem prop="password">
                  <Input
                    v-model="registerForm.password"
                    size="large"
                    placeholder="密码(至少6位字符)"
                    :disabled="passwordDisabled"
                    :maxlength="30"
                    type="password"
                    password
                  >
                  <span slot="prepend">
                    <Icon :size="18" type="ios-lock-outline" />
                  </span>
                  </Input>
                </FormItem>
                <FormItem prop="checkPassword">
                  <Input
                    v-model="registerForm.checkPassword"
                    size="large"
                    placeholder="确认密码"
                    :disabled="passwordDisabled"
                    :maxlength="30"
                    type="password"
                    password
                  >
                  <span slot="prepend">
                    <Icon :size="18" type="ios-lock-outline" />
                  </span>
                  </Input>
                </FormItem>
                <FormItem prop="verifyCode">
                  <Row type="flex" justify="space-between">
                    <Col span="15">
                    <Input
                      v-model="registerForm.verifyCode"
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
                    <Button type="default" size="large" long @click="handleValidateField('registerFormEle')">
                      {{ getVerifyCodeText }}
                    </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  <Button type="primary" size="large" long @click="handleValidate('registerFormEle')">立即注册</Button>
                </FormItem>
              </Form>
            </template>
          </div>
          <div class="other-con">
            <router-link to="/forget">忘记密码?</router-link>
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
      if (value !== this.registerForm.password) {
        callback(new Error('输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      getVerifyCodeText: '获取验证码',
      isCanSend: true, // 是否可以发送验证码
      passwordDisabled: false, // 密码框是否禁止输入
      registerForm: {
        userEmail: '',
        password: '',
        checkPassword: '',
        verifyCode: ''
      },
      validateRules: {
        // 校验规则
        userEmail: [{ type: 'email', required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '至少6位字符', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { type: 'string', validator: validateCheckPassword, trigger: 'blur' }
        ],
        verifyCode: [{ type: 'string', required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 校验所有填写内容
    handleValidate(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.handleSubmitRegister();
        } else {
          this.$Message.error('请检查输入内容!');
        }
      });
    },
    // 校验个别填写内容
    handleValidateField(name) {
      this.$refs[name].validateField('userEmail', (error) => {
        if (error) return false;
        this.$refs[name].validateField('password', (error) => {
          if (error) return false;
          this.$refs[name].validateField('checkPassword', (error) => {
            if (error) return false;
            this.handleSendVerifyCode();
          });
        });
      });
    },
    // 获取验证码
    async handleSendVerifyCode() {
      if (!this.isCanSend) return false;

      // 获取验证码参数
      const params = {
        to: this.registerForm.userEmail,
        subject: '这里是注册文本',
        text: '这里是注册文本',
        tpl: 'register'
      };
      const res = await apiAuth.getRegisterVerifyCode(params);
      if (res.code === 1) {
        this.$Message.success('发送成功，注意邮件查收');
        this.passwordDisabled = true;
        this.handleCountdown();
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 立即注册接口
    async handleSubmitRegister() {
      const res = await apiAuth.register(this.registerForm);
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
          this.passwordDisabled = false;
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
