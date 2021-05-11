import React from "react";
import PropTypes from "prop-types";
import NoteApi from "@/api/NoteApi";
import {
  message,
  Input,
  Row,
  Col,
  DatePicker,
  Space,
  Button,
  Tag,
  Divider,
} from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import DateUtils from "@/tools/DateUtils";
import moment from "moment";
class NoteForm extends React.Component {
  state = {
    formData: {},
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

  createInputMode = (e, propName) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [propName]: e.target.value,
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
          this.createInputMode(e, propName);
        }}
      />
    );
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
  render() {
    return (
      <div>
        {/* {JSON.stringify(this.state.formData)} */}

        <Row gutter={24}>
          <Col {...this.state.colSpan} style={{display:'none'}}>
            <dl className="form_col">
              <dt>PK</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.formData.noteId}
                  onChange={(e) => {
                    this.createInputMode(e, "noteId");
                  }}
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>classify</dt>
              <dd>
                <Tag color="#55acee">
                  Todo
                </Tag>
                <Tag color="#cd201f">
                  Note
                </Tag>
                <Tag color="#3b5999">
                  Knowledge
                </Tag>
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>title</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.formData.title}
                  onChange={(e) => {
                    this.createInputMode(e, "title");
                  }}
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>content</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.formData.content}
                  onChange={(e) => {
                    this.createInputMode(e, "content");
                  }}
                />
              </dd>
            </dl>
          </Col>

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>expireDate</dt>
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

          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>alarmDays</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.formData.alarmDays}
                  onChange={(e) => {
                    this.createInputMode(e, "alarmDays");
                  }}
                />
              </dd>
            </dl>
          </Col>
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
