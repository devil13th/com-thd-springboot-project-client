import React from 'react'
import { Calendar,Spin, Badge,Tooltip,Rate,DatePicker } from 'antd';
import NoteApi from "@/api/NoteApi";
import {message} from 'antd';

import PropTypes from "prop-types";
import _ from 'lodash'
import moment  from 'moment'
import {BookOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  ExclamationOutlined,
  CalendarOutlined
}  from "@ant-design/icons";
class NoteCalendar extends React.Component {
  state = {
    spinning:false,
    data:[],
    value: moment(),
    selectedValue: moment(),
    selectedValue: moment(),
  }

  static propTypes = {
    queryCondition:PropTypes.object,
    cb:PropTypes.func
  }
  static defaultProps = {
    queryCondition:{},
    cb:() => {}
  }

  

  componentDidMount = () => {
   this.queryData();

  }

  headerRender = ({value,onChange}) => {
    onChange(value)
    return <DatePicker onChange={this.onMonthChange} picker="month" />
  }
  onMonthChange=(mmt)=>{
    this.setState({
      value:mmt,
      selectedValue:mmt
    })
  }

  queryData = (date,thisQueryCondition) => {
    this.setState({
      spinning:true
    })
    let condition = thisQueryCondition ? thisQueryCondition : _.cloneDeep(this.props.queryCondition)
    
    let current = moment();
    if(date){
      current = moment(date.format('YYYY-MM-DD'),'YYYY-MM-DD');
    }

    condition.expireDateFrom = current.format("YYYY-MM") + "-01 00:00:00"

    let nextMonth = current.add(1,"months")
    condition.expireDateTo = nextMonth.format("YYYY-MM") + "-01 00:00:00"

 
    NoteApi.queryNoteLikeByPage(condition)
      .then((r) => {
        this.setState({
          data:  r.result.list,
          spinning:false
        });
      })
      .catch((r) => {
        message.error("error! " + r);
        this.setState({
          spinning: false,
        });
      });
  }


 
  onSelect = value => {
    this.setState({
      value,
      selectedValue: value,
    });
  }
  onPanelChange = (value,mode) => {
    console.log(value.format('YYYY-MM-DD'));
    console.log(mode)
    this.setState({ value });
    this.queryData(value)
  }


  // 获取每天格子中的的数据
  getListData = (value) => {
    //console.log(value)
    const dateStr = value.format("YYYY-MM-DD")
    
    //console.log("---",dateStr)
    let listData = this.state.data.filter( item => {
        //console.log(dateStr,item.expireDate,dateStr === item.expireDate)
        return (dateStr === item.expireDate)
    })
    return listData || [];
  }

  // 每天格子中的的数据列表渲染
  dateCellRender = (value) => {
    // console.log("calendar dateCellRender ...")
    const listData = this.getListData(value);
    
    return (
      <ul className="events" style={{listStyleType:'none',paddingLeft:4}}>
        {listData.map(item => (
          <li key={item.title} onClick={()=>{this.props.cb(item.noteId)}}>
            <Badge color={this.computColor(item)} text={this.computContent(item)} />
          </li>
        ))}
      </ul>
    );
  }


  // 计算颜色
  computColor = (item) => {
    const colorArray = [
      '#999',
      'lime',
      'blue',
      'orange',
      'volcano']
      return colorArray[item.todoLevel-1]  
  }


  computContent = (item) => {
   
    let icon = <BookOutlined style={{fontSize:12,marginRight:4}}/>
    if(item.classify === 'Todo'){
      icon = <CalendarOutlined style={{fontSize:12,marginRight:4}}/>
    }

    let fix = <CheckOutlined style={{fontSize:12,marginLeft:4,color:"green"}}/>
    if(item.todoStatus === 0){
      fix = <ExclamationOutlined style={{fontSize:12,marginLeft:4,color:"red"}}/>
    }


    let msg = (
      <span>[{item.classify}]  {item.todoStatus===1?'已完成':'未完成'} 
        <br/>
        <Rate style={{fontSize:12}} disabled={true} defaultValue={item.todoLevel} />
      </span>
    )
    return (
      <span>

      <Tooltip title={msg} color="#108ee9" key={item.noteId}>
        {icon}
        {item.title}
        {fix}
      </Tooltip>
      </span>
    )

  }

  render() {
    // console.log("calendar render ...")
    const _this = this;
 
      
    function getMonthData(value) {
      if (value.month() === 8) {
        return 1394; 
      }
    }
    
    function monthCellRender(value) {
      const num = getMonthData(value);
      return num ? (
        <div className="notes-month">
          <section>{num}</section>
          <span>Backlog number</span>
        </div>
      ) : null;
    }
    return (
      <div>
        <Spin tip="Loading..." spinning={this.state.spinning}>
        {this.state.value.format("YYYY-MM-DD")}
          <Calendar  
            dateCellRender={this.dateCellRender} 
            monthCellRender={monthCellRender} 
            value={this.state.value}
            mode="month"
            onPanelChange={this.onPanelChange}
            onSelect={this.onSelect}
          />
          </Spin>
      </div>
    )
  }
}

export default NoteCalendar