import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faBicycle } from "@fortawesome/fontawesome-free-solid";

import {
  Menu,
  Modal,
  Table,
  Button,
  Input,
  InputNumber,
  Dropdown,
  Space,
  Tooltip,
  message,
  Divider,
  Pagination,
  Popconfirm,
  Row,
  Col,
  Popover,
  Card,
  DatePicker,
} from "antd";
import CgexampleApi from "@/api/CgexampleApi";
import DateUtils from "@/tools/DateUtils";
import CgexampleForm from "./CgexampleForm";
import CgexampleView from "./CgexampleView";
import moment from "moment";
import {
  SearchOutlined,
  UpOutlined,
  EyeOutlined,
  CloseCircleFilled,
  TableOutlined,
  CloseOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const { Search } = Input;
class CgexampleList extends React.Component {
  state = {
    advanceSearchVisible: false,
    colSpan: 24,
    viewType: "LIST",
    // 查询条件
    cgExampleQueryCondition: {
      id: "",
    },
    // loading状态
    cgExampleTabLoading: false,
    // 分页数据
    cgExampleTabPagination: {
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
    cgExampleTabSort: {
      field: "createTime",
      order: "desc",
    },
    // 表格数据
    cgExampleTabData: [],
    selectedRowKeys:[],
    // modal cgExampleId
    cgExampleId: "",
    // cgExample编辑modal visible
    cgExampleFormModalVisible: false,

    // cgExample view modal visible
    cgExampleViewModalVisible: false,
  };

  componentDidMount() {
    this.queryCgExampleTabData();
  }

  // 选择框改变
  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys:[...this.state.selectedRowKeys,...selectedRowKeys] });
  };

  // 表格改变事件
  tabChange = (pagination, filters, sorter) => {
    console.log("pagination", pagination);
    console.log("filter", filters);
    console.log("sorter", sorter);

    const cgExampleTabPagination = {
      ...this.state.cgExampleTabPagination,
      current: pagination.current, // 当前页
      pageSize: pagination.pageSize, // 每页条目数
    };

    let cgExampleTabSort = {};
    if (sorter && sorter.order) {
      cgExampleTabSort = {
        field: sorter.field,
        order: sorter.order.replace("end", ""),
      };
    } else {
      cgExampleTabSort = this.state.cgExampleTabSort;
    }

    // 设置分页排序 并查询
    this.setState(
      {
        cgExampleTabPagination,
        cgExampleTabSort,
      },
      this.queryCgExampleTabData
    );
  };

  // 分页组件改变事件
  cgExampleTabPaginationChange = (page, pageSize) => {
    const cgExampleTabPagination = {
      ...this.state.cgExampleTabPagination,
      current: page, // 当前页
      pageSize: pageSize, // 每页条目数
    };

    this.setState(
      {
        cgExampleTabPagination,
      },
      this.queryCgExampleTabData
    );
  };
  // 查询列表数据 clearPage:是否清除分页信息
  queryCgExampleTabData = (clearPage) => {
    this.setState({
      cgExampleTabLoading: true,
    });
    let currentPage = this.state.cgExampleTabPagination.current;
    if (clearPage) {
      // 清除当前页信息
      currentPage = 1;
      this.setState({
        cgExampleTabPagination: {
          ...this.state.cgExampleTabPagination,
          current: 1,
        },
      });
    } else {
      currentPage = this.state.cgExampleTabPagination.current;
    }

    let cgExampleQueryCondition = this.state.cgExampleQueryCondition;
    cgExampleQueryCondition.pageNum = currentPage;
    cgExampleQueryCondition.pageSize = this.state.cgExampleTabPagination.pageSize;
    cgExampleQueryCondition.sortField = this.state.cgExampleTabSort.field;
    cgExampleQueryCondition.sortOrder = this.state.cgExampleTabSort.order;
    CgexampleApi.queryCgExampleLikeByPage(cgExampleQueryCondition)
      .then((r) => {
        this.setState({
          cgExampleTabLoading: false,
          cgExampleTabData: r.result.list,
          cgExampleTabPagination: {
            ...this.state.cgExampleTabPagination,
            total: r.result.total,
          },
        });
      })
      .catch((r) => {
        message.error("error! " + r);
        this.setState({
          cgExampleTabLoading: false,
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
              this.logicDeleteCgExample(record.id);
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
            this.openCgexampleViewModal(record.id);
          }}
          icon={<EyeOutlined />}
        >
          Data View
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <a
          className="ant-dropdown-link"
          onClick={() => {
            this.openCgexampleFormModal(record.id);
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
        cgExampleQueryCondition: {
          ...this.state.cgExampleQueryCondition,
          keyWords,
        },
      },
      () => {
        this.queryCgExampleTabData(true);
      }
    );
  };

  // 重置搜索条件
  resetSearch = () => {
    this.setState(
      {
        cgExampleQueryCondition: {},
      },
      () => {
        this.queryCgExampleTabData(true);
      }
    );
  };

  keyWordsChange = (e) => {
    this.setState({
      cgExampleQueryCondition: {
        ...this.state.cgExampleQueryCondition,
        keyWords: e.target.value,
      },
    });
  };

  clearKeyWords = () => {
    this.setState(
      {
        cgExampleQueryCondition: {
          // ...this.state.cgExampleQueryCondition,
          keyWords: "",
        },
      },
      () => {
        this.queryCgExampleTabData(true);
      }
    );
  };

  // 删除CgExample
  logicDeleteCgExample = (cgExampleId) => {
    CgexampleApi.logicDeleteCgExample(cgExampleId)
      .then((r) => {
        message.info("SUCCESS");
        this.queryCgExampleTabData();
      })
      .catch((r) => {
        message.info("FAILURE");
      });
  };

  // 关闭 编辑 modal
  closeCgexampleFormModal = () => {
    this.setState({
      cgExampleFormModalVisible: false,
      cgExampleId: "",
    });
  };
  // 关闭 视图 modal
  closeCgexampleViewModal = () => {
    this.setState({
      cgExampleViewModalVisible: false,
      cgExampleId: "",
    });
  };
  // 打开 编辑 modal
  openCgexampleFormModal = (cgExampleId) => {
    if (cgExampleId) {
      this.setState({
        cgExampleId: cgExampleId,
        cgExampleFormModalVisible: true,
      });
    } else {
      this.setState({
        cgExampleFormModalVisible: true,
      });
    }
  };
  // 打开 视图 modal
  openCgexampleViewModal = (cgExampleId) => {
    this.setState({
      cgExampleId: cgExampleId,
      cgExampleViewModalVisible: true,
    });
  };

  // 切换视图类型
  toggleViewType = () => {
    if (this.state.viewType === "LIST") {
      this.setState({
        viewType: "ITEM",
      });
    } else {
      this.setState({
        viewType: "LIST",
      });
    }
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
      cgExampleQueryCondition: {
        ...this.state.cgExampleQueryCondition,
        [propName]: v,
      },
    });
  };

  // =============================== render  =============================== //
  render() {
    // 表格字段
    const cgExampleTabDataColumns = [
      {
        title: "userName",
        dataIndex: "userName",
        key: "userName",
        sorter: true,
      },
      {
        title: "userAge",
        dataIndex: "userAge",
        key: "userAge",
        sorter: true,
      },
      {
        title: "userBirthday",
        dataIndex: "userBirthday",
        key: "userBirthday",
        sorter: true,
        render: (text, record, index) => {
          return DateUtils.formatToDate(text);
        },
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
      onChange: this.onSelectChange,
      selections: [
        {
          key: 'selectAllCurrentPage',
          text: 'Clear All',
          onSelect: changableRowKeys => {
            this.setState({ selectedRowKeys: [] });
          },
        },
        {
          key: 'selectAllPage',
          text: 'Select All Data',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ],
    };

    // 数据展示内容
    const dataView =
      this.state.viewType === "LIST" ? (
        <div
          style={{
            background: "#ecf0f5",
            borderRadius: 3,
            padding: 12,
          }}
        >
          <div className="block">
            <Table
              rowSelection={rowSelection}
              loading={this.state.cgExampleTabLoading}
              rowKey={(record) => record.id}
              size={"small"}
              columns={cgExampleTabDataColumns}
              dataSource={this.state.cgExampleTabData}
              pagination={this.state.cgExampleTabPagination}
              onChange={this.tabChange}
            />
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              background: "#ecf0f5",
              borderRadius: 3,
              padding: 4,
            }}
          >
            {this.state.cgExampleTabData.map((item) => {
              return (
                <div style={{ flex: "0 0 20%", padding: 8 }} key={item.id}>
                  <div className="block">
                    <div className="title">{item.userName}</div>

                    <dl className="profile">
                      <dt>Age</dt>
                      <dd>{item.userAge}</dd>
                    </dl>

                    <dl className="profile">
                      <dt>Birthday</dt>
                      <dd> {DateUtils.formatToDate(item.userBirthday)}</dd>
                    </dl>

                    <div className="divider"></div>
                    <div style={{ textAlign: "right" }}>
                      {this.createOperate(item)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "right" }}>
            <Pagination
              style={{ marginTop: 8 }}
              {...this.state.cgExampleTabPagination}
              onChange={this.cgExampleTabPaginationChange}
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
                  value={this.state.cgExampleQueryCondition.id}
                  onChange={(e) => {
                    this.createMode(e.target.value, "id");
                  }}
                />
              </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>userName</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.cgExampleQueryCondition.userName}
                  onChange={(e) => {
                    this.createMode(e.target.value, "userName");
                  }}
                />
              </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>userAge</dt>
              <dd>
                <InputNumber
                  size={this.state.inputSize}
                  value={this.state.cgExampleQueryCondition.userAge}
                  onChange={(v) => {
                    this.createMode(v, "userAge");
                  }}
                />
              </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>userBirthday</dt>
              <dd>
                <DatePicker
                  size={this.state.inputSize}
                  onChange={(moment, dataStr) => {
                    this.createMode(dataStr, "userBirthday");
                  }}
                  value={
                    this.state.cgExampleQueryCondition.userBirthday
                      ? moment(
                          this.state.cgExampleQueryCondition.userBirthday,
                          "YYYY-MM-DD"
                        )
                      : null
                  }
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
              this.queryCgExampleTabData(true);
            }}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          <Button onClick={this.resetSearch}>Reset</Button>
        </div>
      </div>
    );



    // ============== 组件返回内容 =============== //
    return (
      <div>
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ paddingTop: 4 }}>
              {this.state.viewType === "ITEM" ? (
                <span>
                  <TableOutlined style={{ fontSize: 16, color: "#1890ff" }} />
                  <Divider type="vertical" />
                  <UnorderedListOutlined
                    onClick={this.toggleViewType}
                    style={{ fontSize: 12 }}
                  />
                </span>
              ) : (
                <span>
                  <TableOutlined
                    onClick={this.toggleViewType}
                    style={{ fontSize: 12 }}
                  />
                  <Divider type="vertical" />
                  <UnorderedListOutlined
                    style={{ fontSize: 16, color: "#1890ff" }}
                  />
                </span>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div className="tabTool">
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
                value={this.state.cgExampleQueryCondition.keyWords}
                enterButton
              />

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
                    this.openCgexampleFormModal();
                  }}
                ></Button>
              </Tooltip>
            </div>
          </Col>
        </Row>

        {dataView}

        <Modal
          title="Cg Example Info"
          visible={this.state.cgExampleFormModalVisible}
          footer={null}
          width={"100%"}
          destroyOnClose={true}
          onCancel={this.closeCgexampleFormModal}
          maskClosable={false}
        >
          <CgexampleForm
            cgExampleId={this.state.cgExampleId}
            canEdit={true}
            closeFn={this.closeCgexampleFormModal}
            cb={this.queryCgExampleTabData}
          ></CgexampleForm>
        </Modal>

        <Modal
          title="Cg Example Info"
          visible={this.state.cgExampleViewModalVisible}
          width={"100%"}
          destroyOnClose={true}
          onCancel={this.closeCgexampleViewModal}
          maskClosable={false}
        >
          <CgexampleView
            cgExampleId={this.state.cgExampleId}
            canEdit={true}
            closeFn={this.closeCgexampleViewModal}
          ></CgexampleView>
        </Modal>

        <FontAwesomeIcon
          icon={faAnchor}
          style={{ fontSize: 20, marginRight: 8, color: "#1890ff" }}
        />
        <FontAwesomeIcon
          icon={faBicycle}
          style={{ fontSize: 20, marginRight: 8, color: "#1890ff" }}
        />
      </div>
    );
  }
}
export default CgexampleList;
