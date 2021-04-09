import axios from '@/axios';

const context = process.env.REACT_APP_CONTEXT
export default {
  queryCgExampleLikeByPage:function(data){
    return axios({
      method: 'post',
      url: `${context}/cgExample/queryCgExampleLikeByPage`,
      data
    });
  },
  addCgExample:function(data){
    return axios({
      method: 'post',
      url: `${context}/cgExample/addCgExample`,
      data
    });
  },
  queryCgExampleById:function(id){
    return axios({
      method: 'get',
      url: `${context}/cgExample/queryCgExampleById/${id}`
    });
  },
  updateCgExample:function(data){
    return axios({
      method: 'post',
      url: `${context}/cgExample/updateCgExample`,
      data
    });
  },
  logicDeleteCgExample:function(id){
    return axios({
      method: 'delete',
      url: `${context}/cgExample/logicDeleteCgExample/${id}`
    });
  },
  deleteLogicByCgExampleIds:function(idList){
    return axios({
      method: 'delete',
      url: `${context}/cgExample/deleteLogicByCgExampleIds`,
      data:idList
    });
  }

 
  
}