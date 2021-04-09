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
import CgTestList from '@/components/CgTestList'
import MyPlanList from '@/components/MyPlanList'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


class IndexLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
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
            <Menu.Item key="cgexampleList" icon={<SlidersOutlined />}>
              <Link to="/cgexampleList" >Cgexample List</Link>
            </Menu.Item>
            <Menu.Item key="cgtestList" icon={<SlidersOutlined />}>
              <Link to="/cgtestList" >Cgtest List</Link>
            </Menu.Item>
            <Menu.Item key="myplanList" icon={<SlidersOutlined />}>
              <Link to="/myplanList" >MyPlan List</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "8px 8px 0px" }}>
            <div
              className="site-layout-background"
              style={{ padding: "8px 8px", minHeight: 360,background:'#fff' }}
            >
              <Route
                path="/cgexampleList"
                exact
                component={CgexampleList}
              ></Route>

<Route
                path="/cgtestList"
                exact
                component={CgTestList}
              ></Route>
     <Route
                path="/myplanList"
                exact
                component={MyPlanList}
              ></Route>         
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


export default IndexLayout