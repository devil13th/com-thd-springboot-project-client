import React from "react";
import PropTypes from "prop-types";
import NoteApi from "@/api/NoteApi";
import { Row, Col } from "antd";
import DateUtils from '@/tools/DateUtils'

class NoteView extends React.Component {
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
    noteId: ""//sex默认值为男
  };
  componentDidMount() {
    if (this.props.noteId) {

      NoteApi.queryNoteById(this.props.noteId).then((r) => {
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
                    {this.state.data.noteId}
                    </dd>
                </dl>
              </Col>


                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>classify</dt>
                                    <dd>
                                      {this.state.data.classify}
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
                                    <dt>content</dt>
                                    <dd>
                                      {this.state.data.content}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>expireDate</dt>
                                    <dd>
                                      {DateUtils.formatToDate(this.state.data.expireDate)}
                                    </dd>
                                </dl>
                              </Col>
                            <Col {...this.state.colSpan}>
                              <dl className="form_col">
                                    <dt>alarmDays</dt>
                                    <dd>
                                      {this.state.data.alarmDays}
                                    </dd>
                                </dl>
                              </Col>

        </Row>

      </div>
    );
  }
}

export default NoteView;
