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
  Space,
  Button,
  Radio,
  InputNumber,
  Tag,
  Divider,
} from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import DateUtils from "@/tools/DateUtils";
import moment from "moment";

const { CheckableTag } = Tag;

class NoteForm extends React.Component {
  state = {
    formData: { content: "" },
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
        if (rst.userBirthday) {
          rst.userBirthday = DateUtils.formatToDate(rst.userBirthday);
        }
        this.setState({
          formData: r.result,
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
    if (this.state.formStatus === "CREATE") {
      NoteApi.addNote(this.state.formData)
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
      NoteApi.updateNote(this.state.formData)
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

  render() {
    return (
      <div>
        {/* {JSON.stringify(this.state.formData)} */}
        {/* <Editor></Editor> */}

        <Row gutter={24}>
          <Col {...this.state.colSpan}>
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
              <dl className="form_col">
                <dt>Expire Date</dt>
                <dd>
                  <DatePicker
                    size={this.state.inputSize}
                    onChange={(moment, dataStr) => {
                      this.createDateMode(dataStr, "expireDate");
                    }}
                    value={
                      this.state.formData.expireDate
                        ? moment(this.state.formData.expireDate, "YYYY-MM-DD")
                        : null
                    }
                  />
                </dd>
              </dl>
            </Col>
          ) : null}

          {this.state.formData.classify === "Todo" ? (
            <Col {...this.state.colSpan}>
              <dl className="form_col">
                <dt>Alarm Days</dt>
                <dd>
                  <InputNumber
                    size={this.state.inputSize}
                    value={this.state.formData.alarmDays}
                    onChange={(v) => {
                      this.createInputMode(v, "alarmDays");
                    }}
                  />
                </dd>
              </dl>
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
