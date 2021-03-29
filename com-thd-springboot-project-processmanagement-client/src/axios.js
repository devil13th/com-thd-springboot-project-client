import axios from 'axios'
import { message } from 'antd';

axios.interceptors.response.use(function (response) {

    console.log('--res success--',response)
    // 对响应数据做点什么
    return response;
  }, function (error) {
    console.log('--req error--',error)

    message.error('Error:'+ error);
    // 对响应错误做点什么
    return Promise.reject(error);
  });


export default axios