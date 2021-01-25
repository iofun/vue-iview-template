import Cookies from 'js-cookie';

/**
 * @description 设置Cookies
 */
export const setCookies = (key, value, opt = {}) => {
  const other = Object.assign({}, opt);
  Cookies.set(key, value, other);
};

/**
 * @description 获取Cookies
 */
export const getCookies = (key) => {
  const _key = Cookies.get(key);
  if (_key) return _key;
  else return false;
};

/**
 * @description 删除Cookies
 */
export function removeCookies(key) {
  return Cookies.remove(key);
}
