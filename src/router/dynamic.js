import AppLayout from '@/views/layout';
import parentView from '@/components/ParentView';
import config from '@/config';
import { forEach } from '@/utils/tools';

/**
 * @description 创建符合路由格式的路由对象
 * @param {Object} obj 单个路由数据
 * @returns {Object}
 */
export const createRouterItem = (obj, cpn) => {
  if (obj.is_show === 1) {
    const route = {
      path: obj.route.trim(),
      name: obj.route.trim() ? `${obj.route.trim().split('/')[1]}_${obj.id}` : `autoName_${obj.id}`,
      meta: {
        icon: obj.icon.trim() ? obj.icon.trim() : 'md-cube',
        title: obj.name.trim() ? obj.name.trim() : `自动名称${obj.order}`,
        hideInMenu: obj.route.trim().indexOf('/system') > -1 ? (!config.isSideShowSetting) : false,
        showAlways: !!obj.son
      },
      component: cpn
    };
    return route;
  }
  return;
};

/**
 * @description 通过后端api获取左侧菜单路由，并做相应路由菜单处理（最多支持三级菜单）
 * @param {Array} list 后端接口返回的路由数据
 * @returns {Array}
 */
export const toRouterComponent = (list) => {
  // 固定动态文件夹
  const dynamicDir = config.dynamicDir;

  // 拼接成的路由
  const dynamicRouterArr = [];

  forEach(list, (first) => {
    // console.log(first);
    const firstRoute = createRouterItem(first, AppLayout);
    // console.log(firstRoute);

    // 如果有二级路由
    if (first.son && first.son.length > 0) {
      const secondArr = [];
      forEach(first.son, (second) => {
        const cpn = () => import(`@/views/${dynamicDir}${second.route}.vue`);
        // console.log(`${dynamicDir}${second.route}`);
        const secondRoute = createRouterItem(second, second.son ? parentView : cpn);
        // console.log(secondRoute);
        secondArr.push(secondRoute);

        // 如果有三级路由
        if (second.son && second.son.length !== 0) {
          const thirdArr = [];
          forEach(second.son, (third) => {
            const cpn = () => import(`@/views/${dynamicDir}${third.route}.vue`);
            const thirdRoute = createRouterItem(third, cpn);
            thirdArr.push(thirdRoute);
          });

          secondRoute.children = thirdArr;
        }
      });

      firstRoute.children = secondArr;
    }

    dynamicRouterArr.push(firstRoute);
  });
  // console.log(dynamicRouterArr);
  return dynamicRouterArr;
};
