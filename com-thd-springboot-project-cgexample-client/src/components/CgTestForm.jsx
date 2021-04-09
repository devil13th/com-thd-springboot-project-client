import React from "react";
import PropTypes from "prop-types";
import CgTestApi from "@/api/CgTestApi";
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
class CgTestForm extends React.Component {
  state = {
    formData: {},
    inputSize:'normal',
    formStatus: "CREATE",
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
    cgTestId: PropTypes.string,
    canEdit: PropTypes.bool,
    closeFn: PropTypes.func,
    cb: PropTypes.func,
  };

  //指定默认标签属性值
  static defaultProps = {
    cgTestId: "", //sex默认值为男
    canEdit: true, //age默认值为18
    closeFn: () => {},
  };
  componentDidMount() {
    if (this.props.cgTestId) {
      this.setState({
        formStatus: "EDIT",
      });

      CgTestApi.queryCgTestById(this.props.cgTestId).then((r) => {
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

  saveCgTest = () => {
    if (this.state.formStatus === "CREATE") {
      CgTestApi.addCgTest(this.state.formData)
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
      CgTestApi.updateCgTest(this.state.formData)
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
        {JSON.stringify(this.state.formData)}

        <Row gutter={24}>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
              <dt>PK</dt>
              <dd>
                <Input
                  size={this.state.inputSize}
                  value={this.state.formData.userId}
                  onChange={(e) => {
                    this.createInputMode(e, "userId");
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
                        value={this.state.formData.userName}
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
                          value={this.state.formData.userAge}
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
                            this.state.formData.userBirthday
                              ? moment(
                                  this.state.formData.userBirthday,
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
              onClick={this.saveCgTest}
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

export default CgTestForm;
