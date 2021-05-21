import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, fatrash } from "@fortawesome/fontawesome-free-solid";

import {
  Menu,
  Modal,
  Table,
  Button,
  Input,
  Alert,
  InputNumber,
  Dropdown,
  Tag,
  Select,
  Switch,
  Space,
  Checkbox,
  Tooltip,
  TimePicker,
  message,
  Divider,
  Pagination,
  Popconfirm,
  Row,
  Col,
  Popover,
  Empty,
  Rate,
  Card,
  DatePicker,
} from "antd";
import NoteApi from "@/api/NoteApi";
import DateUtils from "@/tools/DateUtils";
import NoteForm from "./NoteForm";
import NoteView from "./NoteView";
import moment from "moment";
import _ from 'lodash'
import {
  SearchOutlined,
  ClockCircleOutlined,
  UpOutlined,
  ExclamationOutlined,
  EyeOutlined,
  CloseCircleFilled,
  CalendarOutlined,
  UserOutlined,
  TableOutlined,
  InfoOutlined,
  WarningOutlined,
  CloseOutlined,
  CheckOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import NoteCalendar from "./NoteCalendar";

const { Search } = Input;
const { Option } = Select;
const levelTags = [
  { key: 5, value: "紧急", color: "#f50" },
  { key: 4, value: "重要", color: "#108ee9" },
  { key: 3, value: "正常", color: "#87d068" },
  { key: 2, value: "不紧急", color: "#2db7f5" },
  { key: 1, value: "不重要", color: "#2db7f5" },
];

class NoteList extends React.Component {
  state = {
    noteId:'',
    finishDateTemp: moment(),
    finishTimeTemp: moment(),
    finishTimeModalVisible: false,
    advanceSearchVisible: false,
    colSpan: 24,
    viewType: "DETAIL", // LIST DETAIL CALENDAR
    // 查询条件
    queryCondition: {
      noteId: "",
      todoStatus:false,
    },
    // loading状态
    tabLoading: false,
    // 分页数据
    tabPagination: {
      current: 1, // 当前页
      pageSize: 10, // 每页条目数
      size: "small", // 尺寸
      total: 0, // 总条目数
      pageSizeOptions: [5, 10, 15, 50, 100], // 条目数选项
      // 文本
      showTotal: (total, range) => {
        return `${total} items`;
      },
      showSizeChanger: true, // 是否展示修改条目数的下拉菜单
      showQuickJumper: true, // 是否有直接跳转页数文本框
    },
    // 表格排序字段和顺序
    tabSort: {
      field: "createTime",
      order: "desc",
    },
    // 表格数据
    tabData: [],
    selectedRowKeys: [],
    // modal noteId
    noteId: "",
    // note编辑modal visible
    formModalVisible: false,

    // note view modal visible
    viewModalVisible: false,
  };

  componentDidMount() {
    this.queryTabData();
  }

  // 表格选择框改变
  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  // 清除已选择的选择框
  clearSelectedKeys = () => {
    this.setState({ selectedRowKeys: [] });
  };

  // detail视图中的checkbox checked属性初始化
  checkedInit = (id) => {
    return (
      this.state.selectedRowKeys.find((item) => {
        return item === id;
      }) !== undefined
    );
  };
  // detail视图中的checkbox checked事件
  checkboxChange = (e) => {
    if (e.target.checked) {
      const f = this.state.selectedRowKeys.find((item) => {
        return item === e.target.value;
      });
      if (f === undefined) {
        this.setState({
          selectedRowKeys: [...this.state.selectedRowKeys, e.target.value],
        });
      }
    } else {
      const filterResult = this.state.selectedRowKeys.filter((item) => {
        return item !== e.target.value;
      });
      // console.log(filterResult);
      this.setState({
        selectedRowKeys: filterResult,
      });
    }
  };

  // 表格改变事件
  tabChange = (pagination, filters, sorter) => {
    // console.log("pagination", pagination);
    // console.log("filter", filters);
    // console.log("sorter", sorter);

    const tabPagination = {
      ...this.state.tabPagination,
      current: pagination.current, // 当前页
      pageSize: pagination.pageSize, // 每页条目数
    };

    let tabSort = {};
    if (sorter && sorter.order) {
      tabSort = {
        field: sorter.field,
        order: sorter.order.replace("end", ""),
      };
    } else {
      tabSort = this.state.tabSort;
    }

    // 设置分页排序 并查询
    this.setState(
      {
        tabPagination,
        tabSort,
      },
      this.queryTabData
    );
  };

  // 分页组件改变事件
  tabPaginationChange = (page, pageSize) => {
    const tabPagination = {
      ...this.state.tabPagination,
      current: page, // 当前页
      pageSize: pageSize, // 每页条目数
    };

    this.setState(
      {
        tabPagination,
      },
      this.queryTabData
    );
  };
  // 查询列表数据 clearPage:是否清除分页信息
  queryTabData = (clearPage) => {
    this.setState({
      tabLoading: true,
    });
    let currentPage = this.state.tabPagination.current;
    if (clearPage) {
      // 清除当前页信息
      currentPage = 1;
      this.setState({
        tabPagination: {
          ...this.state.tabPagination,
          current: 1,
        },
      });
    } else {
      currentPage = this.state.tabPagination.current;
    }

    let queryCondition = _.cloneDeep(this.state.queryCondition);
    
    queryCondition.todoStatus = queryCondition.todoStatus ? 1 : 0
    queryCondition.pageNum = currentPage;
    queryCondition.pageSize = this.state.tabPagination.pageSize;
    //queryCondition.sortField = this.state.tabSort.field;
    //queryCondition.sortOrder = this.state.tabSort.order;
    NoteApi.queryNoteLikeByPage(queryCondition)
      .then((r) => {
        this.setState({
          tabLoading: false,
          tabData: r.result.list,
          tabPagination: {
            ...this.state.tabPagination,
            total: r.result.total,
          },
        });
      })
      .catch((r) => {
        message.error("error! " + r);
        this.setState({
          tabLoading: false,
        });
      });
  };

  // 操作按钮的下拉菜单
  createOperate = (record) => {
    const menu = (
      <Menu>
        <Menu.Item key="1" icon={<DeleteOutlined />}>
          <Popconfirm
            placement="topLeft"
            title="Are you confirm delete this record"
            onConfirm={() => {
              this.logicDeleteNote(record.noteId);
            }}
            okText="Yes"
            cancelText="No"
          >
            Delete
          </Popconfirm>
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            // message.info(JSON.stringify(record));
            this.openNoteViewModal(record.noteId);
          }}
          icon={<InfoOutlined />}
        >
          Data View
        </Menu.Item>

        {record.classify === "Todo" ? (
          record.todoStatus === 0 ? (
            <Menu.Item
              key="3"
              onClick={() => {
                // message.info(JSON.stringify(record));
                this.openFinishTimeModal(record.noteId,record.finishTime);
              }}
              icon={<CheckOutlined />}
            >
              Finish
            </Menu.Item>
          ) : (
            <Menu.Item
              key="4"
              onClick={() => {
                // message.info(JSON.stringify(record));
                this.toggleNoteState(record.noteId);
              }}
              icon={<CloseOutlined />}
            >
              Unfinish
            </Menu.Item>
          )
        ) : null}
      </Menu>
    );
    return (
      <div>
        <a
          className="ant-dropdown-link"
          onClick={() => {
            this.openNoteFormModal(record.noteId);
          }}
        >
          Edit
        </a>

        <Dropdown overlay={menu}>
          <Button type="link">
            <MoreOutlined />
          </Button>
        </Dropdown>
      </div>
    );
  };

  // keywords 搜索
  onSearch = (keyWords) => {
    this.setState(
      {
        queryCondition: {
          ...this.state.queryCondition,
          keyWords,
        },
      },
      () => {
        this.queryTabData(true);
      }
    );
  };

  // 重置搜索条件
  resetSearch = () => {
    this.setState(
      {
        queryCondition: {},
      },
      () => {
        this.queryTabData(true);
      }
    );
  };

  keyWordsChange = (e) => {
    this.setState({
      queryCondition: {
        ...this.state.queryCondition,
        keyWords: e.target.value,
      },
    });
  };

  clearKeyWords = () => {
    this.setState(
      {
        queryCondition: {
          // ...this.state.queryCondition,
          keyWords: "",
        },
      },
      () => {
        this.queryTabData(true);
      }
    );
  };

  // 删除Note
  logicDeleteNote = (noteId) => {
    NoteApi.logicDeleteNote(noteId)
      .then((r) => {
        message.info("SUCCESS");
        this.queryTabData();
      })
      .catch((r) => {
        message.info("FAILURE");
      });
  };

  // 批量删除Note
  deleteLogicByNoteIds = () => {
    if (this.state.selectedRowKeys.length > 0) {
      NoteApi.deleteLogicByNoteIds(this.state.selectedRowKeys)
        .then((r) => {
          message.info("SUCCESS");

          this.setState({
            selectedRowKeys: [],
          });
          this.queryTabData();
        })
        .catch((r) => {
          message.error("FAILURE");
        });
    } else {
      message.error("Please Select A Item At Least");
    }
  };

  // 关闭 编辑 modal
  closeNoteFormModal = () => {
    this.setState({
      formModalVisible: false,
      noteId: "",
    });
  };
  // 关闭 视图 modal
  closeNoteViewModal = () => {
    this.setState({
      viewModalVisible: false,
      noteId: "",
    });
  };
  // 打开 编辑 modal
  openNoteFormModal = (noteId) => {
    if (noteId) {
      this.setState({
        noteId: noteId,
        formModalVisible: true,
      });
    } else {
      this.setState({
        formModalVisible: true,
      });
    }
  };
  // 打开 视图 modal
  openNoteViewModal = (noteId) => {
    this.setState({
      noteId: noteId,
      viewModalVisible: true,
    });
  };

  // 切换视图类型
  toggleViewType = (type) => {
    this.setState({
      viewType: type,
    });
  };

  // 高级搜索显示/隐藏 回调
  handleAdvanceSearchVisibleChange = (b) => {
    this.setState({
      advanceSearchVisible: b,
    });
  };

  // 双向绑定
  createMode = (v, propName) => {
    this.setState({
      queryCondition: {
        ...this.state.queryCondition,
        [propName]: v,
      },
    });
  };

  search = () => {
    NoteApi.search(this.state.queryCondition.keyWords, null).then((r) => {
      this.setState({
        tabData: r.result,
      });
    });
  };

  deleteIndex = () => {
    NoteApi.deleteNodeIndex().then((r) => {
      if (r.result) {
        message.success("success! ");
      } else {
        message.error(r.msg);
      }
    });
  };

  createIndex = () => {
    NoteApi.createNoteIndex().then((r) => {
      if (r.result) {
        message.success("success! ");
      } else {
        message.error(r.msg);
      }
    });
  };

  computColor = (item) => {
    if (item.classify === "Todo") {
      if (item.todoStatus === 0) {
        if (item.todoLevel === 5) {
          return "block red_block";
        } else if (item.todoLevel === 4) {
          return "block yellow_block";
        } else if (item.todoLevel === 3) {
          return "block green_block";
        }
      } else {
        return "block gray_block";
      }
    }
    return "block";
  };

  toggleNoteState = (id) => {
    NoteApi.toggleNoteState(id).then(
      (r) => {
        console.log(r);
        if (r.code !== "-1") {
          message.success("SUCCESS");
          this.queryTabData();
        } else {
          message.error(r.msg);
        }
      },
      (r) => {
        message.error(r.msg);
      }
    );
  };

  setFinishTimeCurrent = () => {
    const mmt = moment();
    this.setState({
      finishDateTemp: mmt,
      finishTimeTemp: mmt,
    });
  };


  finishTodo = () => {
    const finishTimeStr = this.state.finishDateTemp.format('YYYY-MM-DD') + " " +this.state.finishTimeTemp.format('HH:mm')
    // alert(finishTimeStr)
    NoteApi.finishTodo(this.state.noteId,finishTimeStr).then( r=>{
      console.log(r);
      message.success("SUCCESS");
      this.closeFinishTimeModal();
      this.queryTabData();
    });
  }

  closeFinishTimeModal = () =>{
    this.setState({
      finishTimeModalVisible : false,
      noteId:''
    })
  }
  openFinishTimeModal = (id,finishTime) => {
    if(finishTime){
      this.setState({
        finishDateTemp:moment(finishTime,'YYYY-MM-DD HH:mm'),
        finishTimeTemp:moment(finishTime,'YYYY-MM-DD HH:mm'),
      })
    }

    this.setState({
      noteId:id,
      finishTimeModalVisible : true
    })
  }

  // =============================== render  =============================== //
  render() {
    const levelTagsObj = {};
    levelTags.forEach((item) => {
      levelTagsObj[item.key] = item;
    });

    // 表格字段
    const tabDataColumns = [
      {
        title: "classify",
        dataIndex: "classify",
        key: "classify",
        sorter: true,
      },
      {
        title: "title",
        width: 500,
        dataIndex: "title",
        key: "title",
        sorter: true,
      },
      // {
      //   title: "content",
      //   dataIndex: "content",
      //   key: "content",
      //   sorter: true,
      // },
      {
        title: "expireDate",
        dataIndex: "expireDate",
        key: "expireDate",
        sorter: true,
        render: (text, record, index) => {
          return DateUtils.formatToDate(text);
        },
      },
      {
        title: "alarmDays",
        dataIndex: "alarmDays",
        key: "alarmDays",
        sorter: true,
      },
      {
        title: "Operate",
        key: "operate",
        render: (text, record, index) => {
          return this.createOperate(record);
        },
      },
    ];

    // 复选框
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      // 为避免远程分页会之前选择的数据
      preserveSelectedRowKeys: true,
      onChange: this.onSelectChange,
      selections: [
        {
          key: "clearAll",
          text: "Clear All",
          onSelect: (changableRowKeys) => {
            this.setState({ selectedRowKeys: [] });
          },
        },
      ],
    };

    // ======================= 数据展示内容 =======================

    const tableView = (
      <div
        style={{
          background: "#ecf0f5",
          borderRadius: 3,
          padding: 8,
        }}
      >
        <div className="block">
          <Table
            rowSelection={rowSelection}
            loading={this.state.tabLoading}
            rowKey={(record) => record.noteId}
            size={"small"}
            columns={tabDataColumns}
            dataSource={this.state.tabData}
            pagination={this.state.tabPagination}
            onChange={this.tabChange}
          />
        </div>
      </div>
    );

    const calendarView = <NoteCalendar></NoteCalendar>;

    const listView = (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            background: "#ecf0f5",
            borderRadius: 3,
            padding: 8,
          }}
        >
          {this.state.tabData.length > 0 ? (
            this.state.tabData.map((item) => {
              return (
                <div
                  style={{ flex: "0 0 20%", padding: "0px 8px 8px 0px" }}
                  key={item.noteId}
                >
                  <div className={this.computColor(item)}>
                    <div className="title">{item.title}</div>

                    <div style={{ height: 126 }}>
                      <dl className="profile">
                        <dt>classify</dt>
                        <dd>{item.classify}</dd>
                      </dl>

                      {/* <dl className="profile">
                      <dt>content</dt>
                      <dd>{item.content}</dd>
                    </dl> */}

                      <dl className="profile">
                        <dt>Level</dt>
                        <dd>
                          <Rate
                            disabled
                            defaultValue={item.todoLevel}
                            style={{ fontSize: 14 }}
                          />
                        </dd>
                      </dl>

                      {item.classify === "Todo" ? (
                        <div>
                          <dl className="profile">
                            <dt>Status</dt>
                            <dd>
                              {item.todoStatus === 1 ? (
                                <CheckOutlined />
                              ) : (
                                <ExclamationOutlined
                                  style={{ fontSize: 14, color: "red" }}
                                />
                              )}{" "}
                            </dd>
                          </dl>

                          <dl className="profile">
                            <dt>expireDate</dt>
                            <dd>{DateUtils.formatToDate(item.expireDate)}</dd>
                          </dl>

                          <dl className="profile">
                            <dt>alarmDays</dt>
                            <dd>{item.alarmDays}</dd>
                          </dl>
                        </div>
                      ) : null}
                    </div>
                    <div className="divider"></div>
                    <div style={{ display: "flex" }}>
                      <div style={{ flex: "1 1 auto", paddingTop: 4 }}>
                        <Checkbox
                          checked={this.checkedInit(item.noteId)}
                          value={item.noteId}
                          onChange={this.checkboxChange}
                        />
                      </div>
                      <div style={{ flex: "0 0 75px" }}>
                        {this.createOperate(item)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                padding: 8,
                textAlign: "center",
                background: "#fff",
                width: "100%",
              }}
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <Pagination
            style={{ marginTop: 8 }}
            {...this.state.tabPagination}
            onChange={this.tabPaginationChange}
          />
        </div>
      </div>
    );

    // ============== 高级搜索面板 =============== //
    const advanceSearch = (
      <div style={{ width: 200 }}>
        <Row gutter={24}>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>ID</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.queryCondition.noteId}
                  onChange={(e) => {
                    this.createMode(e.target.value, "noteId");
                  }}
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>classify</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.queryCondition.classify}
                  onChange={(e) => {
                    this.createMode(e.target.value, "classify");
                  }}
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>title</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.queryCondition.title}
                  onChange={(e) => {
                    this.createMode(e.target.value, "title");
                  }}
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>content</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.queryCondition.content}
                  onChange={(e) => {
                    this.createMode(e.target.value, "content");
                  }}
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>expireDate</dt>
              <dd>
                <DatePicker
                  size={this.state.inputSize}
                  onChange={(moment, dataStr) => {
                    this.createMode(dataStr, "expireDate");
                  }}
                  value={
                    this.state.queryCondition.expireDate
                      ? moment(
                          this.state.queryCondition.expireDate,
                          "YYYY-MM-DD"
                        )
                      : null
                  }
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>alarmDays</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.queryCondition.alarmDays}
                  onChange={(e) => {
                    this.createMode(e.target.value, "alarmDays");
                  }}
                />
              </dd>
            </dl>
          </Col>
        </Row>
        <Divider style={{ margin: "8px 0px" }}></Divider>
        <div style={{ textAlign: "center" }}>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => {
              this.queryTabData(true);
            }}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          <Button onClick={this.resetSearch}>Reset</Button>
        </div>
      </div>
    );

    const dataView = {
      LIST: listView,
      DETAIL: tableView,
      CALENDAR: calendarView,
    };

    // ============== 组件返回内容 =============== //
    return (
      <div>
        {/* {JSON.stringify(this.state.selectedRowKeys)} */}

        <Row gutter={24}>
          <Col span={12}>
            {this.state.viewType === "LIST" ? (
              <TableOutlined style={{ fontSize: 16, color: "#1890ff" }} />
            ) : (
              <TableOutlined
                style={{ fontSize: 14, cursor: "pointer" }}
                onClick={() => {
                  this.toggleViewType("LIST");
                }}
              />
            )}

            <Divider type="vertical" />
            {this.state.viewType === "DETAIL" ? (
              <UnorderedListOutlined
                style={{ fontSize: 16, color: "#1890ff" }}
              />
            ) : (
              <UnorderedListOutlined
                style={{ fontSize: 14, cursor: "pointer" }}
                onClick={() => {
                  this.toggleViewType("DETAIL");
                }}
              />
            )}

            <Divider type="vertical" />
            {this.state.viewType === "CALENDAR" ? (
              <CalendarOutlined style={{ fontSize: 16, color: "#1890ff" }} />
            ) : (
              <CalendarOutlined
                style={{ fontSize: 14, cursor: "pointer" }}
                onClick={() => {
                  this.toggleViewType("CALENDAR");
                }}
              />
            )}
          </Col>
          <Col span={12}>
            {/* ======================= 搜索 ======================= */}
            <div className="tabTool">
            
              <Switch
                style={{marginRight:8}}
                checked = {this.state.queryCondition.todoStatus}
                onChange={ (v) => {this.createMode(v, "todoStatus"); this.queryTabData();}}
                checkedChildren="已完成"
                unCheckedChildren="未完成"
              />

              <Search
                placeholder="Key Word"
                style={{ width: 200, marginRight: 8 }}
                onSearch={this.onSearch}
                onChange={this.keyWordsChange}
                suffix={
                  <CloseCircleFilled
                    onClick={this.clearKeyWords}
                    style={{ cursor: "pointer", fontSize: 12, color: "#aaa" }}
                  />
                }
                value={this.state.queryCondition.keyWords}
                enterButton
              />

              {/* <Dropdown.Button
                onClick={this.search}
                overlay={
                  <Menu>
                    <Menu.Item
                      key="1"
                      onClick={this.createIndex}
                      icon={<UserOutlined />}
                    >
                      Create Note Index
                    </Menu.Item>
                    <Menu.Item
                      key="2"
                      onClick={this.deleteIndex}
                      icon={<UserOutlined />}
                    >
                      Delete Note Index
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />}>
                      Reindex Note
                    </Menu.Item>
                  </Menu>
                }
              >
                Full Search
              </Dropdown.Button> */}

              <Popover
                content={advanceSearch}
                trigger="click"
                title="Advance Search"
                visible={this.state.advanceSearchVisible}
                onVisibleChange={this.handleAdvanceSearchVisibleChange}
              >
                <Button
                  type="link"
                  icon={
                    this.state.advanceSearchVisible ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )
                  }
                >
                  Advance
                </Button>
              </Popover>

              <Tooltip title="Create">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    this.openNoteFormModal();
                  }}
                ></Button>
              </Tooltip>
            </div>
          </Col>
        </Row>

        {/* ======================= 复选框操作按钮 ======================= */}

        {this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0 ? (
          <Alert
            type="info"
            message={
              <div style={{ display: "flex" }}>
                <div style={{ flex: "1 1 auto" }}>
                  Selected {this.state.selectedRowKeys.length} items{" "}
                  <Tooltip title="Clear Selected">
                    <FontAwesomeIcon
                      icon="times"
                      style={{
                        fontSize: 14,
                        paddingTop: 2,
                        marginRight: 8,
                        color: "#999999",
                        cursor: "pointer",
                      }}
                      onClick={this.clearSelectedKeys}
                    />
                  </Tooltip>
                </div>
                <div style={{ flex: "0 0 50" }}>
                  <Tooltip title="Delete Selected">
                    <Popconfirm
                      placement="topLeft"
                      title="Are you confirm delete this record"
                      onConfirm={this.deleteLogicByNoteIds}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Tooltip>
                </div>
              </div>
            }
          ></Alert>
        ) : null}

        {dataView[this.state.viewType]}

        {/* ======================= modal窗口 ======================= */}
        <Modal
          title="Note Information"
          visible={this.state.formModalVisible}
          footer={null}
          width={"80%"}
          style={{ top: 24 }}
          destroyOnClose={true}
          onCancel={this.closeNoteFormModal}
          maskClosable={false}
        >
          <NoteForm
            noteId={this.state.noteId}
            canEdit={true}
            closeFn={this.closeNoteFormModal}
            cb={this.queryTabData}
          ></NoteForm>
        </Modal>

        <Modal
          title="Edit Note"
          visible={this.state.viewModalVisible}
          width={"80%"}
          destroyOnClose={true}
          onCancel={this.closeNoteViewModal}
          maskClosable={false}
        >
          <NoteView
            noteId={this.state.noteId}
            canEdit={true}
            closeFn={this.closeNoteViewModal}
          ></NoteView>
        </Modal>

        <Modal
          title="Finish Time"
          visible={this.state.finishTimeModalVisible}
          destroyOnClose={true}
          onCancel={this.closeFinishTimeModal}
          onOk={this.finishTodo}
          maskClosable={false}
        >
          <dl className="form_col">
            <dt>
              Finish Time{" "}
              <ClockCircleOutlined
                onClick={this.setFinishTimeCurrent}
                style={{ color: "#2db7f5", cursor: "pointer" }}
              />
            </dt>
            <dd>
              <DatePicker
                style={{ width: "50%" }}
                size={this.state.inputSize}
                onChange={(m, dataStr) => {
                  this.setState({
                    finishDateTemp:m
                  })
                }}
                value={this.state.finishDateTemp}
              />
              <TimePicker
                style={{ width: "50%" }}
                format={"HH:mm"}
                size={this.state.inputSize}
                onChange={(m, dataStr) => {
                  this.setState({
                    finishTimeTemp:m
                  })
                }}
                value={this.state.finishTimeTemp}
              />
            </dd>
          </dl>
        </Modal>
      </div>
    );
  }
}
export default NoteList;
