import { getMenuByRouter } from '@/utils/util';
import { removeStorage } from '@/utils/tools';
import { getCookies, removeCookies } from '@/utils/cookies';
import baseRouter from '@/router/baseRouter';
import config from '@/config';

export default {
  state: {
    account: {
      // 登录用户信息
      userName: '',
      realName: '',
      nickName: '',
      avatar: ''
    },
    appId: '', // 跳转过来的应用ID
    hasGetInfo: false, // 是否已请求登录用户信息
    token: getCookies(`${config.tokenPrefix}TOKEN`),
    access: [], // 权限数组
    routeList: [], // 拿到的动态路由
    hasGetRouter: false, // 是否已经拿过路由
    menuId: '', // 左侧菜单栏id
    unreadCount: 0
  },
  mutations: {
    setUserInfo(state, info) {
      state.account.userName = info.username;
      state.account.nickName = info.username;
      state.account.realName = info.realname;
    },
    removeUserInfo(state) {
      state.account = {
        userName: '',
        realName: '',
        nickName: '',
        avatar: ''
      };
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status;
    },
    setAccess(state, access) {
      state.access = access;
    },
    setToken(state, token) {
      state.token = token;
    },
    removeToken(state) {
      state.token = '';
    },
    setRouteList(state, dynamicRouter) {
      state.routeList = dynamicRouter;
    },
    setHasGetRouter(state, status) {
      state.hasGetRouter = status;
    },
    setMessageCount(state, count) {
      state.unreadCount = count;
    },
    moveMsg(state, { from, to, msg_id }) {
      const index = state[from].findIndex((_) => _.msg_id === msg_id);
      const msgItem = state[from].splice(index, 1)[0];
      msgItem.loading = false;
      state[to].unshift(msgItem);
    }
  },
  getters: {
    appMenuList: (state) => {
      return getMenuByRouter(baseRouter.concat(state.routeList), state.access);
    }
  },
  actions: {
    // 更新动态路由
    actionDynamicRouter({ commit }, router) {
      commit('setRouteList', router);
    },
    // 登录
    actionLogin({ commit }, token) {
      commit('setToken', token);
    },
    // 获取用户相关信息
    actionUserInfo({ commit }, params) {
      commit('setUserInfo', params);
      commit('setHasGetInfo', true);
      // commit('setAccess', params);
    },
    // 退出登录
    actionLogout({ commit }) {
      commit('removeToken');
      commit('removeUserInfo');
      commit('setHasGetInfo', false);
      removeStorage('productInfo');
      removeStorage('tagNaveList');
      removeStorage('hasHome');
      removeCookies(`${config.tokenPrefix}TOKEN`);
      removeCookies(`${config.tokenPrefix}USER`);
      removeCookies(`${config.tokenPrefix}PASSWORD`);
    }
  }
};
