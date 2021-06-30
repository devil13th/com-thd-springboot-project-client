import React from "react";
import MdEditor from "./MdEditor.jsx";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
  Divider,
  Tabs,
  Input,
  Radio,
  Button,
  Tooltip,
  Select,
  Tag,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import CONSTANTS from "@/constants/Constants.js";
import API from "@/api/KnowledgeApi";
import _ from "lodash";
const { TabPane } = Tabs;
const { Option } = Select;
class Doc extends React.Component {
  state = {
    activeKey: "view",
    inputSize: "middle",
    selectTag: "",
    formData: {
      content: "",
      classify: "",
    },
    classifyList:[]
  };

  static propTypes = {
    data: PropTypes.object,
    cb: PropTypes.func,
  };
  static defaultProps = {
    data: {
      classify: "",
      content: "",
    },
    cb: () => {},
  };

  componentDidMount() {
    console.log(this.props.data);
    API.queryAllClassify().then(r => {
      this.setState({
        classifyList : r.result
      })
    })
    const selfData = _.cloneDeep(this.props.data);
    if (!selfData.classify) {
      selfData.classify = [];
    }
    if (!selfData.content) {
      selfData.content = "";
    }

    let activeKey = "edit";
    if (selfData.id) {
      activeKey = "view";
    }
    this.setState({
      formData: selfData,
      activeKey,
    });
  }

  changeTab = (key) => {
    this.setState({
      activeKey: key,
    });
  };
  mdChange = (content) => {
    this.setState({
      formData: { ...this.state.formData, content },
    });
  };
  createInputMode = (v, propName) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [propName]: v,
      },
    });
  };
  selectTag = (selectTag) => {
    this.setState({
      selectTag,
    });
  };
  removeTag = (value) => {
    let tag = this.state.formData.tag.filter(
      (item) => !(value === item)
    );
    this.setState({
      formData: { ...this.state.formData, tag },
    });
  };
  addTag = () => {
    let existObj = this.state.formData.tag.find(
      (item) => item === this.state.selectTag
    );
    if (existObj) {
      message.error("exist !");
    } else {
      this.setState({
        formData: {
          ...this.state.formData,
          tag: [
            this.state.selectTag,
            ...this.state.formData.tag,
          ],
        },
      });
    }
  };
  createDoc = () => {
    const data = _.cloneDeep(this.state.formData);
    if (data.tag && data.tag.length > 0) {
      data.tag = data.tag.join(",");
    } else {
      delete data.tag;
    }
    API.createDoc(data).then((r) => {
      if (r.code === "0") {
        message.success(" SUCCESS ");
        this.props.cb();
      } else {
        message.error(r.msg);
      }
    });
  };
  render() {
    return (
      <div>
        {/* {JSON.stringify(CONSTANTS.CLASSIFY)} */}
        {/* {JSON.stringify(this.state.formData)} */}
        {/* {JSON.stringify(this.props.data)} */}
        {/* <dl className="form_col">
          <dd>
            <Radio.Group defaultValue="a" onChange={ e => {this.createInputMode(e.target.value,"docType")}}>
              <Radio.Button value="MARKDOWN">MARKDOWN</Radio.Button>
              <Radio.Button value="HTML">HTML</Radio.Button>
            </Radio.Group>
          </dd>
        </dl> */}
        <dl className="form_col">
          <dd>
            <Input
              size={this.state.inputSize}
              value={this.state.formData.title}
              placeholder="Title ..."
              onChange={(e) => {
                this.createInputMode(e.target.value, "title");
              }}
            />
          </dd>
        </dl>

        <dl className="form_col">
          <dd>
            <Input
              size={this.state.inputSize}
              value={this.state.formData.desc}
              placeholder="Description ..."
              onChange={(e) => {
                this.createInputMode(e.target.value, "desc");
              }}
            />
          </dd>
        </dl>

        <Tabs activeKey={this.state.activeKey} onChange={this.changeTab}>
          <TabPane tab="Edit" key="edit">
            <MdEditor
              change={this.mdChange}
              content={this.state.formData.content}
            ></MdEditor>
          </TabPane>
          <TabPane tab="View" key="view">
            <MarkdownPreview
              style={{ marginBottom: 24 }}
              source={this.state.formData.content}
            />
          </TabPane>
          <TabPane tab="Detail" key="detail">
          <dl className="form_col">
          <dd>
            <Input
              size={this.state.inputSize}
              value={this.state.formData.filePath}
              placeholder="File Path ..."
              onChange={(e) => {
                this.createInputMode(e.target.value, "filePath");
              }}
            />
          </dd>
        </dl>
          </TabPane>
        </Tabs>

        <dl className="form_col">
          <dd>

            {/* <Select
              size="small"
              value={this.state.formData.classify}
              onChange={(e) => {
                this.createInputMode(e.target.value, "classify");
              }}
              style={{ width: 120, marginRight: 8 }}
            >
              {CONSTANTS.CLASSIFY.map((item) => {
                return <Option value={item.value}>{item.name}</Option>;
              })}
            </Select> */}


            <Select
              value={this.state.formData.classify}
              placeholder="Classify"
              onChange={(v) => {
                this.createInputMode(v, "classify");
              }}
              style={{ width: 120, marginRight: 8 }}
            >
              {this.state.classifyList.map((item) => {
                return <Option value={item.value} key={item.code}>{item.name}</Option>;
              })}
            </Select>
            
          </dd>
        </dl>

        <Divider></Divider>
        <div style={{ textAlign: "right" }}>
          <Button type="primary" onClick={this.createDoc}>
            Create Document
          </Button>
        </div>
      </div>
    );
  }
}

export default Doc;
