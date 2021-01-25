/**
 * @description 逐个遍历
 * @param {Array} arr 数组
 * @param {fn} Function 回调方法
 */
export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return;
  let i = -1;
  const len = arr.length;
  while (++i < len) {
    const item = arr[i];
    fn(item, i, arr);
  }
};

/**
 * @description 添加localStorage值
 * @param {String} key localStorage键
 * @param {*} value localStorage值
 */
export const setStorage = (key, value) => {
  if (!key) return;
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  return localStorage.setItem(key, value);
};

/**
 * @description 获取localStorage值
 * @param {String} key localStorage键
 */
export const getStorage = (key) => {
  if (!key) return;
  return localStorage.getItem(key);
};

/**
 * @description 删除localStorage值
 * @param {String} key localStorage键
 */
export const removeStorage = (key) => {
  if (!key) return;
  return localStorage.removeItem(key);
};

/**
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 * @param {Array} arr1
 * @param {Array} arr2
 */
export const getIntersection = (arr1, arr2) => {
  const bSet = new Set(arr2);
  return Array.from(new Set(arr1.filter(v => bSet.has(v))));
};

/**
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 * @param {Array} arr1
 * @param {Array} arr2
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @description 得到两个数组的差集, 两个数组的元素为数值或字符串
 * @param {Array} arr1
 * @param {Array} arr2
 */
export const getDifference = (arr1, arr2) => {
  const aSet = new Set(arr1);
  const bSet = new Set(arr2);
  return Array.from(new Set(arr1.concat(arr2).filter(v => !aSet.has(v) || !bSet.has(v))));
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1);
};

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export const oneOf = (value, validList) => {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
};

/**
 * @description 判断时间戳格式是否是毫秒
 * @param {Number} timeStamp 时间戳
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp);
  return timeStr.length > 10;
};

/**
 * @description 传入的时间戳是否早于当前时间戳
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean}
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime;
};

/**
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num;
};

/**
 * @description 时间戳转换为日期时间
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = '';
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second;
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes;
  return resStr;
};

/**
 * @description 获取相对时间字符串
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp);
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStamp /= 1000);
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp);
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000);
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime);
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp;
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff;
  let resStr = '';
  const dirStr = IS_EARLY ? '前' : '后';
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr;
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr;
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr;
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr;
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp);
  else resStr = getDate(timeStamp, 'year');
  return resStr;
};

/**
 * @description 获取当前浏览器名称
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent;
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1;
  };
  if (isExplorer('MSIE')) return 'IE';
  else if (isExplorer('Firefox')) return 'Firefox';
  else if (isExplorer('Chrome')) return 'Chrome';
  else if (isExplorer('Opera')) return 'Opera';
  else if (isExplorer('Safari')) return 'Safari';
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj;
  else {
    const keysArr = Object.keys(obj);
    return keysArr.length;
  }
};

/**
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
};

/**
* @description 生成一个随机的数字字符串(可指定长度)
* @param len
* @returns {string}
*/
export const getNumArray = (len) => {
  len = len || 12;
  const $chars = '0123456789';
  const maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
};

/**
* @description 生成一个随机的数字+字母字符串(可指定长度)
* @param len
* @returns {string}
*/
export const genRandomString = (len) => {
  let rdmString = '';
  while (rdmString.length < len) {
    rdmString += (Math.random() * 37 | 0).toString(36);
  }
  return rdmString;
};

/**
* @description 生成随机字符串(可指定长度)
* @param len
* @returns {string}
*/
export const randomString = (len) => {
  len = len || 8;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

/**
* @description 产生任意长度随机字母数字组合
* @param randomFlag 是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
* @param min
* @param max
* @returns {string}
* 调用方法:
* 生成 3 - 32 位随即字符串
* randomWord(true,3,32);    例如：olyOXUF5oDsuMmXl3Mi48
* 生成 32 位随机字符串
* randomWord(false,32);     例如：fjpnWj29Bb8boiXbLeDF0nxkR4aYcLRl
*/
export const randomWord = (randomFlag, min, max) => {
  let str = '';
  let range = min;
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
};

/**
 * @description 获取url中"?"符后的字串，从url中解析参数
 * @param {String} url
 */
export const getParams = (url) => {
  const keyValueArr = url.split('?')[1].split('&');
  const paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split('=');
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

/**
* @description 生成随机颜色值
*/
export const getRandomColor = () => {
  const rgb = [];
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16);
    color = color.length === 1 ? '0' + color : color;
    rgb.push(color);
  }
  return '#' + rgb.join('');
};

/**
* @description 验证身份证号
* @param el 号码输入input
* @returns {boolean}
*/
export const checkCardNo = (el) => {
  const txtval = el.value;
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(txtval);
};

/**
* @description 获取字符串字节长度
* @param {String}
* @returns {Boolean}
*/
export const checkLength = (v) => {
  let realLength = 0;
  const len = v.length;
  for (let i = 0; i < len; i++) {
    const charCode = v.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
};

/**
* @description 判断是否微信浏览器
* @returns {Boolean}
*/
export const isWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

/**
* @description 读取cookies
*/
export const getCookie = (name) => {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);
  if (arr) return (arr[2]);
  else return null;
};

/**
* @description 删除cookies
*/
export const delCookie = (name) => {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
};

/**
* @description 浏览器判断
* 用法示例——多套页面判断是否显示移动端：
*   let ua = parseUA();
*   if (!ua.mobile) {
*       location.href = './pc.html';
*   }
*/
export const parseUA = () => {
  const u = navigator.userAgent;
  const u2 = navigator.userAgent.toLowerCase();
  return { // 移动终端浏览器版本信息
    trident: u.indexOf('Trident') > -1,
    // IE内核
    presto: u.indexOf('Presto') > -1,
    // opera内核
    webKit: u.indexOf('AppleWebKit') > -1,
    // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
    // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
    // android终端或uc浏览器
    iPhone: u.indexOf('iPhone') > -1,
    // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1,
    // 是否iPad
    webApp: u.indexOf('Safari') === -1,
    // 是否web应该程序，没有头部与底部
    iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
    weixin: u2.match(/MicroMessenger/i) === 'micromessenger',
    ali: u.indexOf('AliApp') > -1
  };
};

/**
* @description 生成UUID
* @returns {string}
*/
export const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
};

/**
* @description 删除左右两端的空格
* @param str
* @returns {string | * | void}
*/
export const trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, '');
};

/**
* @description 删除左边的空格
* @param str
* @returns {string | * | void}
*/
export const ltrim = (str) => {
  return str.replace(/(^\s*)/g, '');
};

/**
* @description 删除右边的空格
* @param str
* @returns {string | * | void}
*/
export const rtrim = (str) => {
  return str.replace(/(\s*$)/g, '');
};

/**
* @description 对象数组转二维数组
* @param objArr
*/
export const obj2Arr = (objArr) => {
  objArr.length > 0 && objArr.map(item => {
    return Object.values(item);
  });
};

/**
* @description 找出对象数组中某属性的最大值
* @param array
* @param item
* @returns val
*/
export const maxItemInObjArr = (array, item) => {
  const max = Math.max.apply(Math, array.map(function(obj) {
    return obj[item];
  }));
  return max;
};

/**
* @description 判断当前网络环境是否wifi
*/
export const isWifi = () => {
  try {
    let wifi = true;
    const ua = window.navigator.userAgent;
    const con = window.navigator.connection;
    // 如果是微信
    if (/MicroMessenger/.test(ua)) {
      if (ua.indexOf('WIFI') >= 0) {
        return true;
      } else {
        wifi = false;
      }
      // 如果支持navigator.connection
    } else if (con) {
      const network = con.type;
      if (network !== 'wifi' && network !== '2' && network !== 'unknown') {
        wifi = false;
      }
    }
    return wifi;
  } catch (e) {
    return false;
  }
};

/**
 *@description 首字母大写
 * @param {String} str
 * @returns {string}
 */
export const fistLetterUpper = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @description 过滤非法字符串
 * @param {String} str 字符串
 */
export const illegalFilter = (str) => {
  const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

  if (regEn.test(str) || regCn.test(str)) return false;
  return true;
};

/**
 * @description 删除对象值的所有空格
 * @param {Object} obj 对象
 */
export const objValueRemoveSpaces = (obj) => {
  for (const i in obj) {
    if (obj[i]) {
      obj[i] = String(obj[i]).replace(/(^\s*)|(\s*$)/g, '');
    }
  }
  return obj;
};

/**
 * @description 过滤参数对象为空或者undefined或者null
 * @param {Object} obj 对象
 */
export const objParamsFilter = (obj) => {
  for (const i in obj) {
    if (obj[i] === '' || obj[i] === undefined || obj[i] === null) {
      delete obj[i];
    }
  }
  return obj;
};

/**
 * @description 滚动到固定位置
 */
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    var windowSetTimeout = (callback) => {
      return window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      windowSetTimeout()
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
 * @description 判断是否测试服
 */
export const isDev = () => {
  if (location.port) return true;
  if (
    location.host.indexOf('test-') > -1 ||
    location.host.indexOf('-test') > -1 ||
    location.host.indexOf('dev-') > -1 ||
    location.host.indexOf('-dev') > -1) {
    return true;
  }
  return false;
};

/**
 * @description 格式化时间
 */
export const formatTime = (time) => {
  let newTime = new Date(time);
  newTime = newTime.getFullYear() + '-' + (newTime.getMonth() + 1) + '-' + newTime.getDate() + ' ' + newTime.getHours() + ':' + newTime.getMinutes();
  return newTime;
};

/**
 * @description 校验电话号码
 */
export const checkPhone = (phone) => {
  let result = false;
  if (/^1[3456789]\d{9}$/.test(phone)) {
    result = true;
  }
  return result;
};

/**
 * @description 校验固定电话
 */
export const checkTelephone = (telephone) => {
  let result = false;
  if (/^0\d{2,3}-?\d{7,8}$/.test(telephone)) {
    result = true;
  }
  return result;
};

/**
 * @description 对象转换为xml
 */
export const objToXml = (params) => {
  const paramsArray = [];
  Object.keys(params).forEach(key => params[key] && paramsArray.push(`<${key}>${params[key]}</${key}>`));
  const paramsStr = '<xml>' + paramsArray.join('') + '</xml>';
  return paramsStr;
};

/**
 * @description 获取URL链接中的的参数串
 */
export const parseUrlParams = (uri, params) => {
  const paramsArray = [];
  Object.keys(params).sort().forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`));
  if (uri.search(/\?/) === -1) {
    uri += `?${paramsArray.join('&')}`;
  } else {
    uri += `&${paramsArray.join('&')}`;
  }
  return uri;
};

/**
 * @description 对象拼接成字符串
 */
export const parseObjToString = (params) => {
  const paramsArray = [];
  Object.keys(params).sort().forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`));
  return paramsArray.join('&');
};

/**
 * @description 返回参数字符串
 */
export const paramsString = (params) => {
  const paramsArray = [];
  Object.keys(params).forEach(key => params[key] && paramsArray.push(`${params[key]}`));
  const str = paramsArray.join('');
  return str;
};

/**
 * @description 过滤无效的签名参数
 */
export const filterSignParam = (obj) => {
  const params = Object.assign({}, obj);
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const item = params[key];
      if (item === '' || item === undefined || item === null) {
        delete params[key];
      }
    }
  }
  const paramsArray = [];
  Object.keys(params).sort().forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`));
  const str = paramsArray.join('&');
  return str;
};

/**
 * @description 正则表达
 */
export const reg = {
  bankcard: /^([1-9]{1})(\d{15}|\d{18})$/, // 银行卡正则
  cellphone: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, // 手机号
  email: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ // 邮箱
};

/**
 * @description 数据类型判断
 */
function typeOf(obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
}

/**
 * @description 深度拷贝
 */
export function deepCopy(data) {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if (t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if (t === 'object') {
    for (const i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
}

/**
 * @description 设置localStorage缓存
 */
export function setLocalStorageCache(data) {
  if (!data.key || !data.val) {
    throw new Error('数据格式不对，data={key: "", val: "", ttl:  1000}');
  }
  const currentTime = new Date().getTime();
  const expiredTime = data.ttl ? data.ttl * 1000 + currentTime : 0;
  const obj = { val: data.val, expired: expiredTime };
  localStorage.setItem(data.key, JSON.stringify(obj));
}

/**
 * @description 获取localStorage缓存
 */
export function getLocalStorageCache(key) {
  if (!key) {
    throw new Error('数据格式不对，请传key值');
  }

  const tem = localStorage.getItem(key);
  if (!tem) return null;

  try {
    const obj = JSON.parse(tem);
    if (obj.expired === 0) {
      return obj.val;
    }
    if (obj.expired >= new Date().getTime()) {
      return obj.val;
    }

    localStorage.removeItem(key);
    return null;
  } catch (e) {
    localStorage.removeItem(key);
    throw new Error(`--getLsCache-- error: ${e}`);
  }
}

/**
 * @param url
 * @param data {参数对象}
 * @description 拼接url
 */
export function paramToUrl(url, data) {
  if (!data) return '';
  let params = '';
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const el = data[key];
      if (el instanceof Array) {
        let arrStr = '';
        el.forEach(item => {
          arrStr += key + '[]=' + item + '&';
        });
        params += arrStr;
      } else {
        params += key + '=' + el + '&';
      }
    }
  }
  params = params.substr(0, params.length - 1);
  return url.indexOf('?') > -1 ? url + '&' + params : url + '?' + params;
}

/**
 * @description 删除数组中的某一个返回新数组
 * @param index
 * @param arr {需要删除的原数组}
 */
export function arrFilter(arr, index) {
  const filterItem = arr.filter((item, i) => i !== index);
  return filterItem;
}

/**
 * @description 删除数组中的某一个返回新数组
 * @param index
 * @param arr {需要删除的原数组}
 */
export function arrDelOne(str, arr) {
  const index = arr.indexOf(str);
  arr.splice(index, 1);
  return arr;
}

/**
 * @description 深度过滤无效对象参数，包括 null 空 undefined 空对象，空数组
 * @param obj {参数对象}
 */
export function deepFilterParam(obj) {
  const copyParams = Object.assign({}, obj);
  const removeEmpty = params => {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const item = params[key];
        if (item === '' || item === undefined || item === null || item.length === 0 || JSON.stringify(item) === '{}') {
          delete params[key];
        } else if (item instanceof Object || item instanceof Array) {
          removeEmpty(item);
          if (JSON.stringify(item) === '{}' || item.length === 0) {
            delete params[key];
          }
        }
      }
    }
  };
  removeEmpty(copyParams);
  return copyParams;
}

/**
 * @description 判断是否数字
 * @param num {Number|String}
 */
export function isFinite(num) {
  return Number.isFinite(parseInt(num));
}

/**
 * @description 转化成正数
 * @param str {String}
 */
export function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}
