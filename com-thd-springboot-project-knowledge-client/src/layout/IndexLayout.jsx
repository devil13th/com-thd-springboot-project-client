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
import HtmlEditor from '@/components/htmlEditor/HtmlEditor'

import MarkdownEditor from '@/components/htmlEditor/MarkdownEditor'

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
              <Route path="/h" exact component={HtmlEditor}></Route>
              <Route path="/m" exact component={MarkdownEditor}></Route>
              
              
            </div>
         
    );
  }
}

export default IndexLayout;
