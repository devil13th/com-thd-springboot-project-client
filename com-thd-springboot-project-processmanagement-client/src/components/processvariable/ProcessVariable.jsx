import React from "react";
import PropTypes from "prop-types";
import ProcessApi from "@/api/ProcessApi";
import {Divider,Alert,Input, InputNumber, Select, Radio, Row, Col, Button, message } from "antd";
import {EditOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const { Option } = Select;
class ProcessVariable extends React.Component {
  state = {
    executionVar: "",
    executionLocalVar: "",
    taskVar:"",
    taskLocalVar:"",
    tid: "",
    idType: "",
    processVarStr:"{}"
  };

  static propTypes = {
    processVarType: PropTypes.string,
    id: PropTypes.string,
  };

  componentDidMount() {

    if (this.props.id) {
      this.setState(
        {
          tid: this.props.id,
          idType: this.props.processVarType,
        },
        this.search
      );
    }
   
  }

  search = () => {
    // alert(this.state.idType + "|" + v)

    if(this.state.idType === 'execution'){
        ProcessApi.queryProcessVarByExecutionId(this.state.tid).then((r) => {
            console.log(r);
            this.setState({
                executionVar: JSON.stringify(r.data),
            });
        });

        ProcessApi.queryProcessVarLocalByExecutionId(this.state.tid).then((r) => {
            console.log(r);
            this.setState({
                executionLocalVar: JSON.stringify(r.data),
            });
        });
    }else{
        ProcessApi.queryProcessVarByTaskId(this.state.tid).then((r) => {
            console.log(r);
            this.setState({
                taskVar: JSON.stringify(r.data),
            });
        });

        ProcessApi.queryProcessVarLocalByTaskId(this.state.tid).then((r) => {
            console.log(r);
            this.setState({
                taskLocalVar: JSON.stringify(r.data),
            });
        });

    }
  };

  vmodel = (name, v) => {
    this.setState({ [name]: v });
  }


  setVarGlobal = () => {
    let processVar = {}
    try{
        processVar = JSON.parse(this.state.processVarStr);
    }catch(e){
        message.error(" JSON parse err!");
        return
    }

    if(this.state.idType === "execution"){
        ProcessApi.setProcessVarGlobalByExecutionId({
            executionId:this.state.tid,
            processVariable:processVar
        }).then( r =>{
            this.search();
        })
    }else{
        ProcessApi.setProcessVarGlobalByTaskId({
            executionId:this.state.tid,
            processVariable:processVar
        }).then( r =>{
            this.search();
        })
    }


  }
  setVarLocal = () => {
    let processVar = {}
    try{
        processVar = JSON.parse(this.state.processVarStr);
    }catch(e){
        message.error(" JSON parse err!");
        return
    }

    if(this.state.idType === "execution"){
        ProcessApi.setProcessVarLocalByExecutionId({
            executionId:this.state.tid,
            processVariable:processVar
        }).then( r =>{
            this.search();
        })
    }else{
        ProcessApi.setProcessVarLocalByTaskId({
            executionId:this.state.tid,
            processVariable:processVar
        }).then( r =>{
            this.search();
        })
    }
  }

  render() {
    return (
      <div>
        <div style={{ textAlign: "right" }}>
          <Input.Group compact>
            <Select
              style={{ width: 130 }}
              defaultValue="execution"
              value={this.state.idType}
              onChange={(v) => {
                this.setState({ idType: v });
              }}
            >
              <Option value="execution">Execution ID</Option>
              <Option value="task">Task ID</Option>
            </Select>

            <Input.Search
              enterButton
              style={{ width: 200 }}
              onChange={(e) => {
                this.setState({ tid: e.target.value });
              }}
              value={this.state.tid}
              onSearch={this.search}
            />
          </Input.Group>
        </div>
        <Divider />
        {/* {JSON.stringify(this.props)}|{JSON.stringify(this.state)} */}
        <Row>
          <Col
            span={4}
            style={{ textAlign: "right", paddingRight: 8, paddingTop: 6 }}
          >
            <EditOutlined /> Set Process Variable:
          </Col>
          <Col span={10}>
            <TextArea
              value={this.state.processVarStr}
              onChange={(e) => {
                this.vmodel("processVarStr", e.target.value);
              }}
            ></TextArea>

            <div
              dangerouslySetInnerHTML={{
                __html: `Eg.<br/>{<br/>"users":["zhangsan","lisi","wangwu"],<br/>"judge":"”zhaoliu"<br/>}`,
              }}
            ></div>
          </Col>
          <Col span={9} offset={1}>
            <Button onClick={this.setVarGlobal}> Set Variable Global</Button>
            <Divider type="vertical" />
            <Button onClick={this.setVarLocal}> Set Variable Local</Button>
          </Col>
        </Row>

        <Divider />
        <Row>
          <Col
            span={10}
            style={{ textAlign: "right", paddingRight: 8, paddingTop: 6 }}
          >
             Execution Gloab Variable :
          </Col>
          <Col span={14}>
            <Alert
              message={this.state.executionVar ? this.state.executionVar : "{}"}
              type="warning"
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col
            span={10}
            style={{ textAlign: "right", paddingRight: 8, paddingTop: 6 }}
          >
             Execution Local Variable :
          </Col>
          <Col span={14}>
            <Alert
              message={
                this.state.executionLocalVar
                  ? this.state.executionLocalVar
                  : "{}"
              }
              type="warning"
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col
            span={10}
            style={{ textAlign: "right", paddingRight: 8, paddingTop: 6 }}
          >
             Task Gloab Variable :
          </Col>
          <Col span={14}>
            <Alert
              message={this.state.taskVar ? this.state.taskVar : "{}"}
              type="info"
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col
            span={10}
            style={{ textAlign: "right", paddingRight: 8, paddingTop: 6 }}
          >
             Task Local Variable :
          </Col>
          <Col span={14}>
            <Alert
              message={this.state.taskLocalVar ? this.state.taskLocalVar : "{}"}
              type="info"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProcessVariable;
