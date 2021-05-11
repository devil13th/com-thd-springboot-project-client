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

            <div
              style={{flex:'1 1 auto',display:'flex',  background: '#fff' }}
            >
              
              <Route path="/" exact component={Knowledge}></Route>

            
              
            </div>
         
    );
  }
}

export default IndexLayout;
