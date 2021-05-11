import React from "react";
import MdEditor from './MdEditor.jsx'
class Doc extends React.Component {
  state = {
    formData: {
      content: "",
    },
  };
  mdChange = (content) => {
    this.setState({
      formData: { ...this.state.formData, content },
    });
  };
  render() {
    return (
      <div>
        <MdEditor
          change={this.mdChange}
          content={this.state.formData.content}
        ></MdEditor>
      </div>
    );
  }
}

export default Doc;
