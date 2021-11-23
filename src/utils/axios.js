import axios from 'axios';

axios.defaults.baseURL = 'https://www.shenyifan.top/apis/php';
axios.defaults.adapter = require('axios/lib/adapters/http');

// 请求拦截  设置统一header
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截  401 token过期处理
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 错误提醒
    return Promise.reject(error);
  }
);

export default axios;
