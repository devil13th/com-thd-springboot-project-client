import axios from '@/axios';

const context = process.env.REACT_APP_CONTEXT
export default {
  createDocIndex:function(data){
    return axios({
      method: 'get',
      url: `${context}/knowledge/createDocIndex`
    });
  },
  createDoc:function(vo){
    return axios({
      method: 'post',
      url: `${context}/knowledge/createDoc`,
      data:vo
    });    
  },
  search:function(vo){
    return axios({
      method: 'post',
      url: `${context}/knowledge/search`,
      data:vo
    });
    
  },
  indexThdTecFile:function(){
    return axios({
      method: 'get',
      url: `${context}/knowledge/indexThdTecFile`
    });
  },
  createClassifyIndex:function(){
    return axios({
      method: 'get',
      url: `${context}/knowledge/createClassifyIndex`
    });
  },
  createClassify:function(classify){
    return axios({
      method: 'get',
      url: `${context}/knowledge/createClassify/${classify}`
    });
  },
  initClassifyData:function(){
    return axios({
      method: 'get',
      url: `${context}/knowledge/initClassifyData`
    });
  },
  
  createClassifyData:function(classify){
    return axios({
      method: 'post',
      url: `${context}/knowledge/createClassifyData/${classify}`
    });
  },
  queryAllClassify:function(){
    return axios({
      method: 'get',
      url: `${context}/knowledge/queryAllClassify`
    });
  },
  reIndexThdTecFile:function(){
    return axios({
      method: 'get',
      url: `${context}/knowledge/reIndexThdTecFile`
    });
  },
  deleteIndexThdTecDoc:function(){
    return axios({
      method: 'get',
      url: `${context}/knowledge/deleteIndexThdTecDoc`
    });
  },
  loadDocById:function(id){
    return axios({
      method: 'get',
      url: `${context}/knowledge/loadDocById/${id}`
    });
  },
  deleteDocIndex:function(){
    return axios({
      method: 'delete',
      url: `${context}/knowledge/deleteDocIndex`
    });
  },
  deleteClassifyIndex:function(){
    return axios({
      method: 'delete',
      url: `${context}/knowledge/deleteClassifyIndex`
    });
  },
  

}