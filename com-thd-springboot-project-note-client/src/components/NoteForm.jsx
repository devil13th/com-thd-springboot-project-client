import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteApi from "@/api/NoteApi";
import MdEditor from "./MdEditor";
import Mde from "./Mde";
import {
  message,
  Input,
  Row,
  Switch,
  Tabs,
  Col,
  DatePicker,
  TimePicker,
  Space,
  Button,
  Radio,
  Tag,
  InputNumber,
  Divider,
  Upload,
  Rate,
} from "antd";
import {
  SaveOutlined,
  RollbackOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import DateUtils from "@/tools/DateUtils";
import moment from "moment";
const { Dragger } = Upload;
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const levelTags = [
  { key: 5, value: "紧急", color: "#cf1322" },
  { key: 4, value: "重要", color: "#d48806" },
  { key: 3, value: "正常", color: "#87d068" },
  { key: 2, value: "不紧急", color: "#2db7f5" },
  { key: 1, value: "不重要", color: "#2db7f5" },
];
class NoteForm extends React.Component {
  state = {
    formData: { classify: "Todo", content: "", todoLevel: 3, todoStatus: 0 },
    inputSize: "normal",
    formStatus: "CREATE",
    // colSpan: {
    //   xs: 24,
    //   sm: 12,
    //   md: 8,
    //   lg: 6,
    //   xl: 4,
    //   xxl: 3,
    // },
    colSpan: 24,
  };

  static propTypes = {
    noteId: PropTypes.string,
    canEdit: PropTypes.bool,
    closeFn: PropTypes.func,
    cb: PropTypes.func,
  };

  //指定默认标签属性值
  static defaultProps = {
    noteId: "", //sex默认值为男
    canEdit: true, //age默认值为18
    closeFn: () => { },
  };
  componentDidMount() {
    this.pageInit();
  }

  createInputMode = (v, propName) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [propName]: v,
      },
    });
  };

  createDateMode = (v, propName) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [propName]: v,
      },
    });
  };

  createInput = (propName) => {
    return (
      <Input
        size={this.state.inputSize}
        value={this.state.formData[propName]}
        onChange={(e) => {
          this.createInputMode(e.target.value, propName);
        }}
      />
    );
  };
  selectTag = (classify) => {
    return () => {
      this.setState({
        formData: { ...this.state.formData, classify },
      });
    };
  };
  saveNote = () => {
    const data = this.state.formData;
    if (data.startTimeTemp) {
      data.startTime = data.startDateTemp + " " + data.startTimeTemp;
    }
    if (data.finishTimeTemp) {
      data.finishTime = data.finishDateTemp + " " + data.finishTimeTemp;
    }

    if (this.state.formStatus === "CREATE") {
      NoteApi.addNote(data)
        .then((r) => {
          // console.log(r);
          this.props.closeFn();
          if (this.props.cb) {
            this.props.cb();
          }
          message.info("SUCCESS");
        })
        .catch((r) => { });
    } else {
      NoteApi.updateNote(data)
        .then((r) => {
          // console.log(r);
          this.props.closeFn();
          if (this.props.cb) {
            this.props.cb();
          }
          message.info("SUCCESS");
        })
        .catch((r) => { });
    }
  };

  mdChange = (content) => {
    this.setState({
      formData: { ...this.state.formData, content },
    });
  };

  setClassify = (e) => {
    this.setState({
      formData: { ...this.state.formData, classify: e.target.value },
    });
  };

  todoLevelChange = (tag, checked) => {
    this.setState({ formData: { ...this.state.formData, todoLevel: tag.key } });
  };

  setStartTimeCurrent = () => {
    const mmt = moment();
    this.setState({
      formData: {
        ...this.state.formData,
        startDateTemp: mmt,
        startTimeTemp: mmt,
      },
    });
  };

  setFinishTimeCurrent = () => {
    const mmt = moment();
    this.setState({
      formData: {
        ...this.state.formData,
        finishDateTemp: mmt,
        finishTimeTemp: mmt,
      },
    });
  };
  addExpireDate = () => {
    let mmt = this.state.formData.expireDate;
    if (!mmt) {
      mmt = moment();
    }

    this.setState({
      formData: {
        ...this.state.formData,
        expireDate: mmt.add(1, "days"),
      },
    });
  };
  subExpireDate = () => {
    let mmt = this.state.formData.expireDate;
    if (!mmt) {
      mmt = moment();
    }
    this.setState({
      formData: {
        ...this.state.formData,
        expireDate: mmt.add(-1, "days"),
      },
    });
  };
  toggleFinish = (checked, evt) => {
    if (checked) {
      this.createInputMode(1, "todoStatus")
    } else {
      this.createInputMode(0, "todoStatus")
    }
  }
  // 页面初始化
  pageInit = () => {
    if (this.props.noteId) {
      // init edit data
      this.setState({
        formStatus: "EDIT",
      });

      NoteApi.queryNoteById(this.props.noteId).then((r) => {
        const rst = r.result;
        if (rst.startTime) {
          rst.startDateTemp = rst.startTime.split(" ")[0];
          rst.startTimeTemp = rst.startTime.split(" ")[1];
        }
        if (rst.finishTime) {
          rst.finishDateTemp = rst.finishTime.split(" ")[0];
          rst.finishTimeTemp = rst.finishTime.split(" ")[1];
        }
        if (rst.todoStatus === 1) {
          rst.todoStatus = true
        } else {
          rst.todoStatus = false
        }
        this.setState({
          formData: rst,
        });
      });
    } else {
      // create a new note , init default data
      const mmt = moment();
      let formData = {
        ...this.state.formData,
        expireDate: moment().add(2, "days"),
        alarmDays: 1,
      };

      this.setState({ formData });
    }
  };

  render() {
    const todoLevel = [this.state.formData.todoLevel];

    const props = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };


    const operations = (
      <Rate
        count={5}
        value={this.state.formData.todoLevel}
        tooltips={["不重要", "不紧急", "正常", "重要", "紧急"]}
        onChange={(ct) => {
          this.createInputMode(ct, "todoLevel");
        }}
      />
    )


    return (
      <div>
        {/* {JSON.stringify(this.state.formData)} */}
        {/* <Editor></Editor> */}
        <Row gutter={24}>
          <Col span={19}>
            <Row gutter={24}>
              <Col span="24">
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
              </Col>

              <Col span="24">


                <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
                  <TabPane tab="Content" key="1">
                    {/* <Mde
              change={this.mdChange}
              content={this.state.formData.content}
            ></Mde> */}
                    <MdEditor
                      change={this.mdChange}
                      content={this.state.formData.content}
                    ></MdEditor>
                  </TabPane>
                  <TabPane tab="Attachment" key="2">
                    <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
    </p>
                    </Dragger>
                  </TabPane>

                </Tabs>



              </Col>





              <Col span="24" style={{ display: "none" }}>
                <dl className="form_col">
                  <dt>PK</dt>
                  <dd>
                    <Input
                      size={this.state.inputSize}
                      value={this.state.formData.noteId}
                      onChange={(e) => {
                        this.createInputMode(e.target.value, "noteId");
                      }}
                    />
                  </dd>
                </dl>
              </Col>
            </Row>
          </Col>
          <Col span={5}>
            <Row gutter={24}>
              <Col span={24} style={{ marginBottom: 8 }}>
                <dl className="form_col">
                  <dd>
                    <div
                      style={{
                        background: "#fffbe6",
                        borderRadius: 5,
                        padding: 8,
                      }}
                    >
                      {/* <Radio.Group
                      value={this.state.formData.classify}
                      buttonStyle="solid"
                      onChange={this.setClassify}
                    >
                      <Radio.Button value="Todo">Todo</Radio.Button>
                      <Radio.Button value="Note">Note</Radio.Button>
                      <Radio.Button value="Knowledge">Knowledge</Radio.Button>
                    </Radio.Group> */}

                      <CheckableTag
                        key="Todo"
                        onChange={this.selectTag("Todo")}
                        checked={this.state.formData.classify === "Todo"}
                        icon={
                          <FontAwesomeIcon
                            icon="th-list"
                            style={{
                              fontSize: 14,
                              paddingTop: 2,
                              marginRight: 8,
                              color: "#ffffff",
                            }}
                          />
                        }
                      >
                        Todo
                    </CheckableTag>

                      <CheckableTag
                        key="Note"
                        onChange={this.selectTag("Note")}
                        checked={this.state.formData.classify === "Note"}
                        icon={
                          <FontAwesomeIcon
                            icon="clipboard-list"
                            style={{
                              fontSize: 14,
                              paddingTop: 2,
                              marginRight: 8,
                              color: "#ffffff",
                            }}
                          />
                        }
                      >
                        Note
                    </CheckableTag>

                      <CheckableTag
                        key="Knowledge"
                        onChange={this.selectTag("Knowledge")}
                        checked={this.state.formData.classify === "Knowledge"}
                        icon={
                          <FontAwesomeIcon
                            icon="book"
                            style={{
                              fontSize: 14,
                              paddingTop: 2,
                              marginRight: 8,
                              color: "#ffffff",
                            }}
                          />
                        }
                      >
                        Knowledge
                    </CheckableTag>
                    </div>
                  </dd>
                </dl>
              </Col>
              {/* <Col span={24} style={{ marginBottom: 8 }}>
                
              </Col> */}
              <Col span={24} style={{ marginBottom: 8 }}>
                {this.state.formData.classify === "Todo" ? (
                  <div>
                    <Divider></Divider>
                    <Row gutter={24}>

                      <Col span={24} style={{ marginBottom: 8 }}>
                        <dl className="form_col">
                          <dt>Expire Date</dt>
                          <dd style={{ display: 'flex', alignItems: "center" }}>
                            <LeftOutlined
                              style={{ flex: "0 0 20", cursor: "pointer" }}
                              onClick={this.subExpireDate}
                            />
                            <DatePicker
                              style={{ flex: "1 1 auto", marginLeft: 8, marginRight: 8 }}
                              size={this.state.inputSize}
                              onChange={(moment, dataStr) => {
                                this.createDateMode(dataStr, "expireDate");
                              }}
                              value={
                                this.state.formData.expireDate
                                  ? moment(
                                    this.state.formData.expireDate,
                                    "YYYY-MM-DD"
                                  )
                                  : null
                              }
                            />
                            <RightOutlined
                              style={{ flex: "0 0 20", cursor: "pointer" }}
                              onClick={this.addExpireDate}
                            />
                          </dd>
                        </dl>
                      </Col>
                      <Col span={24} style={{ marginBottom: 8 }}>
                        <dl className="form_col">
                          <dt>Alarm Days</dt>
                          <dd>
                            <InputNumber
                              style={{ width: "100%" }}
                              size={this.state.inputSize}
                              value={this.state.formData.alarmDays}
                              onChange={(v) => {
                                this.createInputMode(v, "alarmDays");
                              }}
                            />
                          </dd>
                        </dl>
                      </Col>
                      <Col span={24} style={{ marginBottom: 8 }}>
                        <dl className="form_col">
                          <dt>
                            Start Time{" "}
                            <ClockCircleOutlined
                              onClick={this.setStartTimeCurrent}
                              style={{ color: "#2db7f5", cursor: "pointer" }}
                            />
                          </dt>
                          <dd>
                            <DatePicker
                              style={{ width: "50%" }}
                              size={this.state.inputSize}
                              onChange={(moment, dataStr) => {
                                this.createDateMode(dataStr, "startDateTemp");
                              }}
                              value={
                                this.state.formData.startDateTemp
                                  ? moment(
                                    this.state.formData.startDateTemp,
                                    "YYYY-MM-DD"
                                  )
                                  : null
                              }
                            />
                            <TimePicker
                              style={{ width: "50%" }}
                              size={this.state.inputSize}
                              format={"HH:mm"}
                              onChange={(moment, dataStr) => {
                                this.createDateMode(dataStr, "startTimeTemp");
                              }}
                              value={
                                this.state.formData.startTimeTemp
                                  ? moment(
                                    this.state.formData.startTimeTemp,
                                    "HH:mm"
                                  )
                                  : null
                              }
                            />
                          </dd>
                        </dl>
                      </Col>
                      <Col span={24} style={{ marginBottom: 8 }}>
                        <dl className="form_col">
                          <dt>
                            Finish Time{" "}
                            <ClockCircleOutlined
                              onClick={this.setFinishTimeCurrent}
                              style={{ color: "#2db7f5", cursor: "pointer" }}
                            />
                          </dt>
                          <dd>
                            <DatePicker
                              style={{ width: "50%" }}
                              size={this.state.inputSize}
                              onChange={(moment, dataStr) => {
                                this.createDateMode(dataStr, "finishDateTemp");
                              }}
                              value={
                                this.state.formData.finishDateTemp
                                  ? moment(
                                    this.state.formData.finishDateTemp,
                                    "YYYY-MM-DD"
                                  )
                                  : null
                              }
                            />
                            <TimePicker
                              style={{ width: "50%" }}
                              format={"HH:mm"}
                              size={this.state.inputSize}
                              onChange={(moment, dataStr) => {
                                this.createDateMode(dataStr, "finishTimeTemp");
                              }}
                              value={
                                this.state.formData.finishTimeTemp
                                  ? moment(
                                    this.state.formData.finishTimeTemp,
                                    "HH:mm"
                                  )
                                  : null
                              }
                            />
                          </dd>
                        </dl>
                      </Col>
                      <Col span={24} style={{ marginBottom: 8 }}>
                        <dl className="form_row">
                          <dt>Status</dt>
                          <dd>
                            <Switch
                              checked={this.state.formData.todoStatus}
                              onChange={this.toggleFinish}
                              checkedChildren="已完成"
                              unCheckedChildren="未完成"
                            />
                          </dd>
                        </dl>
                      </Col>
                    </Row>
                  </div>
                ) : null}
              </Col>
              <Col span={24} style={{ marginBottom: 8 }}>

                <div>

                  <Button
                    block
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={this.saveNote}
                  >
                    Save
            </Button>

                  {/* <Button icon={<RollbackOutlined />} onClick={this.props.closeFn}>
                      Cancel
            </Button> */}

                </div>

              </Col>

            </Row>


          </Col>
        </Row>


      </div>
    );
  }
}

export default NoteForm;
