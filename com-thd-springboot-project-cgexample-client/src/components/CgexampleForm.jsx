import React from "react";
import PropTypes from "prop-types";
import CgexampleApi from "@/api/CgexampleApi";
import {
  message,
  Input,
  Row,
  Col,
  DatePicker,
  Space,
  Button,
  Divider,
} from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import DateUtils from "@/tools/DateUtils";
import moment from "moment";
class CgexampleForm extends React.Component {
  state = {
    cgExampleData: {},
    inputSize:'normal',
    cgExampleFormStatus: "CREATE",
    // colSpan: {
    //   xs: 24,
    //   sm: 12,
    //   md: 8,
    //   lg: 6,
    //   xl: 4,
    //   xxl: 3,
    // },
    colSpan:{
      xs:24,
      sm:24,
      md:24,
      lg:24,
      xl:24,
      xxl:24
    }
  };

  static propTypes = {
    cgExampleId: PropTypes.string,
    canEdit: PropTypes.bool,
    closeFn: PropTypes.func,
    cb: PropTypes.func,
  };

  //指定默认标签属性值
  static defaultProps = {
    cgExampleId: "", //sex默认值为男
    canEdit: true, //age默认值为18
    closeFn: () => {},
  };
  componentDidMount() {
    if (this.props.cgExampleId) {
      this.setState({
        cgExampleFormStatus: "EDIT",
      });

      CgexampleApi.queryCgExampleById(this.props.cgExampleId).then((r) => {
        const rst = r.result;
        if (rst.userBirthday) {
          rst.userBirthday = DateUtils.formatToDate(rst.userBirthday);
        }
        this.setState({
          cgExampleData: r.result,
        });
      });
    }
  }

  createInputMode = (e, propName) => {
    this.setState({
      cgExampleData: {
        ...this.state.cgExampleData,
        [propName]: e.target.value,
      },
    });
  };

  createDateMode = (v, propName) => {
    this.setState({
      cgExampleData: {
        ...this.state.cgExampleData,
        [propName]: v,
      },
    });
  };

  createInput = (propName) => {
    return (
      <Input
        size={this.state.inputSize}
        value={this.state.cgExampleData[propName]}
        onChange={(e) => {
          this.createInputMode(e, propName);
        }}
      />
    );
  };

  saveCgExample = () => {
    if (this.state.cgExampleFormStatus === "CREATE") {
      CgexampleApi.addCgExample(this.state.cgExampleData)
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
      CgexampleApi.updateCgExample(this.state.cgExampleData)
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
        {JSON.stringify(this.state.cgExampleData)}

        <Row gutter={24}>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>ID</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.cgExampleData.id}
                  onChange={(e) => {
                    this.createInputMode(e, "id");
                  }}
                />
              </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>userName</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.cgExampleData.userName}
                  onChange={(e) => {
                    this.createInputMode(e, "userName");
                  }}
                />
              </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>userAge</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.cgExampleData.userAge}
                  onChange={(e) => {
                    this.createInputMode(e, "userAge");
                  }}
                />
              </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>userBirthday</dt>
              <dd>
                <DatePicker
                  size={this.state.inputSize}
                  onChange={(moment, dataStr) => {
                    this.createDateMode(dataStr, "userBirthday");
                  }}
                  value={
                    this.state.cgExampleData.userBirthday
                      ? moment(
                          this.state.cgExampleData.userBirthday,
                          "YYYY-MM-DD"
                        )
                      : null
                  }
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
              onClick={this.saveCgExample}
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

export default CgexampleForm;
