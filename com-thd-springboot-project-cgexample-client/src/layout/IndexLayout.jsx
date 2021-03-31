import React from 'react'
import { BrowserRouter, Route,Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb  } from 'antd';
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
} from '@ant-design/icons';

import CgexampleList from '@/components/CgexampleList'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


class IndexLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
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
            <Menu.Item key="cgexampleList" icon={<SlidersOutlined />}>
              <Link to="/cgexampleList" >Cgexample List</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "16px 16px 0px" }}>
            <div
              className="site-layout-background"
              style={{ padding: "8px 24px", minHeight: 360 }}
            >
              <Route
                path="/cgexampleList"
                exact
                component={CgexampleList}
              ></Route>
              
            </div>
          </Content> 
          <Footer style={{ textAlign: "center" }}>
            Activiti Process Management System
          </Footer>
        </Layout>
      </Layout>
    );
  }
}


export default IndexLayout