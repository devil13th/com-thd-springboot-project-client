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
      
        <Layout className="site-layout">
          <Content style={{ margin: "8px 8px 0px" }}>
            <div
              className="site-layout-background"
              style={{ padding: "8px 8px", minHeight: 360, background: "#fff" }}
            >
              <Route path="/" exact component={NoteList}></Route>
              {/* <Route path="/Knowledge" exact component={Knowledge}></Route> */}
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
