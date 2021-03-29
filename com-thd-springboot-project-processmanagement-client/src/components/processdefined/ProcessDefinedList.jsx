import React from 'react'
import { Popconfirm,Upload, Modal, Tabs, Input, Table, Tooltip, Divider, Button, message } from 'antd'


import PropTypes from 'prop-types'
import ProcessApi from '@/api/ProcessApi'
import { UserSwitchOutlined, CaretRightOutlined, InfoCircleOutlined, SettingOutlined, InboxOutlined,DeleteOutlined } from '@ant-design/icons';
const { Search, TextArea } = Input;
const { TabPane } = Tabs;
const { Dragger } = Upload;

class ProcessDefinedList extends React.Component {
  state = {
    tableData: [],
    tableLoading: false,
    keyWords: '',
    procDefId: '',
    startProcessModalVisible: false,
    businessKey: '',
    processVariable: '',
    queryCondition: {
      businessKey: '',
      assignee: '',
      processInstanceId: ''
    },
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 15, 50, 100],
      showTotal: (total, range) => { return `${total} items` },
      showSizeChanger: true,
      showQuickJumper: true
    },
    // 排序
    sorter: {
      field: 'def.id_',
      order: 'descend',
    },
  }



  componentDidMount() {
    const queryCondition = {}

    this.setState({ queryCondition }, this.queryList)

  }

  onSearch = (v) => {
    this.setState({
      keyWords: v
    }, () => {
      this.queryList(true);
    })
  }

  static getDerivedStateFromProps(props, state) {
    console.log("---xxxx---", props, state)
    if (props.processInstanceId !== state.queryCondition.processInstanceId) {
      return { processInstanceId: props.processInstanceId }
    }
    return null;
  }

  queryList = (clearPage) => {
    console.log("===", this.state.pagination)
    if (clearPage) {
      // 清除分页
      this.setState(
        {
          pagination: {
            showTotal: (total, range) => { return `${total} items` },
            showSizeChanger: true,
            showQuickJumper: true,
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
      keyWords: this.state.keyWords,
      ...this.state.queryCondition
    }
    this.setState({ tableLoading: true })
    ProcessApi.queryProcessDef(queryCondition).then(result => {
      const r = result.data;
      console.log(r)
      this.setState({
        tableData: r.list,
        tableLoading: false,
        pagination: {
          showTotal: (total, range) => { return `${total} items` },
          showSizeChanger: true,
          showQuickJumper: true,
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
      pagination: {
        showTotal: (total, range) => { return `${total} items` },
        showSizeChanger: true,
        showQuickJumper: true,
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

  openStartProcessModal = (record) => {
    this.setState({
      procDefId: record.procDefId,
      startProcessModalVisible: true
    })
  }

  closeProcessModal = () => {
    this.setState({ processDefinitionId: '', startProcessModalVisible: false })
  }

  startProcess = () => {


    let processVar = {}

    try {
      processVar = JSON.parse(this.state.processVariable);

    } catch (e) {
      message.error("Json Parse Error !")
      return
    }

    ProcessApi.startProcessByDefId({
      businessKey: this.state.businessKey,
      processVariable: processVar,
      procDefId: this.state.procDefId
    }).then(r => {
      message.success("Process Be Started Success")
      // this.queryList(false)
      this.closeProcessModal()
    })

  }

  vmodel = (name, v) => {
    this.setState({ [name]: v });
  }

  deleteDeploy = (record) => {
    ProcessApi.deleteDeploy(record.deploymentId).then(r => {
      if(r.data === 'SUCCESS'){
        message.success("Process Defined Be Deleted successfully")
        this.queryList(false)
      }else{
        message.error("Process Defined Deleted Failure")
      }
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
        title: "Def Name",
        dataIndex: "defName",
      },
      {
        title: "Def Key",
        dataIndex: "defKey",
      },
      {
        title: "Def Ver.",
        dataIndex: "defVersion",
      },
      {
        title: "Deployment Id",
        dataIndex: "deploymentId",
      },
      {
        title: "Deployment Time",
        dataIndex: "deployTime",
      },
      {
        title: "Operate",
        key: "operate",
        render: (text, record) => (
          <div>
            <Tooltip title="Detail" placement="left">
              <a>
                <InfoCircleOutlined />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Start Process"  placement="left">
              <a>
                <CaretRightOutlined
                  onClick={() => {
                    this.openStartProcessModal(record);
                  }}
                />
              </a>
            </Tooltip>
            <Divider type="vertical" />          
            <Popconfirm
              placement="left"
              title="Are you sure to delete this process defined?"
              onConfirm={() => {
                this.deleteDeploy(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete Process Defined" placement="left">
                <a>
                <DeleteOutlined />
                </a>
              </Tooltip>
            </Popconfirm>
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



    const props = {
      name: 'file',
      multiple: true,
      action: process.env.REACT_APP_CONTEXT+'/deploy',
      onChange : (info) => {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          this.queryList(false);
          
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };


    return (
      <div>
        <Tabs type="card" tabBarExtraContent={operations}>
          <TabPane tab="Process Defined" key="1"></TabPane>
        </Tabs>

        {/* {JSON.stringify(this.state)} */}

        <Table
          onChange={this.handleTableChange}
          columns={columns}
          dataSource={this.state.tableData}
          pagination={this.state.pagination}
          size="small"
          rowKey={(record) => {
            return record.procDefId;
          }}
        />



        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag bpmn to this area to deploy a new process</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Dragger>


        <Modal
          title="Start Process"
          visible={this.state.startProcessModalVisible}
          onOk={this.startProcess}
          onCancel={this.closeProcessModal}
          width='80%'
        >
          <div style={{ marginTop: '8px' }}>
            <Input placeholder="Business Key" onChange={(e) => { this.vmodel('businessKey', e.target.value) }} />
          </div>
          <div style={{ marginTop: '8px' }}>
            <TextArea rows={4} onChange={(e) => { this.vmodel('processVariable', e.target.value) }} placeholder="Process Variable (JSON) " />

            <div dangerouslySetInnerHTML={{ __html: `Eg.<br/>{<br/>"users":["zhangsan","lisi","wangwu"],<br/>"judge":"”zhaoliu"<br/>}` }}></div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ProcessDefinedList