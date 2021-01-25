import request from '@/utils/request';
import { Message, LoadingBar } from 'view-design';
import store from '@/store';

export const handleApi = (requestParams) => {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    // 统一处理请求参数
    const newRequestParams = requestParams;
    if (requestParams.method.toUpperCase() === 'GET') {
      const getParams = requestParams.data;
      newRequestParams.params = getParams || {};
      delete requestParams['data'];
    }
    // console.log(newRequestParams);

    // 创建请求
    request
      .create(newRequestParams)
      .then((response) => {
        // console.log(response);
        const result = response.data;

        // 账号强制退出处理
        if (result.code === 3) {
          store.dispatch('actionLogout');
          LoadingBar.finish();
          Message.error('账号不可使用！');
          setTimeout(() => {
            window.location.href = window.location.protocol + '//' + window.location.host;
          }, 600);
          // reject(new Error('Request Error'));
          resolve({ code: 0, data: '', message: 'Request Error' });
        } else {
          resolve(result);
        }
      })
      .catch((error) => {
        // console.log(error);
        // 错误提示
        Message.error(error.message);
        LoadingBar.finish();
        // reject(new Error(error.message || 'Request Error'));
        resolve({ code: 0, data: '', message: error.message || 'Request Error' });
      });
  });
};
