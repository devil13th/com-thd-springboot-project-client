import React from "react";
import {
  Divider,
  Table,
  Input,
  Button,
  Switch,
  Tooltip,
  Tree,
  Modal,
  Row,
  Col,
  Pagination
} from "antd";
import NoteDetail from "./NoteDetail";
import NoteApi from "@/api/NoteApi";
import DateUtils from "@/tools/DateUtils";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  FilterOutlined,
  AudioOutlined,
  BookOutlined,
  MenuOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
const { Search } = Input;
const { DirectoryTree } = Tree;
class NoteList extends React.Component {
  state = {
    treeVisible: false,
    noteVisible: false,
    mode: "LIST", // DETAIL LIST
    queryCondition: {},
    tableLoading: false,
    tableData: [],
    pagination: {
      pageNum: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 15, 50, 100],
      showTotal: (total, range) => {
        return `${total} items`;
      },
      showSizeChanger: true,
      showQuickJumper: true,
    },
    // 排序
    sorter: {
      field: "create_time",
      order: "descend",
    },
  };

  onSearch = (k) => {
    this.setState(
      {
        queryCondition: { ...this.state.queryCondition, keyWord: k },
      },
      this.search
    );
  };

  toggleMode = () => {
    if (!this.state.mode || this.state.mode === "LIST") {
      this.setState({ mode: "DETAIL" });
    } else {
      this.setState({ mode: "LIST" });
    }
  };
  onChange = (value) => {
    console.log("onChange ", value);
    this.setState({ value });
  };
  openNoteModal = () => {
    this.setState({ noteVisible: true });
  };
  closeNoteModal = () => {
    this.setState({ noteVisible: false });
  };
  showModal = () => {
    this.setState({ treeVisible: true });
  };

  handleOk = () => {
    this.setState({ treeVisible: false });
  };

  handleCancel = () => {
    this.setState({ treeVisible: false });
  };

  onSelect = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  onExpand = () => {
    console.log("Trigger Expand");
  };

  search = () => {
    this.queryList(true);
  };

  queryList = (clearPage) => {
    console.log("===", this.state.pagination);
    if (clearPage) {
      // 清除分页
      this.setState(
        {
          pagination: {
            showTotal: (total, range) => {
              return `${total} items`;
            },
            showSizeChanger: true,
            showQuickJumper: true,
            ...this.state.pagination,
            pageNum: 1,
          },
        },
        this.basicQuery
      );
    } else {
      this.basicQuery();
    }
  };

  // 基础查询
  basicQuery = () => {
    const _this = this;
    const queryCondition = {
      pageNum: this.state.pagination.pageNum,
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      sortField: this.state.sorter.field,
      sortOrder: this.state.sorter.order.replace("end", ""),
      keyWords: this.state.keyWords,
      ...this.state.queryObj,
    };
    this.setState({ tableLoading: true });

    NoteApi.findNotePage(queryCondition).then((result) => {
      console.log("--||-", result);
      const r = result.data;
      this.setState({
        tableData: r.result.list,
        tableLoading: false,
        pagination: {
          ...this.state.pagination,
          showTotal: (total, range) => {
            return `${total} items`;
          },
          showSizeChanger: true,
          showQuickJumper: true,
          pageNum: r.result.pageNum,
          pageSize: r.result.pageSize,
          total: r.result.total,
        },
      });
    });
  };

  // 分页/排序 事件处理
  handleTableChange = (pagination, filters, sorter) => {
    const st = {
      pagination: {
        showTotal: (total, range) => {
          return `${total} items`;
        },
        showSizeChanger: true,
        showQuickJumper: true,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        total: this.state.pagination.total,
      },
    };
    if (sorter.field && sorter.order) {
      st.sorter = {
        field: sorter.field,
        order: sorter.order,
      };
    } else {
      st.sorter = {
        field: "",
        order: "",
      };
    }
    this.setState(st, this.queryList);
  };

  render() {
    const lSpan = this.state.mode === "DETAIL" ? 10 : 24;
    const rSpan = this.state.mode === "DETAIL" ? 14 : 0;

    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Expire",
        dataIndex: "expireDate",
        key: "expireDate",
        render: (text) => {
          if (text) {
            return DateUtils.formatToDate(text);
          } else {
            return "";
          }
        },
      },
    ];

    const treeData = [
      {
        title: "parent 0",
        key: "0-0",
        children: [
          { title: "leaf 0-0", key: "0-0-0", isLeaf: true },
          { title: "leaf 0-1", key: "0-0-1", isLeaf: true },
        ],
      },
      {
        title: "parent 1",
        key: "0-1",
        children: [
          { title: "leaf 1-0", key: "0-1-0", isLeaf: true },
          { title: "leaf 1-1", key: "0-1-1", isLeaf: true },
        ],
      },
    ];

    const controlBton =
      this.state.mode === "LIST" ? (
        <Tooltip title="List Mode">
          <Button
            onClick={this.toggleMode}
            size={"small"}
            icon={<MenuOutlined />}
            style={{ marginRight: "4px" }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Detail Mode">
          <Button
            onClick={this.toggleMode}
            size={"small"}
            icon={<UnorderedListOutlined />}
            style={{ marginRight: "4px" }}
          />
        </Tooltip>
      );

    const dataList =
      this.state.mode === "LIST" ? (
        <Table
          onChange={this.handleTableChange}
          style={{ marginTop: "4px" }}
          size={"small"}
          dataSource={this.state.tableData}
          columns={columns}
          pagination={this.state.pagination}
          loading={this.state.tableLoading}
          rowKey={(record) => {
            return record.noteId;
          }}
        />
      ) : (
        <div>
          {this.state.tableData.map((item) => {
            return (
              <div
                key={item.noteId}
                className="block"
                style={{ marginTop: "8px" }}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ fontWeight: "bold", flex: "0 0 60px" }}>
                    Title
                  </div>
                  <div style={{ flex: "0 0 auto" ,color:'#3c8dbc'}}>{item.title}</div>
                </div>
                <div className="divider"></div>
                <div style={{ display: "flex" }}>
                  <div style={{ fontWeight: "bold", flex: "1 1 auto" }}>
                    Expire
                  </div>
                  <div style={{ flex: "1 1 100"  ,color:'#3c8dbc'}}>
                    {DateUtils.formatToDate(item.expireDate)}
                  </div>
                </div>
                <div className="divider"></div>
                {item.age}
                <div style={{ textAlign: "right", marginTop: "8px" }}>
                  <EditOutlined
                    style={{ color: "#3c8dbc", cursor: "pointer" }}
                  />
                </div>
              </div>
            );
          })}
          <Pagination style={{marginTop:'8px'}} size={'small'} {...this.state.pagination}/>
        </div>
      );

    return (
      <div style={{ background: "#ecf0f5" }}>
        <Row gutter={24}>
          <Col span={lSpan}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "0 0 110px" }}>
                <Tooltip title="Classify Management">
                  <Button
                    size={"small"}
                    icon={<BookOutlined />}
                    style={{ marginRight: "4px" }}
                  />
                </Tooltip>
                {controlBton}
                <Tooltip title="Create">
                  <Button
                    type="primary"
                    size={"small"}
                    icon={<EditOutlined />}
                    style={{ marginRight: "4px" }}
                    onClick={this.openNoteModal}
                  />
                </Tooltip>
              </div>
              <div style={{ flex: "2 2 auto" }}>
                {/* <div className="block" style={{width:200}}>1234</div> */}
              </div>
              <div style={{ flex: "0 0 200px", textAlign: "right" }}>
                <Tooltip title="Query Todo Only ?">
                  <Switch
                    style={{ marginRight: 8 }}
                    size={"small"}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                  />
                </Tooltip>

                <Tooltip title="Classify Filter">
                  <Button
                    onClick={this.showModal}
                    size={"small"}
                    icon={<FilterOutlined />}
                    style={{ marginRight: "4px" }}
                  />
                </Tooltip>

                <Search
                  placeholder="key words"
                  onSearch={this.onSearch}
                  enterButton
                  size={"small"}
                  style={{ width: 120 }}
                />
              </div>
            </div>

            {dataList}
          </Col>
          <Col span={rSpan}>xxxxx</Col>
        </Row>
        <Modal
          title="Classify Filter"
          visible={this.state.treeVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <i>Press Ctrl Can Select Mutiple Classify</i>
          <DirectoryTree
            multiple
            defaultExpandAll
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            treeData={treeData}
          />
        </Modal>

        <Modal
          title="Note"
          visible={this.state.noteVisible}
          onOk={this.closeNoteModal}
          onCancel={this.closeNoteModal}
          width={'95%'}
          destroyOnClose={true}
        >
          <NoteDetail></NoteDetail>
        </Modal>
      </div>
    );
  }
}

export default NoteList;
