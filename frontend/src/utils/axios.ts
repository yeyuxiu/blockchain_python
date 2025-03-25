import axios from 'axios';
import {message} from 'antd';


// 请求超时[config]:showTimeout    1.[true]:显示提示 2.["again"]:显示再次提示弹出框
axios.defaults.timeout = 36000000;
// axios.defaults.withCredentials = true;
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
// axios.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
// axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'; //Ajax get请求标识
// axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'; //Ajax post请求标识
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; //POST请求参数获取不到的问题
// axios.defaults.headers.post['Accept'] = 'application/json'; //POST请求参数获取不到的问题
// axios.defaults.headers.put['X-Requested-With'] = 'XMLHttpRequest'; //Ajax put请求标识
// axios.defaults.headers.delete['X-Requested-With'] = 'XMLHttpRequest'; //Ajax delete请求标识



// 响应拦截器
axios.interceptors.response.use(
    function(response) {
      // 用户未授权，页面跳转到登录页面
 
      // 处理错误信息
      if (
        // 元数据自定义返回代码 code 大于10000
        response.data.code >= 10000 &&
        response.data.message
      ) {
        message.destroy();
        message.warning(response.data.message);
      } else if (
        response.data.code !== 701 &&
        response.data.code !== 200 &&
        response.data.code !== 1006 &&
        response.data.message
      ) {
        message.destroy();
        message.error(response.data.message);
      }
  
      return response;
    },
    function(error) {
  
      // 超时
      if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !error.response) {
        error.response = {
          status: 504,
          statusText: 'timeout',
          data: {
            data: false,
            meta: {
              message: '请求超时!',
              statusCode: 504,
              success: false,
            },
          },
        };
      }
      
      // 处理错误信息 报错 自动弹窗
      if (
        error.response?.status != 200 &&
        error.response?.status != 401 &&
        error.response.data?.meta?.statusCode != 302
      ) {
        // 兼容登录接口
        if (error.response.data?.meta?.message) {
          message.destroy();
        }
        
        // 普通接口 + 2024/9/5 新版登录接口格式 强判断
        if (error.response.data?.message) {
          if (
            error.response.data?.path === '/login' ||
            error.response.data?.error ||
            error.response.data?.exception
          ) {
            // 2024/9/5 兼容新版登录接口
            message.destroy();
            return error?.response ? error.response : error;
          }
          message.destroy();
          message.error(error.response.data.message);
        }
      }
      return error?.response ? error.response : error;
    }
  );
  
//   // 请求拦截器
//   axios.interceptors.request.use(function(config) {
//     let user = getUserCache();
//     if (user != null) {
//       config.headers.post['loginUserOrgId'] = user.orgId;
//       config.headers.post['loginUserId'] = user.userId;
//       config.headers.post['dcloginuserId'] = user.userId;
//       config.headers.get['loginUserId'] = user.userId;
//       config.headers.get['dcloginuserId'] = user.userId;
//       config.headers.get['loginUserOrgId'] = user.orgId;
  
//       config.headers.get['lastAccessTime'] = getLoginTimeCache();
//       config.headers.post['lastAccessTime'] = getLoginTimeCache();
  
//       const Authorization = user.tokenId;
//       if (Authorization != null && Authorization != '') {
//         config.headers.delete['Authorization'] = Authorization;
//         config.headers.get['Authorization'] = Authorization;
//         config.headers.post['Authorization'] = Authorization;
//         config.headers.put['Authorization'] = Authorization;
//       }
//     }
  
//     // 添加请求参数
//     config.params = {
//       ...(config.params || {}),
//       _t: Date.parse(new Date()) / 1000,
//     };
//     return config;
//   });
  

export function axiosGet(url: string, params: object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    // 向给定ID的用户发起请求
    axios
      .get(url, { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
    //   .finally(function () {
    //     // 总是会执行
    //   });
  });
}

export function axiosPost(url: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
}
