
import md5 from 'js-md5';
import config from '@/config';
import router from '@/router';
import { forEach, hasOneOf, objEqual } from '@/utils/tools';

/**
 * @description 判断菜单是否有子菜单
 * @param {Object} item 菜单对象值
 */
export const hasChild = (item) => {
  return item.children && item.children.length !== 0;
};

/**
 * @description MD5加密
 * @param {String} pwd 密码
 * @param {String} salt 加密盐
 */
export const calcuMD5 = (pwd, salt) => {
  if (salt) {
    pwd = pwd + salt;
  }
  const hash = md5(pwd).toUpperCase();
  return hash;
};

/**
 * @description  通过路由列表得到菜单列表
 * @param {Array} list 路由列表
 * @param {Array} access 路由的权限数组
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  const res = [];
  const showThisMenuEle = (item, access) => {
    if (item.meta && item.meta.access && item.meta.access.length) {
      if (hasOneOf(item.meta.access, access)) return true;
      else return false;
    } else return true;
  };
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      const obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta,
        data: item.data || ''
      };
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access);
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href;
      if (showThisMenuEle(item, access)) res.push(obj);
    }
  });
  return res;
};

/**
 * @description  获取当前菜单面包屑列表
 * @param {Array} routeMetched 当前路由metched
 * @param {String} homeRoute 主路由
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  const homeItem = { ...homeRoute, icon: homeRoute.meta.icon ? homeRoute.meta.icon : '' };
  const routeMetched = route.matched;
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem];
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread;
  }).map(item => {
    const meta = { ...item.meta };
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      meta.title = meta.title(route);
    }
    const obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    };
    return obj;
  });
  res = res.filter(item => {
    return !item.meta.hideInMenu;
  });
  // return [{ ...homeItem, to: homeRoute.path }, ...res];
  return [...res];
};

/**
 * @description 获取路由的标题
 * @param {Object} route  路由对象值
 */
export const getRouteTitleHandled = (route) => {
  const router = { ...route };
  const meta = { ...route.meta };
  let title = '';
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else title = meta.title;
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

/**
 * @description 设置当前路由在浏览器的title
 * @param {Object} item  路由对象值
 */
export const showTitle = (item) => {
  let { title } = item.meta;
  if (!title) return;
  title = (item.meta && item.meta.title) || item.name;
  return title;
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavList = (list) => {
  localStorage.tagNaveList = JSON.stringify(list);
};

/**
 * @description 删除本地存储和获取标签导航列表
 */
export const cleanTagNavList = () => {
  localStorage.removeItem('tagNaveList');
};

/**
 * @description 获取本地存储和获取标签导航列表
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavList = () => {
  const list = localStorage.tagNaveList;
  return list ? JSON.parse(list) : [];
};

/**
 * @description 用于找到路由列表中name为home的对象
 * @param {Array} routeList 路由列表数组
 */
export const getHomeRoute = (routeList, homeName = 'home') => {
  let i = -1;
  const len = routeList.length;
  let homeRoute = {};
  while (++i < len) {
    const item = routeList[i];
    if (item.name === homeName) {
      homeRoute = item;
      break;
    } else {
      if (item.children && item.children.length) {
        const res = getHomeRoute(item.children, homeName);
        if (res.name) return res;
      }
    }
  }
  return homeRoute;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute;
  const newList = [...list];
  if (newList.findIndex(item => item.name === name) >= 0) return newList;
  else newList.push({ name, path, meta });
  return newList;
};

/**
 * @description 判断是否有路由访问权限
 * @param {Array} access 用户权限数组，如 ['1', 'admin']
 * @param {Object} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access);
  else return true;
};

/**
 * 权鉴
 * @description 用户是否可跳转到该页
 * @param {String} name 即将跳转的路由name
 * @param {Array} access 用户权限数组
 * @param {Array} routes 路由列表
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children);
      } else if (item.name === name) {
        return hasAccess(access, item);
      }
    });
  };

  return routePermissionJudge(routes);
};

/**
 * @description 获取即将跳转的路由
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = getHomeRoute(list);
  } else {
    const index = list.findIndex(item => routeEqual(item, route));
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  const nameSplit = file.name.split('.');
  const format = nameSplit[nameSplit.length - 1];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file); // 以文本格式读取
    let arr = [];
    reader.onload = function(evt) {
      const data = evt.target.result; // 读到的数据
      const pasteData = data.trim();
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t');
      }).map(item => {
        return item[0].split(',');
      });
      if (format === 'csv') resolve(arr);
      else reject(new Error('[Format Error]:你上传的不是Csv文件'));
    };
  });
};

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在ViewUI的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = [];
  let tableData = [];
  if (array.length > 1) {
    const titles = array.shift();
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      };
    });
    tableData = array.map(item => {
      const res = {};
      item.forEach((col, i) => {
        res[titles[i]] = col;
      });
      return res;
    });
  }
  return {
    columns,
    tableData
  };
};

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode;
    } else {
      return findNodeUpper(ele.parentNode, tag);
    }
  }
};

export const findNodeUpperByClasses = (ele, classes) => {
  const parentNode = ele.parentNode;
  if (parentNode) {
    const classList = parentNode.classList;
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase();
  if (ele.childNodes.length) {
    let i = -1;
    const len = ele.childNodes.length;
    while (++i < len) {
      const child = ele.childNodes[i];
      if (child.tagName === tagName) return child;
      else return findNodeDownward(child, tag);
    }
  }
};

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access);
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2);
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length;
  let res = false;
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  };
  scroll(from, to, step);
};

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem);
  const pageTitle = showTitle(handledRoute, vm);
  const resTitle = pageTitle ? `${config.title} - ${pageTitle}` : config.title;
  window.document.title = resTitle;
};

/**
 * @description 关闭标签
 * @param {Object} state 路由对象
 * @param {Object} vm Vue实例
 */
export const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter((item) => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

