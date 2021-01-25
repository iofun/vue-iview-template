// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ViewUI from 'view-design';
import config from '@/config';
import installPlugin from '@/plugin';

// 使用插件
Vue.use(ViewUI, {
  size: 'default'
});
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

/**
 * 注册事件总线
 */
Vue.prototype.$bus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
