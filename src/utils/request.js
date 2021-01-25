import axios from 'axios';
import store from '@/store';
import config from '@/config';

// 接口地址
const baseUrl = config.apiUrl.base;

// 添加错误日志
const handleAddErrorLog = (errorInfo) => {
  const {
    statusText,
    status,
    request: { responseURL }
  } = errorInfo;
  const info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  };
  if (!responseURL.includes('logger/error')) store.dispatch('actionAddErrorLog', info);
};

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }

  getInsideConfig() {
    // 请求头
    const _TOKEN = store.state.auth.token;
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: 'Bearer ' + _TOKEN
      }
    };
    return config;
  }

  destroy(url) {
    delete this.queue[url];
    // 取消全局loading
    if (!Object.keys(this.queue).length) {
      store.dispatch('actionApiLoading', false);
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        // 添加全局的loading
        if (!Object.keys(this.queue).length && !config.notload) {
          store.dispatch('actionApiLoading', true);
        }
        this.queue[url] = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (response) => {
        this.destroy(url);
        const { data, status } = response;
        return { data, status };
      },
      (error) => {
        this.destroy(url);
        // console.log(error.request);
        // console.log(error.response);
        // console.log(error.message);
        // console.log(error.config);

        // 网络超时
        let errorInfo = error.response;
        if (!errorInfo) {
          errorInfo = {
            requestUrl: error.request.responseURL,
            statusText: error.request.statusText,
            status: error.request.status,
            message: error.message
          };
        }

        // 写入错误日志
        if (config.isOpenAetect) handleAddErrorLog(errorInfo);

        // 特定状态码返回结果
        if (error.response && error.response.data) {
          return Promise.resolve(error.response);
        }

        // 返回错误信息
        return Promise.reject(error);
      }
    );
  }

  create(options) {
    // 创建一个axios实例
    const instance = axios.create();
    // 参数合并
    options = Object.assign(this.getInsideConfig(), options);
    // 触发请求拦截器
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default new HttpRequest(baseUrl);
