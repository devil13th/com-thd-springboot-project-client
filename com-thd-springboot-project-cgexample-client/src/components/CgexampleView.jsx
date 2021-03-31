import React from "react";
import PropTypes from "prop-types";
import CgexampleApi from "@/api/CgexampleApi";
import { Row, Col } from "antd";
import DateUtils from '@/tools/DateUtils'

class CgexampleView extends React.Component {
  state = {
    cgExampleData: {},
    cgExampleFormStatus: "CREATE",
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
    cgExampleId: "", //sex默认值为男
    canEdit: true, //age默认值为18
  };
  componentDidMount() {
    if (this.props.cgExampleId) {
      this.setState({
        cgExampleFormStatus: "EDIT",
      });

      CgexampleApi.queryCgExampleById(this.props.cgExampleId).then((r) => {
        const rst = r.result;
        if(rst.userBirthday){
            rst.userBirthday = DateUtils.formatToDate(rst.userBirthday)
        }
        this.setState({
          cgExampleData: r.result,
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
                <dt>ID</dt>
                <dd>
                {this.state.cgExampleData.id}
                </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
          <dl className="form_col">
                <dt>userName</dt>
                <dd>
                  {this.state.cgExampleData.userName}
                </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
            <dl className="form_col">
                <dt>userAge</dt>
                <dd>
                  {this.state.cgExampleData.age}
                </dd>
            </dl>
          </Col>
          <Col {...this.state.colSpan}>
          <dl className="form_col">
                <dt>userBirthday</dt>
                <dd>
                    {this.state.cgExampleData.userBirthday}
                </dd>
            </dl>
          </Col>
        </Row>
        
      </div>
    );
  }
}

export default CgexampleView;
