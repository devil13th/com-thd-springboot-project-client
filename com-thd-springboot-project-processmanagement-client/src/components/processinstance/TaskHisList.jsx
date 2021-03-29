import React from 'react'
import {Tabs ,Input ,Table,Tooltip ,Divider ,Button,Modal} from 'antd'
import PropTypes from 'prop-types'
import ProcessApi from '@/api/ProcessApi'
import {UserSwitchOutlined,CaretRightOutlined,InfoCircleOutlined,SettingOutlined,OrderedListOutlined} from '@ant-design/icons';
import TaskInfo from './TaskInfo'
const { Search } = Input;
const { TabPane } = Tabs;
class TaskHisList extends React.Component {
  state = {
    tableData:[],
    tableLoading:false,
    keyWords:'',
    processInstanceId:'',
    taskDetailModalVisible:false,
    taskHisId:'',
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
      field: 'taskhis.start_time_ ',
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

  static getDerivedStateFromProps(props,state){
    console.log("---xxxx---",props,state)
    if(props.processInstanceId !== state.queryCondition.processInstanceId){
      return {processInstanceId:props.processInstanceId}      
    }
    return null;
  }

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
    ProcessApi.queryTaskHisPage(queryCondition).then( result => {
      const r = result.data;
      console.log(r)
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


  openTaskDetailModal = (record) => {
    this.setState({
      taskHisId:record.taskHisId,
      taskDetailModalVisible:true
    })
  }
  closeTaskDetailModal = () => {
    this.setState({
      taskHisId:"",
      taskDetailModalVisible:false
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
        title: "Task His Id",
        dataIndex: "taskHisId",
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
        dataIndex: "taskHisStartTime",
      },
      {
        title: "End",
        dataIndex: "taskHisEndTime",
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
              <a >
                <InfoCircleOutlined onClick={ () => this.openTaskDetailModal(record)}/>
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
          <TabPane tab="Task His" key="1"></TabPane>
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
              record.taskHisId +
              "_" +
              record.taskAssignee
            );
          }}
        />


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
          <TaskInfo taskHisId={this.state.taskHisId} ></TaskInfo>
        </Modal>
      </div>
    );
  }
}

export default TaskHisList