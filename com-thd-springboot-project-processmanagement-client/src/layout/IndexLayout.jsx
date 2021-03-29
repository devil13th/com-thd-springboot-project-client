import React from 'react'
import { BrowserRouter, Route,Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
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
import ProcessDefinedList from '@/components/processdefined/ProcessDefinedList'
import ProcessInstanceList from '@/components/processinstance/ProcessInstanceList'
import TaskList from '@/components/processinstance/TaskList'
import TaskHisList from '@/components/processinstance/TaskHisList'
import ProcessVariable from '@/components/processvariable/ProcessVariable'
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
            {/* Process Management */}
            ____
          </div>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="processDefinedList" icon={<SlidersOutlined />}>
              <Link to="/processDefinedList" >Process Mgmt. </Link>
            </Menu.Item>
            <Menu.Item key="processInstanceList" icon={<SnippetsOutlined />}>
              <Link to="/processInstanceList">Instance Mgmt.</Link>
            </Menu.Item>
            <Menu.Item key="taskList" icon={<UnorderedListOutlined />}>
              <Link to="/taskList">Task List</Link>
            </Menu.Item>
            <Menu.Item key="TaskHisList" icon={<OrderedListOutlined />}>
              <Link to="/TaskHisList">Task His List</Link>
            </Menu.Item>
            <Menu.Item key="ProcessVariable" icon={<FileOutlined />}>
              <Link to="/ProcessVariable">Process Var</Link>
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
                path="/processDefinedList"
                exact
                component={ProcessDefinedList}
              ></Route>
              <Route
                path="/processInstanceList"
                exact
                component={ProcessInstanceList}
              ></Route>
              <Route path="/taskList" exact component={TaskList}></Route>
              <Route path="/TaskHisList" exact component={TaskHisList}></Route>
              <Route
                path="/ProcessVariable"
                exact
                component={ProcessVariable}
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