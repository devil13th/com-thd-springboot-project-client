import React from 'react'
import PropTypes from 'prop-types'
import ProcessApi from "@/api/ProcessApi";
import {Row,Col,Divider} from 'antd'
class TaskInfo extends React.Component {
  
  
  state = {
    taskType:"", // task  taskHis
    taskInfo:{}
  }

  static propTypes = {
    taskId: PropTypes.string,
    taskHisId: PropTypes.string,
  };

  componentDidMount(){
    if(this.props.taskId){
        this.setState({
            taskId:this.props.taskId
        },this.queryTaskByTaskId)
    }
    if(this.props.taskHisId){
        this.setState({
            taskHisId:this.props.taskHisId
        },this.queryTaskHisByTaskHisId)
    }
  }

  queryTaskByTaskId = () => {
    ProcessApi.queryTaskByTaskId(this.props.taskId).then( r => {
        this.setState({taskInfo:r.data})
    })
  }

  queryTaskHisByTaskHisId = () => {
    ProcessApi.queryTaskHisByTaskHisId(this.props.taskHisId).then( r => {
        this.setState({taskInfo:r.data})
    })
  }

  render() {
    return (
      <div>
        {/* {JSON.stringify(this.state.taskInfo)} */}
        <Row gutter={24}>
          <Col span="8">Task Id：{this.state.taskInfo.taskId}</Col>
          <Col span="8">
            Task Defined Name：{this.state.taskInfo.taskDefKey}
          </Col>
          <Col span="8">Task Name：{this.state.taskInfo.taskId}</Col>
        </Row>
        <Row gutter={24}>
          <Col span="8">TaskAssignee：{this.state.taskInfo.taskAssignee}</Col>
          <Col span="8">TaskOwner：{this.state.taskInfo.taskOwner}</Col>
          <Col span="8">TaskFormKey：{this.state.taskInfo.taskFormKey}</Col>
        </Row>
        <Row gutter={24}>
          <Col span="8">TaskStartTime：{this.state.taskInfo.taskStartTime}</Col>
          <Col span="8">TaskEndTime：{this.state.taskInfo.taskEndTime}</Col>
          <Col span="8"></Col>
        </Row>

        <Divider/>

        <Row gutter={24}>
        <Col span="8">BusinessKey：{this.state.taskInfo.businessKey}</Col>
          <Col span="8">
            ProcessInstanceId：{this.state.taskInfo.processInstanceId}
          </Col>
          <Col span="8">ExecutionId：{this.state.taskInfo.executionId}</Col>
          
        </Row>
        <Row gutter={24}>
          <Col span="8">DeploymentId：{this.state.taskInfo.deploymentId}</Col>
        </Row>

        <Row gutter={24}>
        <Col span="8">ProcDefId：{this.state.taskInfo.procDefId}</Col>
          
          <Col span="8">DefKey：{this.state.taskInfo.defKey}</Col>
          <Col span="8">DefName：{this.state.taskInfo.defName}</Col>
        </Row>

        <Row gutter={24}>
          <Col span="8">
            ProcessInstanceStartTime：
            {this.state.taskInfo.processInstanceStartTime}
          </Col>
          <Col span="8">
            ProcessInstanceEndTime：{this.state.taskInfo.processInstanceEndTime}
          </Col>
        </Row>

        <Divider/>

        <Row gutter={24}>
          <Col span="24">Task Variable：{JSON.stringify(this.state.taskInfo.taskVar)}</Col>
        </Row>

        <Row gutter={24}>
          <Col span="24">Execution Variable：{JSON.stringify(this.state.taskInfo.executionVar)}</Col>
        </Row>

        <Row gutter={24}>
          <Col span="24">
            Process Variable：{JSON.stringify(this.state.taskInfo.processInstanceVar)}
          </Col>
        </Row>
      </div>
    );
  }
}

export default TaskInfo;