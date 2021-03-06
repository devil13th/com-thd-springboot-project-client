import axios from '@/axios';

const context = process.env.REACT_APP_CONTEXT
export default {
  uploadUrl:`${context}/note/singleUpload`,
  queryNoteNoPage:function(data){
    return axios({
      method: 'get',
      url: `${context}/note/queryNoteNoPage`,
      params:data
    });
  },
  queryNoteLikeByPage:function(data){
    return axios({
      method: 'get',
      url: `${context}/note/queryNoteLikeByPage`,
      params:data
    });
  },
  addNote:function(data){
    return axios({
      method: 'post',
      url: `${context}/note/addNote`,
      data
    });
  },
  queryNoteById:function(id){
    return axios({
      method: 'get',
      url: `${context}/note/queryNoteById/${id}`
    });
  },
  updateNote:function(data){
    return axios({
      method: 'post',
      url: `${context}/note/updateNote`,
      data
    });
  },
  logicDeleteNote:function(id){
    return axios({
      method: 'delete',
      url: `${context}/note/logicDeleteNote/${id}`
    });
  },
  deleteLogicByNoteIds:function(idList){
    return axios({
      method: 'delete',
      url: `${context}/note/deleteLogicByNoteIds`,
      data:idList
    });
  },
  search:function(keyWords,classify){
    return axios({
      method: 'get',
      url: `${context}/note/search?keyWords=${keyWords}`
    });
  },
  deleteNodeIndex:function(){
    return axios({
      method: 'get',
      url: `${context}/note/deleteNodeIndex`
    });
  },
  createNoteIndex:function(){
    return axios({
      method: 'get',
      url: `${context}/note/createNoteIndex`
    });
  },
  toggleNoteState:function(id){
    return axios({
      method: 'get',
      url: `${context}/note/toggleNoteState/${id}`
    });
    
  },
  finishTodo:function(id,finishTime){
    return axios({
      method: 'post',
      url: `${context}/note/finishTodo`,
      data:{
        noteId:id,
        finishTime
      }
    });
  }
  



  



}