import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SlidersOutlined,
  HighlightOutlined,
  SnippetsOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import NoteList from "@/components/NoteList";
import Knowledge from '@/components/Knowledge'
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class IndexLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    // console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo">
            {/* Note */}
            ____
          </div>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="noteList" icon={<SlidersOutlined />}>
              <Link to="/noteList">Note </Link>
            </Menu.Item>
            <Menu.Item key="knowledge" icon={<SlidersOutlined />}>
              <Link to="/Knowledge">Knowledge </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "8px 8px 0px" }}>
            <div
              className="site-layout-background"
              style={{ padding: "8px 8px", minHeight: 360, background: "#fff" }}
            >
              <Route path="/noteList" exact component={NoteList}></Route>
              <Route path="/Knowledge" exact component={Knowledge}></Route>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Code Generator Example
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default IndexLayout;
