/**
 * 定义全局提示
 */
import Vue from 'vue';
const $warning = options => {
  Vue.prototype.$Notice.warning(options);
};
const $success = options => {
  Vue.prototype.$Notice.success(options);
};
const $error = options => {
  Vue.prototype.$Notice.error(options);
};
export {
  $warning,
  $success,
  $error
};

