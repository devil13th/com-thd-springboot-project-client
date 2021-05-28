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
  }

}