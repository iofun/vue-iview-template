<template>
  <div class="container">
    <Row>
      <Col span="24">
      <Card :bordered="false" :dis-hover="true">
        <p slot="title">
          修改密码
        </p>
        <div class="content">
          <Row>
            <Col :md="24" :xl="12" :xxl="8">
            <div class="form-con">
              <Form
                ref="resetForm"
                label-position="right"
                :label-width="100"
                :model="resetModel"
                :rules="rule"
                @keydown.enter.native="handleSubmit"
              >
                <FormItem label="账户名 :">
                  {{ userName }}
                </FormItem>
                <FormItem label="真实姓名 :">
                  {{ realName }}
                </FormItem>
                <FormItem label="旧密码 :" prop="old">
                  <Input
                    v-model="resetModel.old"
                    placeholder="请输入旧密码"
                    :maxlength="30"
                    type="password"
                    password
                  ></Input>
                </FormItem>
                <FormItem label="新密码 :" prop="new">
                  <Input
                    v-model="resetModel.new"
                    :maxlength="30"
                    placeholder="请输入新密码"
                    type="password"
                    password
                  ></Input>
                </FormItem>
                <FormItem label="确认密码 :" prop="confirm">
                  <Input
                    v-model="resetModel.confirm"
                    :maxlength="30"
                    placeholder="请再次输入密码"
                    type="password"
                    password
                  ></Input>
                </FormItem>
                <FormItem>
                  <div class="btn-group">
                    <Button size="default" type="primary" @click="handleSubmit('resetForm')">
                      <Icon size="16" type="md-checkmark-circle-outline" />
                      保存
                    </Button>
                  </div>
                </FormItem>
              </Form>
            </div>
            </Col>
          </Row>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import apiAuth from '@/api/auth';

export default {
  name: 'ResetPassword',
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else {
        if (this.resetModel.new !== value) {
          callback(new Error('确认密码不一致'));
        }
        callback();
      }
    };
    return {
      resetModel: {
        old: '',
        new: '',
        confirm: ''
      },
      rule: {
        old: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 8, message: '至少8位字符', trigger: 'blur' }
        ],
        new: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { type: 'string', min: 8, message: '至少8位字符', trigger: 'blur' }
        ],
        confirm: [
          { required: true, validator: validateConfirm, trigger: 'blur' },
          { type: 'string', min: 8, message: '至少8位字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    userName() {
      return this.$store.state.auth.account.userName;
    },
    realName() {
      return this.$store.state.auth.account.realName;
    }
  },
  methods: {
    // 保存
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        // 检查完毕
        if (valid) {
          this.handleResetPassword();
        }
      });
    },
    // 修改密码
    async handleResetPassword() {
      const param = {
        old_password: this.resetModel.old,
        password: this.resetModel.new,
        password_confirmation: this.resetModel.confirm
      };
      const res = await apiAuth.resetPassword(param);
      if (res.code === 1) {
        this.$Message.success(res.msg);
      } else {
        this.$Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  min-height: 100%;
  background: #fff;
  .form-con {
    padding: 20px 10px;
    .btn-group {
      margin-top: 18px;
    }
    .ivu-form-item-error-tip {
      font-size: 14px;
    }
    .ivu-input:focus {
      box-shadow: none;
    }
    .ivu-btn:focus {
      box-shadow: none;
    }
    input {
      -webkit-appearance: none;
    }
  }
}
</style>
