import React from 'react';
import { Input, Select, Switch, Button, Space, Divider, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import API from '@/api/KnowledgeApi';
import PropTypes from 'prop-types';
const { Option } = Select;
class IndexForm extends React.Component {
  static propTypes = {
    okFn: PropTypes.func,
    cancelFn: PropTypes.func,
  };
  static defaultProps = {
    okFn: () => {},
    cancelFn: () => {},
  };

  state = {
    indexInfo: {
      path: '',
      classify: '',
      suffix: '.md',
      reIndex: false,
    },
    classifyList: [],
  };

  componentDidMount() {
    API.queryAllClassify().then((r) => {
      this.setState({
        classifyList: r.result,
      });
    });
  }

  createInputMode = (v, propName) => {
    this.setState({
      indexInfo: {
        ...this.state.indexInfo,
        [propName]: v,
      },
    });
  };

  reIndexFolderByClassify = () => {
    API.reIndexFolderByClassify(this.state.indexInfo).then((r) => {
      if (r.code === '0') {
        message.success('Index Folder Success');
        this.props.okFn();
      } else {
        message.error(r.msg);
      }
    });
  };

  render() {
    return (
      <div>
        <dl className="form_col">
          <dt>Folder Path : eg. D:\devil13th\thd\resource\tec </dt>
          <dd style={{ display: 'flex' }}>
            <Input
              value={this.state.indexInfo.path}
              onChange={(e) => {
                this.createInputMode(e.target.value, 'path');
              }}
            />
          </dd>
        </dl>
        <dl className="form_col">
          <dt>Classify : </dt>
          <dd style={{ display: 'flex' }}>
            <Select
              value={this.state.indexInfo.classify}
              placeholder="Classify"
              onChange={(v) => {
                this.createInputMode(v, 'classify');
              }}
              style={{ width: 150, marginRight: 8 }}
            >
              {this.state.classifyList.map((item) => {
                return (
                  <Option value={item.value} key={item.code}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </dd>
        </dl>

        <dl className="form_col">
          <dt>Suffix : eg. .md,.html,.txt </dt>
          <dd style={{ display: 'flex' }}>
            <Input
              value={this.state.indexInfo.suffix}
              onChange={(e) => {
                this.createInputMode(e.target.value, 'suffix');
              }}
            />
          </dd>
        </dl>

        <dl className="form_col">
          <dt>ReIndex：</dt>
          <dd style={{ display: 'flex' }}>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={(checked) => {
                this.createInputMode(checked, 'reIndex');
              }}
              defaultChecked={this.state.indexInfo.reIndex}
            />
          </dd>
        </dl>

        <Divider></Divider>
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button type="primary" onClick={this.reIndexFolderByClassify}>
              Index Folder
            </Button>
            <Button onClick={this.props.cancelFn}>Cancel</Button>
          </Space>
        </div>
      </div>
    );
  }
}

export default IndexForm;
