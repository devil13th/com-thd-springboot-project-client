import React from "react";
import PropTypes from "prop-types";
import MyPlanApi from "@/api/MyPlanApi";
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
class MyPlanForm extends React.Component {
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
    myPlanId: PropTypes.string,
    canEdit: PropTypes.bool,
    closeFn: PropTypes.func,
    cb: PropTypes.func,
  };

  //指定默认标签属性值
  static defaultProps = {
    myPlanId: "", //sex默认值为男
    canEdit: true, //age默认值为18
    closeFn: () => {},
  };
  componentDidMount() {
    if (this.props.myPlanId) {
      this.setState({
        formStatus: "EDIT",
      });

      MyPlanApi.queryMyPlanById(this.props.myPlanId).then((r) => {
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

  saveMyPlan = () => {
    if (this.state.formStatus === "CREATE") {
      MyPlanApi.addMyPlan(this.state.formData)
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
      MyPlanApi.updateMyPlan(this.state.formData)
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
                  value={this.state.formData.planId}
                  onChange={(e) => {
                    this.createInputMode(e, "planId");
                  }}
                />
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
                    <dt>detail</dt>
                    <dd>
                      <Input
                        size={this.state.inputSize}
                        value={this.state.formData.detail}
                        onChange={(e) => {
                          this.createInputMode(e, "detail");
                        }}
                      />
                    </dd>
                  </dl>
                </Col>


                <Col {...this.state.colSpan}>
                    <dl className="form_col">
                      <dt>days</dt>
                      <dd>
                        <Input
                          size={this.state.inputSize}
                          value={this.state.formData.days}
                          onChange={(e) => {
                            this.createInputMode(e, "days");
                          }}
                        />
                      </dd>
                    </dl>
                  </Col>


                <Col {...this.state.colSpan}>
                    <dl className="form_col">
                      <dt>fromDate</dt>
                      <dd>
                        <DatePicker
                          size={this.state.inputSize}
                          onChange={(moment, dataStr) => {
                            this.createDateMode(dataStr, "fromDate");
                          }}
                          value={
                            this.state.formData.fromDate
                              ? moment(
                                  this.state.formData.fromDate,
                                  "YYYY-MM-DD"
                                )
                              : null
                          }
                        />
                      </dd>
                    </dl>
                  </Col>


                <Col {...this.state.colSpan}>
                    <dl className="form_col">
                      <dt>toDate</dt>
                      <dd>
                        <DatePicker
                          size={this.state.inputSize}
                          onChange={(moment, dataStr) => {
                            this.createDateMode(dataStr, "toDate");
                          }}
                          value={
                            this.state.formData.toDate
                              ? moment(
                                  this.state.formData.toDate,
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
              onClick={this.saveMyPlan}
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

export default MyPlanForm;
