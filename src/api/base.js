// import qs from 'qs';
import { handleApi } from '@/utils/handleApi';

// 请求方法'GET'，'PUT', 'POST', 'PATCH', 'DELETE', 参数为 data:{xxxx}
// baseURL: 'https://xxx.com/api/', 特定请求api声明
// notload 接口是否不用loading（有轮询时设置为true）

export default {
  // 保存错误信息
  saveErrorLogger(params) {
    return handleApi({
      url: 'logger/error',
      data: params,
      method: 'POST'
    });
  },
  // 图片裁剪
  uploadImg(params) {
    return handleApi({
      url: 'image/upload',
      data: params,
      method: 'POST'
    });
  }
};
