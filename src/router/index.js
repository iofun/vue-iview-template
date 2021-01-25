import Vue from 'vue';
import store from '@/store';
import VueRouter from 'vue-router';
import baseRouter from './baseRouter';
import appRouter from './appRouter';
import { toRouterComponent } from './dynamic';
import { LoadingBar, Message } from 'view-design';
import { setTitle, canTurnTo } from '@/utils/util';
import { setStorage, getStorage } from '@/utils/tools';
import config from '@/config';
import apiAuth from '@/api/auth';

Vue.use(VueRouter);
// 创建路由方法
const createRouter = (routeList) => {
  return new VueRouter({
    mode: config.routerModel,
    routes: routeList
  });
};

// 实例化初始路由
const vueRouter = createRouter(!config.activeDynamicRouter ? baseRouter : baseRouter.concat(appRouter));
if (config.activeDynamicRouter) {
  store.dispatch('actionDynamicRouter', baseRouter.concat(appRouter));
}

// 不做权限校验目录
const permitRouter = config.permitRouter;

// 所有路由
let allRouter = !config.activeDynamicRouter ? baseRouter : baseRouter.concat(appRouter);

// 解决重复点击报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// 根据权限重置路由
const resetRouter = (accessRouter) => {
  allRouter = Array.from(new Set([...accessRouter, ...baseRouter, ...appRouter]));
  const newRouter = createRouter(baseRouter);
  vueRouter.matcher = newRouter.matcher;
  vueRouter.addRoutes(accessRouter.concat(appRouter, [{
    path: '*',
    name: '_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error/404.vue')
  }]));
  store.dispatch('actionDynamicRouter', accessRouter.concat(appRouter));
};

// 设置首页跳转
const toHomePage = (dynamic, next) => {
  if (getStorage('hasHome')) { return; }

  const dynamicHome = dynamic[0];
  setStorage('hasHome', true);
  if (dynamicHome.children) {
    next({ replace: true, name: dynamicHome.children[0].name });
  } else {
    next({ replace: true, name: dynamicHome.name });
  }
};

// 路由跳转
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, allRouter)) {
    // 有权限
    next();
  } else {
    // 无权限
    next({ replace: true, name: config.pageName.error });
  }
};

// 退出登录，重置信息
const logout = (msg) => {
  store.dispatch('actionLogout');
  LoadingBar.finish();
  Message.error(msg);
  const locaPath = window.location.pathname.split('/')[1];
  if (permitRouter.indexOf(locaPath) === -1) {
    vueRouter.push({
      name: config.pageName.login
    });
  }
};

vueRouter.beforeEach((to, from, next) => {
  LoadingBar.start();
  // console.log(from);
  // console.log(to.name);

  // 不做权限校验
  if (!config.pageAccess) return next();

  // 需要权限校验
  const _TOKEN = store.state.auth.token;

  // 最大请求登录次数
  let requestTimes = 0;

  // 未登录
  if (_TOKEN === 'null' || !_TOKEN) {
    if (permitRouter.indexOf(to.name) > -1) { // 访问页面为单独页面
      next();
    } else {
      requestTimes++;
      next({
        name: config.pageName.login
      });
      if (requestTimes >= 1) {
        return LoadingBar.finish();
      }
    }
  } else {
    if (permitRouter.indexOf(to.name) > -1) {
      return next({
        name: config.pageName.home
      });
    }
    if (store.state.auth.hasGetInfo) {
      // console.log('已经加载过用户数据');
      turnTo(to, store.state.auth.access, next);
    } else {
      // console.log('开始加载用户数据');

      // 不需要动态路由，直接进入权限校验
      if (!config.activeDynamicRouter) {
        return turnTo(to, store.state.auth.access, next);
      }

      // 获取用户信息
      apiAuth.getUserInfo().then(res => {
        if (res.code === 1) {
          store.dispatch('actionUserInfo', res.data);

          // 路由直接跳转
          next();

          // 获取权限路由
          apiAuth.getRouterList().then(rouRes => {
            if (rouRes.code === 1) {
              const { data } = rouRes;
              if (!(data instanceof Array)) {
                return next({
                  name: config.pageName.home
                });
              }

              // 得到动态路由
              const dynamicRouter = toRouterComponent(data);

              // 重载路由
              resetRouter(dynamicRouter);

              // 设置首页跳转
              toHomePage(dynamicRouter, next);
            } else {
              return logout(res.msg);
            }
          });
        } else {
          return logout(res.msg);
        }
      });
    }
  }
});

vueRouter.afterEach((to) => {
  setTitle(to, vueRouter.app);
  LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default vueRouter;

