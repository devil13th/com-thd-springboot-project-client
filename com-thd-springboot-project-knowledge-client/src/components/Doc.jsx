import React from "react";
import MdEditor from "./MdEditor.jsx";
import { Input, Radio, Button, Tooltip, Select ,Tag} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusCircleOutlined ,CloseCircleOutlined} from "@ant-design/icons";
import API from '@/api/KnowledgeApi'
import _ from 'lodash';
const { Option } = Select;
class Doc extends React.Component {
  state = {
    inputSize: "middle",
    formData: {
      content: "",
      classify:[]
    },
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

  createDoc = () => {
    const data = _.cloneDeep(this.state.formData);
    if(data.classify && data.classify.length>0){
      data.classify = data.classify.join(",")
    }else{
      delete data.classify;
    }
    API.createDoc(data).then(r => {
      console.log(r)
    })
  }
  render() {
    return (
      <div>
          {JSON.stringify(this.state.formData)}
        <dl className="form_col">
          <dd>
            <Radio.Group defaultValue="a" onChange={ e => {this.createInputMode(e.target.value,"docType")}}>
              <Radio.Button value="MARKDOWN">MARKDOWN</Radio.Button>
              <Radio.Button value="HTML">HTML</Radio.Button>
            </Radio.Group>
          </dd>
        </dl>
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
        <MdEditor
          change={this.mdChange}
          content={this.state.formData.content}
        ></MdEditor>
        <dl className="form_col">
          <dd>
          <FontAwesomeIcon icon="coffee" />
            <Tag color="#108ee9">Java</Tag>
            <Tag color="#87d068">Spring Boot</Tag>
            <Tag color="#2db7f5">ElasticSearch</Tag>
            <Tag color="#f50">Redis <CloseCircleOutlined style={{color:"#fff"}}/></Tag>


            <Select size="small" defaultValue="Java" style={{ width: 120,marginRight:8 }}>
                <Option value="Java">Java</Option>
                <Option value="Spring Boot">Spring Boot</Option>
                <Option value="ElasticSearch">ElasticSearch</Option>
                <Option value="Redis">Redis</Option>
            </Select>
            <Tooltip title="Edit Tag">
            <PlusCircleOutlined style={{ color: "#1890ff", cursor: "pointer"}} />
            </Tooltip>


          </dd>
        </dl>



        
        <Button onClick={this.createDoc}>Create Document</Button>
        
      </div>
    );
  }
}

export default Doc;
