import React from "react";
import PropTypes from "prop-types";
import CgTestApi from "@/api/CgTestApi";
import { Row, Col } from "antd";
import DateUtils from '@/tools/DateUtils'

class CgTestView extends React.Component {
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
    cgTestId: ""//sex默认值为男
  };
  componentDidMount() {
    if (this.props.cgTestId) {

      CgTestApi.queryCgTestById(this.props.cgTestId).then((r) => {
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
                    {this.state.data.userId}
                    </dd>
                </dl>
              </Col>


                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>userName</dt>
                                    <dd>
                                      {this.state.data.userName}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>userAge</dt>
                                    <dd>
                                      {this.state.data.userAge}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>userBirthday</dt>
                                    <dd>
                                      {DateUtils.formatToDate(this.state.data.userBirthday)}
                                    </dd>
                                </dl>
                              </Col>

        </Row>

      </div>
    );
  }
}

export default CgTestView;
