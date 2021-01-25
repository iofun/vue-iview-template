import qs from 'qs';
import { handleApi } from '@/utils/handleApi';

// 请求方法'GET'，'PUT', 'POST', 'PATCH', 'DELETE', 参数为 data:{xxxx}
// baseURL: 'https://xxx.com/api/', 特定请求api声明
// notload 接口是否不用loading（有轮询时设置为true）

export default {
  // 登录
  login(params) {
    return handleApi({
      url: 'authorizations',
      data: params,
      method: 'POST'
    });
  },
  // 获取用户信息
  getUserInfo() {
    return handleApi({
      url: 'user/info',
      method: 'GET'
    });
  },
  // 获取动态路由
  getRouterList() {
    return handleApi({
      url: 'user/menus',
      method: 'GET'
    });
  },
  // 注册
  register(params) {
    return handleApi({
      url: 'register',
      data: params,
      method: 'POST'
    });
  },
  // 注册获取验证码
  getRegisterVerifyCode(params) {
    return handleApi({
      url: 'sendMail',
      data: params,
      method: 'POST'
    });
  },
  // 忘记密码获取验证码
  getForgetVerifyCode(params) {
    return handleApi({
      url: 'sendMail',
      data: params,
      method: 'POST'
    });
  },
  // 忘记密码
  forget(params) {
    return handleApi({
      url: 'forget',
      data: params,
      method: 'POST'
    });
  },
  // 修改密码
  resetPassword(params) {
    return handleApi({
      url: 'user/password',
      data: qs.stringify(params),
      method: 'PUT'
    });
  },
  // 生成新密码
  createPassword(params) {
    return handleApi({
      url: 'password',
      data: params,
      method: 'GET'
    });
  },
  // 退出登录
  logout(params) {
    return handleApi({
      url: 'authorizations/destroy',
      data: params,
      method: 'DELETE'
    });
  }
};
