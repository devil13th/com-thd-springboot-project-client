import React from "react";
import {
  Popconfirm,
  Tooltip,
  Select,
  Input,
  Menu,
  Row,
  Col,
  Modal,
  Empty,
  message,
  Slider,
  Button,
} from "antd";
import {
  DeleteOutlined,
  FileAddOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  HddOutlined,
  UndoOutlined,
  DeploymentUnitOutlined,
  AppstoreOutlined,
  TagOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Doc from "./Doc.jsx";
import IndexForm from "./IndexForm";
import API from "@/api/KnowledgeApi";
import CONSTANTS from "@/constants/Constants.js";

const { Search } = Input;
const { SubMenu } = Menu;
const { Option } = Select;
var imgUrl = require("@/assets/images/thdicon.png");
var logoUrl = require("@/assets/images/logo.png");
class Knowledge extends React.Component {
  state = {
    keyWord: "",
    classify: "",
    dataList: [],
    current: "",
    docVisible: false,
    data: {
      content: "",
      classify: "",
    },
    classifyList: [],
    createClassifyModalVisible: false,
    classifyName: "",
    pageSize: 10,
    indexFolerModalVisible: false,
    deleteDataOfClassifyModalVisible: false,
    deleteClassify: "",
  };
  componentDidMount() {
    API.queryAllClassify().then((r) => {
      this.setState({
        classifyList: r.result,
      });
    });
  }

  onSearch = (keyWord) => {
    this.setState({ keyWord });
    const searchVO = {
      keyWords: keyWord,
      classify: this.state.classify,
      page: 0,
      pageSize: this.state.pageSize,
    };
    API.search(searchVO).then((r) => {
      console.log(r);
      this.setState({
        dataList: r.result,
      });
    });
  };

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };

  closeDocVisible = () => {
    this.setState({
      docVisible: false,
    });
  };
  openDocVisible = () => {
    this.setState({
      docVisible: true,
    });
  };
  createNewDoc = () => {
    this.setState({
      data: {
        classify: "",
        content: "",
      },
      docVisible: true,
    });
  };
  createDocIndex = () => {
    API.createDocIndex().then(
      (r) => {
        console.log(r);
        message.success("Index Be Created Success");
      },
      (err) => {
        debugger;
        message.error(err.message);
      }
    );
  };

  deleteDocIndex = () => {
    API.deleteDocIndex().then(
      (r) => {
        console.log(r);
        message.success("Index Be Deleted Success");
      },
      (err) => {
        message.error(err.message);
      }
    );
  };

  deleteDocByClassify = () => {
    if (this.state.deleteClassify) {
      API.deleteDocByClassify(this.state.deleteClassify).then(
        (r) => {
          message.success("Index Be Deleted Success");
        },
        (err) => {
          message.error(err.message);
        }
      );
    } else {
      message.error("Please Select A Classify");
    }
  };

  indexThdTecFile = () => {
    API.indexThdTecFile().then((r) => {
      message.success("SUCCESS");
    });
  };
  reIndexThdTecFile = () => {
    API.reIndexThdTecFile().then((r) => {
      message.success("SUCCESS");
    });
  };

  deleteIndexThdTecDoc = () => {
    API.deleteIndexThdTecDoc().then((r) => {
      message.success("SUCCESS");
    });
  };

  initClassifyData = () => {
    API.initClassifyData().then((r) => {
      message.success("SUCCESS");
    });
  };

  createClassifyIndex = () => {
    API.createClassifyIndex().then((r) => {
      message.success("SUCCESS");
    });
  };
  detail = (id) => {
    API.loadDocById(id).then((r) => {
      let rst = r.result;
      // if (rst.classify) {
      //   rst.classify = rst.classify.split(",");
      // }
      this.setState({
        data: rst,
        docVisible: true,
      });
    });
  };

  openCreateClassifyModal = () => {
    this.setState({
      createClassifyModalVisible: true,
    });
  };

  closeCreateClassifyModal = () => {
    this.setState({
      createClassifyModalVisible: false,
    });
  };

  openDeleteDataOfClassifyModal = () => {
    this.setState({
      deleteDataOfClassifyModalVisible: true,
    });
  };

  closeDeleteDataOfClassifyModal = () => {
    this.setState({
      deleteDataOfClassifyModalVisible: false,
    });
  };

  createClassify = () => {
    API.createClassify(this.state.classifyName).then((r) => {
      message.success("Create Classify SUCCESS");
      this.closeCreateClassifyModal();
    });
  };

  setClassifyName = (e) => {
    this.setState({
      classifyName: e.target.value,
    });
  };

  setPage = (v) => {
    this.setState({
      pageSize: v,
    });
  };

  sliderFormatter = (v) => {
    return `查询数量：${v} 条`;
  };

  openIndexFolerModal = () => {
    this.setState({
      indexFolerModalVisible: true,
    });
  };

  closeIndexFolderModal = () => {
    this.setState({
      indexFolerModalVisible: false,
    });
  };

  render() {
    console.log("================", imgUrl);

    const hasResult = this.state.dataList.length > 0;

    const search = (
      <div>
        <Input.Group compact>
          <Select
            style={{ width: 150 }}
            allowClear={true}
            placeholder={"ALL"}
            value={this.state.classify}
            onChange={(v) => {
              this.setState({ classify: v });
            }}
          >
            {this.state.classifyList.map((item) => {
              return (
                <Option value={item.code}>
                  <Tooltip title={item.name}>{item.name}</Tooltip>
                </Option>
              );
            })}
          </Select>

          <Search
            style={{ width: 350 }}
            prefix={
              <img
                src={imgUrl.default}
                style={{ marginRight: 8 }}
                height="22"
              />
            }
            value={this.state.keyWord}
            placeholder="input search text"
            onSearch={this.onSearch}
            onChange={(e) => {
              this.setState({ keyWord: e.target.value });
            }}
            enterButton
            placeholder="input search text"
          />
        </Input.Group>
        <Slider
          tipFormatter={this.sliderFormatter}
          max={100}
          min={0}
          step={5}
          value={this.state.pageSize}
          onChange={this.setPage}
        />
      </div>
    );

    const result = this.state.dataList.map((item, index) => {
      return (
        <dl key={index}>
          <dt>
            <span
              style={{ color: "#108ee9", fontSize: 18, cursor: "pointer" }}
              onClick={() => {
                this.detail(item.id);
              }}
            >
              {item.title}
            </span>
          </dt>
          <dd>
            <div>
              Description:{item.desc}
              <br />
              Classify:{item.classify}
              <br />
              FilePath:{item.filePath}
            </div>
            {item.highLight ? (
              <ul>
                {item.highLight.map((hl, idx) => {
                  return (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: hl }}></li>
                  );
                })}
              </ul>
            ) : null}
          </dd>
        </dl>
      );
    });

    const emptyData = <Empty style={{ marginTop: 32 }} />;
    return (
      <div
        style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}
      >
        <div style={{ overflow: "auto", flex: "1 1 auto", color: "#8f8f8f" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: "0 0 500px", paddingTop: 4 }}>
              {hasResult ? <div>{search}</div> : null}
            </div>
            <div style={{ flex: "1 1 auto" }}>
              <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
                style={{ textAlign: "right", borderBottom: "0px" }}
              >
                {/* <Menu.Item key="mail" icon={<UploadOutlined />}>
                  Upload Doc
                </Menu.Item> */}
                <Menu.Item
                  key="app"
                  icon={<EditOutlined />}
                  onClick={this.createNewDoc}
                >
                  Create New Doc
                </Menu.Item>
                <SubMenu
                  key="SubMenu"
                  icon={<SettingOutlined />}
                  title="Setting"
                >
                  {/* <Menu.Item key="setting:5" icon={<PlusOutlined />}>
                    Create New Doc
                  </Menu.Item> */}
                  <Menu.ItemGroup
                    title={
                      <div>
                        <HddOutlined /> Index Folder{" "}
                      </div>
                    }
                  >
                    <Menu.Item
                      key="setting:2"
                      icon={<UndoOutlined />}
                      onClick={this.openIndexFolerModal}
                    >
                      <Tooltip title="Index All File Of Folder To Classify Which You Selected">
                        Index Foler
                      </Tooltip>
                    </Menu.Item>
                    {/* <Menu.Item
                      key="setting:indexThdTecFile"
                      icon={<DeploymentUnitOutlined />}
                      onClick={this.indexThdTecFile}
                    >
                      Index Thd Tec Doc
                    </Menu.Item> */}

                    <Menu.Item
                      key="setting:deleteIndexThdTecDoc"
                      icon={<DeleteOutlined />}
                      onClick={this.openDeleteDataOfClassifyModal}
                    >
                      <Tooltip title="Remove All Doc Of Classify Which You Selected">
                        Remove All Doc For Classify
                      </Tooltip>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup
                    title={
                      <div>
                        <HddOutlined /> Classify Management
                      </div>
                    }
                  >
                    <Menu.Item
                      key="setting:createClassifyIndex"
                      icon={<DeploymentUnitOutlined style={{ color: "red" }} />}
                      onClick={this.createClassifyIndex}
                    >
                      Create Classify Index
                    </Menu.Item>
                    <Menu.Item
                      key="setting:initClassifyData"
                      icon={<UndoOutlined style={{ color: "red" }} />}
                    >
                      <Popconfirm
                        title="Are you sure to initalize classify dic data ?"
                        onConfirm={this.initClassifyData}
                        okText="Yes"
                        cancelText="No"
                      >
                        Init Classify Date
                      </Popconfirm>
                    </Menu.Item>

                    <Menu.Item
                      key="setting:deleteClassifyIndex"
                      icon={<DeleteOutlined style={{ color: "red" }} />}
                    >
                      Delete Classify Index
                    </Menu.Item>

                    <Menu.Item
                      key="setting:createClassify"
                      icon={<FileAddOutlined />}
                      onClick={this.openCreateClassifyModal}
                    >
                      Create New Classify
                    </Menu.Item>
                  </Menu.ItemGroup>

                  <Menu.ItemGroup
                    title={
                      <div>
                        <HddOutlined /> Management
                      </div>
                    }
                  >
                    {/* <Menu.Item key="setting:4" icon={<HddOutlined />}>
                      Document
                    </Menu.Item> */}
                    <Menu.Item
                      key="setting:createDocIndex"
                      icon={<DeploymentUnitOutlined style={{ color: "red" }} />}
                      onClick={this.createDocIndex}
                    >
                      Create Index
                    </Menu.Item>
                    <Menu.Item
                      key="setting:deleteDocIndex"
                      icon={<DeleteOutlined style={{ color: "red" }} />}
                    >
                      <Popconfirm
                        title="Are you sure to delete index ?"
                        onConfirm={this.deleteDocIndex}
                        okText="Yes"
                        cancelText="No"
                      >
                        <a href="#">Delete Index</a>
                      </Popconfirm>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
              </Menu>
            </div>
          </div>

          {/* 首页搜索 */}
          {!hasResult ? (
            <div style={{ marginTop: 100, width: 500, margin: "0px auto" }}>
              <img src={logoUrl.default} height="30" />
              {search}
            </div>
          ) : null}
          <div style={{ marginTop: 100, margin: "0px 100px" }}>
            {hasResult ? result : emptyData}
          </div>
        </div>

        {/* footer */}
        <div style={{ flex: "0 0 40", textAlign: "center", color: "#8f8f8f" }}>
          {" "}
          Thd ElasticSearch{" "}
        </div>

        <Modal
          title="Create Document"
          visible={this.state.docVisible}
          width={"80%"}
          style={{ top: 24 }}
          destroyOnClose={true}
          footer={null}
          onCancel={this.closeDocVisible}
          maskClosable={false}
          okText={`Create Document`}
        >
          <Doc data={this.state.data} cb={this.closeDocVisible}></Doc>
        </Modal>

        <Modal
          title="Create Classify"
          visible={this.state.createClassifyModalVisible}
          width={500}
          style={{ top: 24 }}
          destroyOnClose={true}
          onCancel={this.closeCreateClassifyModal}
          onOk={this.createClassify}
          maskClosable={false}
          okText={`Create`}
        >
          Classify :{" "}
          <Input
            value={this.state.classifyName}
            onChange={this.setClassifyName}
          />
        </Modal>

        <Modal
          title="Delete All Date for Classify "
          visible={this.state.deleteDataOfClassifyModalVisible}
          width={500}
          style={{ top: 24 }}
          destroyOnClose={true}
          onCancel={this.closeDeleteDataOfClassifyModal}
          okButtonProps={{
            danger: true,
          }}
          onOk={this.deleteDocByClassify}
          maskClosable={false}
          okText="Delete All Date for Classify"
        >
          Classify：
          <Select
            style={{ width: 250 }}
            allowClear={true}
            placeholder={"Please Select A Classify"}
            value={this.state.deleteClassify}
            onChange={(v) => {
              this.setState({ deleteClassify: v });
            }}
          >
            {this.state.classifyList.map((item) => {
              return (
                <Option value={item.code}>
                  <Tooltip title={item.name}>{item.name}</Tooltip>
                </Option>
              );
            })}
          </Select>
        </Modal>

        <Modal
          title="Index Folder"
          visible={this.state.indexFolerModalVisible}
          width={500}
          style={{ top: 24 }}
          destroyOnClose={true}
          footer={null}
          maskClosable={false}
          okText={`Index`}
          onCancel={this.closeIndexFolderModal}
        >
          <IndexForm
            okFn={this.closeIndexFolderModal}
            cancelFn={this.closeIndexFolderModal}
          >
            {" "}
          </IndexForm>
        </Modal>
      </div>
    );
  }
}

export default Knowledge;
