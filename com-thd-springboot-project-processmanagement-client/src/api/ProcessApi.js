import axios from '@/axios';

const context = process.env.REACT_APP_CONTEXT
export default {
  startProcessByDefId:function(data){
    return axios({
      method: 'post',
      url: `${context}/startProcessByDefId`,
      data: data
    });
  },
  startProcessByDefKey:function(data){
    return axios({
      method: 'post',
      url: `${context}/startProcessByDefKey`,
      data: data
    });
  },
  deleteDeploy:function(deployId){
    return axios({
      method: 'delete',
      url: `${context}/deleteDeploy/${deployId}`
    });
  },
  nextStep:function(taskId,processVariable){
    return axios({
      method: 'post',
      url: `${context}/nextStep`,
      data: {taskId,taskAssignee:'ADMIN',processVariable}
    });
  },
  queryProcessDef:function(params){
    return axios({
      method: 'get',
      url: `${context}/queryProcessDef`,
      params: params
    });
  },
  queryProcessInstancePage:function(params){
    return axios({
      method: 'get',
      url: `${context}/queryProcessInstancePage`,
      params: params
    });
  },
  deleteProcessInstance:function(processInstanceId){
    return axios({
      method: 'get',
      url: `${context}/cancelProcessInstance`,
      params: {processInstanceId}
    });
  },
  queryTaskPage:function(params){
    return axios({
      method: 'get',
      url: `${context}/queryTaskPage`,
      params: params
    });
  },
  queryTaskHisPage:function(params){
    return axios({
      method: 'get',
      url: `${context}/queryTaskHisPage`,
      params: params
    });
  },
  queryProcessVarByExecutionId:function(executionId){
    return axios({
      method: 'get',
      url: `${context}/queryProcessVarByExecutionId`,
      params:{executionId}
    });
  },
  queryProcessVarLocalByExecutionId:function(executionId){
    return axios({
      method: 'get',
      url: `${context}/queryProcessVarLocalByExecutionId`,
      params:{executionId}
    });
  },
  queryProcessVarByTaskId:function(taskId){
    return axios({
      method: 'get',
      url: `${context}/queryProcessVarByTaskId`,
      params:{taskId}
    });
  },
  queryProcessVarLocalByTaskId:function(taskId){
    return axios({
      method: 'get',
      url: `${context}/queryProcessVarLocalByTaskId`,
      params:{taskId}
    });
  },

  setProcessVarGlobalByExecutionId:function(data){
    return axios({
      method: 'post',
      url: `${context}/setProcessVarGlobalByExecutionId`,
      data
    });
  },
  setProcessVarLocalByExecutionId:function(data){
    return axios({
      method: 'post',
      url: `${context}/setProcessVarLocalByExecutionId`,
      data
    });
  },
  setProcessVarGlobalByTaskId:function(data){
    return axios({
      method: 'post',
      url: `${context}/setProcessVarGlobalByTaskId`,
      data
    });
  },
  setProcessVarLocalByTaskId:function(data){
    return axios({
      method: 'post',
      url: `${context}/setProcessVarLocalByTaskId`,
      data
    });
  },
  queryTaskByTaskId:function(taskId){
    return axios({
      method: 'get',
      url: `${context}/queryTaskByTaskId/${taskId}`
    })
  }, 
  queryTaskHisByTaskHisId:function(taskHisId){
    return axios({
      method: 'get',
      url: `${context}/queryTaskHisByTaskHisId/${taskHisId}`
    })
  },
  setAssigneeOfTask:function(taskId,userId){
    return axios({
      method: 'get',
      url: `${context}/setAssigneeOfTask?taskId=${taskId}&userId=${userId}`
    })
  },
  queryProcDefByDefId:function(type,id){
    return axios({
      method: 'get',
      url: `${context}/queryProcDefByDefId/${type}/${id}`
    })
  },
  queryAllProcDefKeyList:function(){
    return axios({
      method: 'get',
      url: `${context}/queryAllProcDefKeyList`
    })
  }
 
  
}