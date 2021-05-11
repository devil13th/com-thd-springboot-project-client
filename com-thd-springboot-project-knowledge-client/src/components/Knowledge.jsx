import React from "react";
import { Input, Menu, Row, Col,Modal } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  HddOutlined,
  UndoOutlined,
  AppstoreOutlined,
  TagOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Doc from './Doc.jsx'
const { Search } = Input;
const { SubMenu } = Menu;
var imgUrl = require("@/assets/images/thdicon.png");
var logoUrl = require("@/assets/images/logo.png");
class Knowledge extends React.Component {
  state = {
    keyWord: "",
    dataList: [],
    current: "",
    docVisible:false,
  };
  onSearch = (keyWord) => {
    this.setState({ keyWord });
    alert(keyWord);
  };

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };

  closeDocVisible = () => {
    this.setState({
      docVisible:false
    })
  }
  openDocVisible = () => {
    this.setState({
      docVisible:true
    })
  }
  render() {
    console.log("================", imgUrl);
    return (
      <div
        style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            flex: "0 0 40%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: "0 0 50px" }}>
            <Row gutter={24}>
              <Col span={4}>
                <div style={{ padding: 2 }}>
                  <img src={imgUrl.default} />
                </div>
              </Col>
              <Col span={20}>
                <Menu
                  onClick={this.handleClick}
                  selectedKeys={[this.state.current]}
                  mode="horizontal"
                  style={{ textAlign: "right", borderBottom: "0px" }}
                >
                  <Menu.Item key="mail" icon={<UploadOutlined />}>
                    Upload Doc
                  </Menu.Item>
                  <Menu.Item key="app" icon={<EditOutlined />} onClick={this.openDocVisible}>
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
                    </Menu.ItemGroup>
                  </SubMenu>
                </Menu>
              </Col>
            </Row>
          </div>
          <div style={{ flex: "5 1 100px" }}></div>
          <div style={{ flex: "0 0 70px" }}>
            <Row gutter={24}>
              <Col xs={1} sm={1} sm={1} md={4} lg={6} xl={8} xxl={8}></Col>
              <Col xs={22} sm={22} sm={22} md={16} lg={12} xl={8} xxl={8} >
                <img src={logoUrl.default}  height="30"/>
                <Search
                  placeholder="input search text"
                  onSearch={this.onSearch}
                  enterButton
                  placeholder="input search text"
                  size="large"
                />
              </Col>
              <Col  xs={1} sm={1} sm={1} md={4} lg={6} xl={8} xxl={10}></Col>
            </Row>
          </div>
        </div>
        <div style={{ flex: "1 1 auto" }}></div>
        <div style={{ flex: "0 0 40", textAlign: "center", color: "#8f8f8f" }}>
          {" "}
          Thd ElasticSearch{" "}
        </div>


        <Modal
          title="Create Document"
          visible={this.state.docVisible}
          width={"80%"}
          style={{top:24}}
          destroyOnClose={true}
          onCancel={this.closeDocVisible}
          maskClosable={false}
          okText={`Create Document`}
        >
          <Doc></Doc>
        </Modal>


      </div>
    );
  }
}

export default Knowledge;
