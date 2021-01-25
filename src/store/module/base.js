import {
  getBreadCrumbList,
  setTagNavList,
  cleanTagNavList,
  getTagNavList,
  getHomeRoute,
  closePage,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled
} from '@/utils/util';
import { setStorage } from '@/utils/tools';
import config from '@/config';

export default {
  state: {
    spinShow: false,
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    errorCount: (state) => state.errorList.length,
    apiLoading: (state) => state.spinShow
  },
  mutations: {
    setApiLoading(state, status) {
      state.spinShow = status;
    },
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, config.pageName.home);
    },
    setTagNavList(state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else tagList = getTagNavList() || [];
      if (tagList[0] && tagList[0].name !== config.pageName.home) tagList.shift();
      const homeTagIndex = tagList.findIndex((item) => item.name === config.pageName.home);
      if (homeTagIndex > 0) {
        const homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      setTagNavList([...tagList]);
    },
    cleanTagNavList(state) {
      state.tagNavList = '';
      cleanTagNavList();
    },
    closeTag(state, route) {
      const tag = state.tagNavList.filter((item) => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      closePage(state, route);
    },
    addTag(state, { route, type = 'unshift' }) {
      const router = getRouteTitleHandled(route);
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router);
        else {
          if (router.name === config.pageName.home) state.tagNavList.unshift(router);
          else state.tagNavList.splice(1, 0, router);
        }
        setTagNavList([...state.tagNavList]);
      }
    },
    setTheme(state, color) {
      setStorage('theme', color);
      state.theme = color;
    },
    addError(state, error) {
      state.errorList.push(error);
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status;
    }
  },
  actions: {
    // 接口loading
    actionApiLoading({ commit }, status) {
      commit('setApiLoading', status);
    },
    // 保存错误信息
    actionAddErrorLog({ commit, rootState }, info) {
      if (!window.location.href.includes('logger/error')) {
        commit('setHasReadErrorLoggerStatus', false);
      }
      const {
        auth: { token }
      } = rootState;

      const data = {
        ...info,
        time: Date.parse(new Date().toString()),
        token
      };
      commit('addError', data);
    }
  }
};
