import axios from '@/axios';

const context = process.env.REACT_APP_CONTEXT
export default {
  findNotePage:function(params){
    return axios({
      method: 'get',
      url: `${context}/note/findNotePage`,
      params
    });
  },
  insertNote:function(data){
    return axios({
      method: 'post',
      url: `${context}/note/insertNote`,
      data: data
    });
  }
 
  
}