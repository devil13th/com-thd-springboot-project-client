import React from "react";
import PropTypes from "prop-types";
import MyPlanApi from "@/api/MyPlanApi";
import { Row, Col } from "antd";
import DateUtils from '@/tools/DateUtils'

class MyPlanView extends React.Component {
  state = {
    data: {},

    colSpan:{
        xs:24,
        sm:12,
        md:8,
        lg:6,
        xl:4,
        xxl:3
    }

  };

  static propTypes = {
    cgExampleId: PropTypes.string,
    canEdit: PropTypes.bool

  };

  //指定默认标签属性值
  static defaultProps = {
    myPlanId: ""//sex默认值为男
  };
  componentDidMount() {
    if (this.props.myPlanId) {

      MyPlanApi.queryMyPlanById(this.props.myPlanId).then((r) => {
        const rst = r.result;
        if(rst.userBirthday){
            rst.userBirthday = DateUtils.formatToDate(rst.userBirthday)
        }
        this.setState({
          data: r.result,
        });
      });
    }
  }


  render() {
    return (
      <div>

        <Row gutter={24}>



            <Col {...this.state.colSpan}>
                <dl className="form_col">
                    <dt>PK</dt>
                    <dd>
                    {this.state.data.planId}
                    </dd>
                </dl>
              </Col>


                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>title</dt>
                                    <dd>
                                      {this.state.data.title}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>detail</dt>
                                    <dd>
                                      {this.state.data.detail}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>days</dt>
                                    <dd>
                                      {this.state.data.days}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>fromDate</dt>
                                    <dd>
                                      {DateUtils.formatToDate(this.state.data.fromDate)}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>toDate</dt>
                                    <dd>
                                      {DateUtils.formatToDate(this.state.data.toDate)}
                                    </dd>
                                </dl>
                              </Col>

        </Row>

      </div>
    );
  }
}

export default MyPlanView;
