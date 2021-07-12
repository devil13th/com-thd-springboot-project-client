import React from 'react';
import ReactMde from 'react-mde';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import 'react-mde/lib/styles/css/react-mde-all.css';

class Mde extends React.Component {
  state = {
    markdown: `aaaaa`,
    id: `editor_${Math.random()}`,
    value: '',
    selectedTab: 'write',
  };

  static propTypes = {
    content: PropTypes.string,
    change: PropTypes.func,
  };

  setValue = (value) => {
    this.setState({
      value,
    });
  };

  setSelectedTab = (selectedTab) => {
    this.setState({
      selectedTab,
    });
  };

  handleChange = (value) => {
    this.setState({
      markdown: value,
    });
    this.props.change(value);
  };

  render() {
    return (
      <div>
        {this.state.selectedTab}
        <ReactMde
          value={this.props.content}
          onChange={this.handleChange}
          selectedTab={this.state.selectedTab}
          onTabChange={this.setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown source={markdown} />)
          }
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
        />
      </div>
    );
  }
}

export default Mde;
