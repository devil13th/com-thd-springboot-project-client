import React from 'react'
import {
    Input
} from 'antd'
const { Search } = Input;
class Knowledge extends React.Component {
  state = {
    keyWord:'',
    dataList:[]
  }
  onSearch = (keyWord) => {
    this.setState({keyWord});
    alert(keyWord)
  }
  render() {
    return (
      <div style={{height:'800px',display:'flex',flexDirection:'column'}}>
          <div style={{border:"1px solid red",flex:'0 0 40%',display:'flex',flexDirection:'column'}}>
              <div style={{flex:'1 1 auto'}}>

              </div>
              <div style={{flex:'0 0 80px'}}>
                <Search placeholder="input search text" onSearch={this.onSearch} enterButton />
              </div>
          </div>
          <div  style={{border:"1px solid green",flex:'1 1 auto'}}>
              111
          </div>
          
      </div>
    )
  }
}

export default Knowledge