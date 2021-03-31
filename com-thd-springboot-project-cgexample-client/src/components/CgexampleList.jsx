import React from "react";
import {
  Menu,
  Modal,
  Table,
  Button,
  Input,
  Dropdown,
  Tooltip,
  message,
  Pagination,
  Popconfirm,
  Card,
} from "antd";
import CgexampleApi from "@/api/CgexampleApi";
import DateUtils from "@/tools/DateUtils";
import CgexampleForm from "./CgexampleForm";
import CgexampleView from "./CgexampleView";
import {
  UserOutlined,
  EyeOutlined,
  CloseCircleFilled,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  MoreOutlined,
  
} from "@ant-design/icons";

const { Search } = Input;
class CgexampleList extends React.Component {
  state = {
    // 查询条件
    cgExampleQueryCondition: {},
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

  // 表格改变事件
  cgExampleTabChange = (pagination, filters, sorter) => {
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

  createOperate = (record) => {
    const menu = (
      // JSON.stringify(record)
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

  keyWordsChange = (e) => {
   this.setState({
      cgExampleQueryCondition:{...this.state.cgExampleQueryCondition,keyWords:e.target.value}
    })
  }

  clearKeyWords = () => {
    this.setState(
      {
        cgExampleQueryCondition: {
          ...this.state.cgExampleQueryCondition,
          keyWords:'',
        },
      },
      () => {
        this.queryCgExampleTabData(true);
      }
    );
  }

  addCgExample = () => {
    CgexampleApi.addCgExample({
      userName: "2222",
      userBirthday: "2020-01-01",
    }).then((r) => {
      console.log(r);
    });
  };

  logicDeleteCgExample = (cgExampleId) => {
    CgexampleApi.logicDeleteCgExample(cgExampleId)
      .then((r) => {
        message.info("SUCCESS");
        this.queryCgExampleTabData()
      })
      .catch((r) => {
        message.info("FAILURE");
      });
  };

  closeCgexampleFormModal = () => {
    this.setState({
      cgExampleFormModalVisible: false,
      cgExampleId: "",
    });
  };
  closeCgexampleViewModal = () => {
    this.setState({
      cgExampleViewModalVisible: false,
      cgExampleId: "",
    });
  };
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
  openCgexampleViewModal = (cgExampleId) => {
    this.setState({
      cgExampleId: cgExampleId,
      cgExampleViewModalVisible: true,
    });
  };
  

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

    return (
      <div>
        <div className="tabTool">
          <Search
            placeholder="Key Word"
            style={{ width: 200, marginRight: 8 }}
            onSearch={this.onSearch}
            onChange={this.keyWordsChange}
            suffix={<CloseCircleFilled onClick={this.clearKeyWords} style={{cursor:'pointer',fontSize: 12,color: '#aaa'}}/>}
            value={this.state.cgExampleQueryCondition.keyWords}
            enterButton
          />

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
        <Table
          loading={this.state.cgExampleTabLoading}
          rowKey={(record) => record.userId}
          size={"small"}
          columns={cgExampleTabDataColumns}
          dataSource={this.state.cgExampleTabData}
          pagination={this.state.cgExampleTabPagination}
          onChange={this.cgExampleTabChange}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          {this.state.cgExampleTabData.map((item) => {
            return (
              <div
                className="block"
                style={{ flex: "0 0 300px", marginTop: 8 }}
                key={item.userId}
              >
                <div className="title">{item.userName}</div>

                <dl class="profile">
                  <dt>Age</dt>
                  <dd>{item.userAge}</dd>
                </dl>

                <dl class="profile">
                  <dt>Birthday</dt>
                  <dd> {DateUtils.formatToDate(item.userBirthday)}</dd>
                </dl>

                <div class="divider"></div>
                <div style={{ textAlign: "right" }}>
                  {this.createOperate(item)}
                </div>
              </div>
            );
          })}
        </div>
        <Pagination
          {...this.state.cgExampleTabPagination}
          onChange={this.cgExampleTabPaginationChange}
        />

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
      </div>
    );
  }
}
export default CgexampleList;
