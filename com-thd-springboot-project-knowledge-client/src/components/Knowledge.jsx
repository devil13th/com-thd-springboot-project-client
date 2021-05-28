import React from "react";
import {Popconfirm, Input, Menu, Row, Col, Modal, Empty, message } from "antd";
import {
  DeleteOutlined,
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
import API from "@/api/KnowledgeApi";
const { Search } = Input;
const { SubMenu } = Menu;
var imgUrl = require("@/assets/images/thdicon.png");
var logoUrl = require("@/assets/images/logo.png");
class Knowledge extends React.Component {
  state = {
    keyWord: "",
    dataList: [],
    current: "",
    docVisible: false,
    data: {
      content: "",
      classify: [],
    },
  };
  onSearch = (keyWord) => {
    this.setState({ keyWord });
    const searchVO = { keyWords: keyWord };
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
      data:{
        classify:[],
        content:''
      },
      docVisible: true,
    })
  }
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
  indexThdTecFile = () => {
    API.indexThdTecFile().then((r) => {
      message.success("SUCCESS");
    });
  };
  detail = (id) => {
    API.loadDocById(id).then((r) => {
      let rst = r.result;
      if (rst.classify) {
        rst.classify = rst.classify.split(",");
      }
      this.setState({
        data: rst,
        docVisible: true,
      });
    });
  };
  render() {
    console.log("================", imgUrl);

    const hasResult = this.state.dataList.length > 0;

    const search = (
      <Search
        prefix={
          <img src={imgUrl.default} style={{ marginRight: 8 }} height="22" />
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
            <div style={{ flex: "0 0 300px", paddingTop: 4 }}>
              {hasResult ? <div>{search}</div> : null}
            </div>
            <div style={{ flex: "1 1 auto" }}>
              <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
                style={{ textAlign: "right", borderBottom: "0px" }}
              >
                <Menu.Item key="mail" icon={<UploadOutlined />}>
                  Upload Doc
                </Menu.Item>
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
                  <Menu.Item key="setting:5" icon={<PlusOutlined />}>
                    Create New Doc
                  </Menu.Item>
                  <Menu.ItemGroup title="Index">
                    <Menu.Item key="setting:1">Index Tec</Menu.Item>
                    <Menu.Item key="setting:2" icon={<UndoOutlined />}>
                      Reindex
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Management">
                    <Menu.Item key="setting:3" icon={<TagOutlined />}>
                      Classify
                    </Menu.Item>
                    <Menu.Item key="setting:4" icon={<HddOutlined />}>
                      Document
                    </Menu.Item>
                    <Menu.Item
                      key="setting:createDocIndex"
                      icon={<DeploymentUnitOutlined />}
                      onClick={this.createDocIndex}
                    >
                      Create Index
                    </Menu.Item>
                    <Menu.Item
                      key="setting:deleteDocIndex"
                      icon={<DeleteOutlined />}
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

                    <Menu.Item
                      key="setting:indexThdTecFile"
                      icon={<DeploymentUnitOutlined />}
                      onClick={this.indexThdTecFile}
                    >
                      Index Thd Tec Folder
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
      </div>
    );
  }
}

export default Knowledge;
