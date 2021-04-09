import axios from '@/axios';

const context = process.env.REACT_APP_CONTEXT
export default {
  queryMyPlanLikeByPage:function(data){
    return axios({
      method: 'get',
      url: `${context}/myPlan/queryMyPlanLikeByPage`,
      params:data
    });
  },
  addMyPlan:function(data){
    return axios({
      method: 'post',
      url: `${context}/myPlan/addMyPlan`,
      data
    });
  },
  queryMyPlanById:function(id){
    return axios({
      method: 'get',
      url: `${context}/myPlan/queryMyPlanById/${id}`
    });
  },
  updateMyPlan:function(data){
    return axios({
      method: 'post',
      url: `${context}/myPlan/updateMyPlan`,
      data
    });
  },
  logicDeleteMyPlan:function(id){
    return axios({
      method: 'delete',
      url: `${context}/myPlan/logicDeleteMyPlan/${id}`
    });
  },
  deleteLogicByMyPlanIds:function(idList){
    return axios({
      method: 'delete',
      url: `${context}/myPlan/deleteLogicByMyPlanIds`,
      data:idList
    });
  }



}