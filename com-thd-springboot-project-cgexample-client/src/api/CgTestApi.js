import axios from '@/axios';

const context = process.env.REACT_APP_CONTEXT
export default {
  queryCgTestLikeByPage:function(data){
    return axios({
      method: 'get',
      url: `${context}/cgTest/queryCgTestLikeByPage`,
      params:data
    });
  },
  addCgTest:function(data){
    return axios({
      method: 'post',
      url: `${context}/cgTest/addCgTest`,
      data
    });
  },
  queryCgTestById:function(id){
    return axios({
      method: 'get',
      url: `${context}/cgTest/queryCgTestById/${id}`
    });
  },
  updateCgTest:function(data){
    return axios({
      method: 'post',
      url: `${context}/cgTest/updateCgTest`,
      data
    });
  },
  logicDeleteCgTest:function(id){
    return axios({
      method: 'delete',
      url: `${context}/cgTest/logicDeleteCgTest/${id}`
    });
  },
  deleteLogicByCgTestIds:function(idList){
    return axios({
      method: 'delete',
      url: `${context}/cgTest/deleteLogicByCgTestIds`,
      data:idList
    });
  }



}