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
  Col,
  DatePicker,
  TimePicker,
  Space,
  Button,
  Radio,
  Tag,
  InputNumber,
  Divider,
  Rate
} from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import DateUtils from "@/tools/DateUtils";
import moment from "moment";

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
    colSpan: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
      xxl: 24,
    },
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
    closeFn: () => {},
  };
  componentDidMount() {
    if (this.props.noteId) {
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
        this.setState({
          formData: rst,
        });
      });
    }
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
        .catch((r) => {});
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
        .catch((r) => {});
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

  render() {
    const todoLevel = [this.state.formData.todoLevel];
    return (
      <div>
        {/* {JSON.stringify(this.state.formData)} */}
        {/* <Editor></Editor> */}

        <Row gutter={24}>
          <Col span={12}>
            <dl className="form_col">
              <dd>
                <div
                  style={{ background: "#fffbe6", borderRadius: 5, padding: 8 }}
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
          <Col span={12}>
          <Rate 
            count={5} 
            value={this.state.formData.todoLevel} tooltips={['不重要','不紧急','正常','重要','紧急']}
            onChange={(ct) => {
              this.createInputMode(ct, "todoLevel");
            }}
            />
            </Col>
          <Col {...this.state.colSpan}>
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

          {this.state.formData.classify === "Todo" ? (
            <Col {...this.state.colSpan}>
              <dl class="form_row">
                
              <dd>
                
               

                {/* {levelTags.map((tag) => (
                  <CheckableTag
                    key={tag.key}
                    checked={todoLevel.indexOf(tag.key) > -1}
                    onChange={(checked) => this.todoLevelChange(tag, checked)}
                  >
                    {tag.value}
                  </CheckableTag>
                ))} */}
                </dd>
              </dl>
            </Col>
          ) : null}

          <Col {...this.state.colSpan}>
            {/* <Mde
              change={this.mdChange}
              content={this.state.formData.content}
            ></Mde> */}
            <MdEditor
              change={this.mdChange}
              content={this.state.formData.content}
            ></MdEditor>
          </Col>
          <Col {...this.state.colSpan} style={{ display: "none" }}>
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

          {/* <Col {...this.state.colSpan}>
                <dl className="form_col">
                  <dt>content</dt>
                  <dd>
                    <Input
                  size={this.state.inputSize}
                  value={this.state.formData.content}
                  onChange={(e) => {
                    this.createInputMode(e.target.value, "content");
                  }}
                />
                  </dd>
                </dl>
              </Col> */}

          {this.state.formData.classify === "Todo" ? (
            <Col {...this.state.colSpan}>
              <Row gutter={24}>
                <Col span="6">
                  <dl className="form_col">
                    <dt>Expire Date</dt>
                    <dd>
                      <DatePicker
                        style={{ width: "100%" }}
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
                    </dd>
                  </dl>
                </Col>
                <Col span="6">
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
                <Col span="6">
                  <dl className="form_col">
                    <dt>Start Time</dt>
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
                            ? moment(this.state.formData.startTimeTemp, "HH:mm")
                            : null
                        }
                      />
                    </dd>
                  </dl>
                </Col>
                <Col span="6">
                  <dl className="form_col">
                    <dt>Finish Time</dt>
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
              </Row>
              <Row gutter={24}>
                <Col span="12">
                  <dl className="form_col">
                    <dt>Status</dt>
                    <dd>
                      <Radio.Group
                        value={this.state.formData.todoStatus}
                        onChange={(e) => {
                          this.createDateMode(e.target.value, "todoStatus");
                        }}
                      >
                        <Radio.Button value={0}>Unfinish</Radio.Button>
                        <Radio.Button value={1}>Finish</Radio.Button>
                      </Radio.Group>
                    </dd>
                  </dl>
                </Col>
              </Row>
            </Col>
          ) : null}
        </Row>

        <Divider></Divider>
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={this.saveNote}
            >
              Save
            </Button>

            <Button icon={<RollbackOutlined />} onClick={this.props.closeFn}>
              Cancel
            </Button>
          </Space>
        </div>
      </div>
    );
  }
}

export default NoteForm;
