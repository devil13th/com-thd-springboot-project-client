import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import PropTypes from 'prop-types';
import 'easymde/dist/easymde.min.css';
import 'font-awesome/css/font-awesome.css';
class MdEditor extends React.Component {
  state = {
    markdown: `aaaaa`,
    id: `editor_${Math.random()}`,
  };

  static propTypes = {
    content: PropTypes.string,
    change: PropTypes.func,
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
        <SimpleMDE
          style={{ zIndex: 11 }}
          selectedTab="preview"
          id={this.state.id}
          value={this.props.content}
          options={{
            spellChecker: false,
            toolbar: [
              'bold',
              'italic',
              'heading',
              '|',
              'quote',
              'code',
              'table',
              'horizontal-rule',
              'unordered-list',
              'ordered-list',
              '|',
              'link',
              'image',
              '|',
              'preview',
              'side-by-side',
              'fullscreen',
              '|',
              'guide',
            ],
          }}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default MdEditor;
