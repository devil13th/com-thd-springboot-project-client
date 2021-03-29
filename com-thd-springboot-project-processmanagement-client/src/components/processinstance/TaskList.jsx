import React from 'react'
import {message,Modal,Tabs ,Input ,Table,Tooltip ,Divider ,Button} from 'antd'
import PropTypes from 'prop-types'
import ProcessApi from '@/api/ProcessApi'
import ProcessVariable from '../processvariable/ProcessVariable'
import TaskInfo from './TaskInfo'
import {OrderedListOutlined,UserSwitchOutlined,CaretRightOutlined,InfoCircleOutlined,SettingOutlined} from '@ant-design/icons';
const { TextArea,Search } = Input;
const { TabPane } = Tabs;
class TaskList extends React.Component {
  state = {
    tableData:[],
    tableLoading:false,
    keyWords:'',
    processInstanceId:'',
    taskId:'',
    taskHisId:'',
    tid:'',
    processVarType:'',
    nextStepModalVisible:false,
    processVarModalVisible:false,
    taskDetailModalVisible:false,
    reassignModalVisible:false,
    processVariable:{},
    queryCondition:{
      businessKey:'',
      assignee:'',
      processInstanceId:''
    },
    pagination:{
      current:1,
      pageSize:10,
      pageSizeOptions:[5,10,15,50,100],
      showTotal:(total, range)=>{ return `${total} items`},
      showSizeChanger:true,
      showQuickJumper:true
    },
    // 排序
    sorter: {
      field: 'task.create_time_ ',
      order: 'descend',
    },
  }

  //对标签属性进行类型、必要性的限制
  static propTypes = {
    businessKey:PropTypes.string,
    assignee:PropTypes.string,
    processInstanceId:PropTypes.string
  }

  //指定默认标签属性值
  static defaultProps = {
    businessKey:'',
    assignee:'',
    processInstanceId:''
  }

  componentDidMount(){
    const queryCondition = {}
    if(this.props.businessKey){
      queryCondition.businessKey = this.props.businessKey
    }
    if(this.props.assignee){
      queryCondition.assignee = this.props.assignee
    }
    if(this.props.processInstanceId){
      queryCondition.processInstanceId = this.props.processInstanceId
    }
    this.setState({queryCondition},this.queryList)

  }

  onSearch = (v) => {
    this.setState({
      keyWords:v
    },() => {
      this.queryList(true);
    })
  }

  // static getDerivedStateFromProps(props,state){
  //   console.log("---xxxx---",props,state)
  //   if(props.processInstanceId !== state.queryCondition.processInstanceId){
  //     return {processInstanceId:props.processInstanceId}      
  //   }
  //   return null;
  // }

  queryList = (clearPage) => {
    console.log("===",this.state.pagination)
    if (clearPage) {
      // 清除分页
      this.setState(
        {
          pagination: {
            showTotal:(total, range)=>{ return `${total} items`},
            showSizeChanger:true,
            showQuickJumper:true,
            ...this.state.pagination,
            current: 1,
          },
        },
        this.basicQuery
      )
    } else {
      this.basicQuery()
    }
  }

  // 基础查询
  basicQuery = () => {
    const _this = this
    const queryCondition = {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      sortField: this.state.sorter.field,
      sortOrder: this.state.sorter.order.replace('end', ''),
      keyWords:this.state.keyWords,
      ...this.state.queryCondition
    }
    this.setState({ tableLoading: true })
    ProcessApi.queryTaskPage(queryCondition).then( result => {
      const r = result.data;
      this.setState({
        tableData:r.list,
        tableLoading: false,
        pagination: {
          showTotal:(total, range)=>{ return `${total} items`},
          showSizeChanger:true,
          showQuickJumper:true,
          current: r.pageNum,
          pageSize: r.pageSize,
          total: r.total,
        }
      })
    })

    
  }

  // 分页/排序 事件处理
  handleTableChange = (pagination, filters, sorter) => {
    
    const st = {
      pagination:{
        showTotal:(total, range)=>{ return `${total} items`},
        showSizeChanger:true,
        showQuickJumper:true,
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: this.state.pagination.total,
      },
    }
    if (sorter.field && sorter.order) {
      st.sorter = {
        field: sorter.field,
        order: sorter.order,
      }
    } else {
      st.sorter = {
        field: '',
        order: '',
      }
    }
    this.setState(st, this.queryList)
    
  }



  openNextStepModal = (record) => {
    this.setState({
      taskId:record.taskId,
      nextStepModalVisible:true
    })
  }

  closeNextStepModal = () => {
    this.setState({taskId:'',nextStepModalVisible:false})
  }


  openTaskDetailModal = (record) => {
    this.setState({
      taskId:record.taskId,
      taskDetailModalVisible:true
    })
  }
  closeTaskDetailModal = () => {
    this.setState({
      taskId:"",
      taskDetailModalVisible:false
    })
  }

  nextStep = () => {
    

    let processVar = {}
    
    try{
      processVar = JSON.parse(this.state.processVariable);
      
    }catch(e){
      message.error("Json Parse Error !")
      return
    }

    ProcessApi.nextStep(this.state.taskId,processVar).then(r=>{
      message.success("Task Be Completed Success")
      this.queryList(false)
      this.closeNextStepModal()
    })
    
  }

  vmodel = (name,v) => {
    this.setState({[name]:v});
  }
  openTaskVar = (taskId) =>{
    this.setState({processVarModalVisible:true,tid:taskId,processVarType:"task"})
  }
  openExecutionVar = (executionId) =>{
    this.setState({processVarModalVisible:true,tid:executionId,processVarType:"execution"})
  }
  closeProcessVarModal = () =>{
    this.setState({processVarModalVisible:false,tid:'',processVarType:""})
  }
  openReassignModal = (record) => {
    this.setState({
      taskId:record.taskId,
      reassignModalVisible:true,
      userId:record.taskAssignee
    })
  }
  closeReassignModal = (record) => {
    this.setState({
      taskId:'',
      reassignModalVisible:false
    })
  }
  reAssigneeOfTask = () => {
    ProcessApi.setAssigneeOfTask(this.state.taskId,this.state.userId).then( r=> {
      console.log(r)
      this.queryList(false)
      this.closeReassignModal()
    })
  }



  
  render() {
    console.log("render...")
    const columns = [
      {
        title: "Def ID",
        dataIndex: "procDefId",
      },
      {
        title: "Key",
        dataIndex: "businessKey",
      },
      {
        title: "PI Id",
        dataIndex: "processInstanceId",
      },
      {
        title: "Exec Id",
        dataIndex: "executionId",
      },
      {
        title: "Task Id",
        dataIndex: "taskId",
      },
      {
        title: "Task Name",
        dataIndex: "taskName",
      },
      {
        title: "Assignee",
        dataIndex: "taskAssignee",
      },
      {
        title: "Start",
        dataIndex: "taskStartTime",
      },
      {
        title: "Form",
        dataIndex: "taskFormKey",
      },
      {
        title: "Operate",
        key: "operate",
        render: (text, record) => (
          <div>
            <Tooltip title="Detail">
              <a>
                <InfoCircleOutlined onClick={() => {this.openTaskDetailModal(record)}}/>
              </a>
            </Tooltip>
            <Divider type="vertical"></Divider>
            <Tooltip title="Replace Assignee">
              <a>
                <UserSwitchOutlined onClick={ () => {this.openReassignModal(record)}}/>
              </a>
            </Tooltip>
            <Divider type="vertical"></Divider>
            <Tooltip title="Set Task Variable">
              <a>
              <SettingOutlined onClick={() => {this.openTaskVar(record.taskId)}}/>
              </a>
            </Tooltip>
            <Divider type="vertical"></Divider>
            <Tooltip title="Set Execution Variable">
              <a>
              <SettingOutlined onClick={() => {this.openExecutionVar(record.executionId)}}/>
              </a>
            </Tooltip>
            <Divider type="vertical"></Divider>
            <Tooltip title="Next Step">
              <a>
                <CaretRightOutlined onClick={()=>{this.openNextStepModal(record)}} />
              </a>
            </Tooltip>
          </div>
        ),
      },
    ];
    
    const operations = {
      right: <Search
      placeholder="key words"
      onSearch={this.onSearch}
      style={{ width: 200 }}
      size="small"
      enterButton
    />
    }
    return (
      <div>
        <Tabs type="card" tabBarExtraContent={operations}>
          <TabPane tab="Current Task" key="1"></TabPane>
        </Tabs>

        {/* {JSON.stringify(this.state)} */}

        <Table
          onChange={this.handleTableChange}
          columns={columns}
          dataSource={this.state.tableData}
          pagination={this.state.pagination}
          size="small"
          rowKey={(record) => {
            return (
              record.processInstanceId +
              "_" +
              record.taskId +
              "_" +
              record.taskAssignee
            );
          }}
        />

        <Modal
          title="Next Step"
          style={{top:32}}
          visible={this.state.nextStepModalVisible}
          onOk={this.nextStep}
          onCancel={this.closeNextStepModal}
          width="80%"
        >
        
          <div style={{ marginTop: "8px" }}>
            <TextArea
              rows={4}
              onChange={(e) => {
                this.vmodel("processVariable", e.target.value);
              }}
              placeholder="Process Variable (JSON) "
            />

            <div
              dangerouslySetInnerHTML={{
                __html: `Eg.<br/>{<br/>"users":["zhangsan","lisi","wangwu"],<br/>"judge":"”zhaoliu"<br/>}`,
              }}
            ></div>
          </div>
        </Modal>

        <Modal
          width={"100%"}
          style={{top:32}}
          title={<OrderedListOutlined/>}
          visible={this.state.processVarModalVisible}
          onOk={this.closeProcessVarModal}
          onCancel={this.closeProcessVarModal}
          destroyOnClose={true}
          maskClosable={false}
        >
          <ProcessVariable processVarType={this.state.processVarType} id={this.state.tid}></ProcessVariable>
        </Modal>


        <Modal
          width={"100%"}
          style={{top:32}}
          title={<OrderedListOutlined/>}
          visible={this.state.taskDetailModalVisible}
          onOk={this.closeTaskDetailModal}
          onCancel={this.closeTaskDetailModal}
          destroyOnClose={true}
          maskClosable={false}
        >
          <TaskInfo taskId={this.state.taskId} ></TaskInfo>
        </Modal>

        <Modal
          width={"100%"}
          style={{top:32}}
          title={<OrderedListOutlined/>}
          visible={this.state.reassignModalVisible}
          onOk={this.reAssigneeOfTask}
          onCancel={this.closeReassignModal}
          destroyOnClose={true}
          maskClosable={false}
        >
          <Input value={this.state.userId} onChange={(e) => { this.vmodel('userId', e.target.value) }}/>
        </Modal>
        

      </div>
    );
  }
}

export default TaskList