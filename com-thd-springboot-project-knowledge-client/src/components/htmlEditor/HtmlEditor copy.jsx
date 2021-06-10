import React from 'react'
import { Editor } from '@tinymce/tinymce-react';

class HtmlEditor extends React.Component {
    

  editorRef = React.createRef()

  componentDidMount(){
    if (this.editorRef.current) {
        console.log(this.editorRef.current.getContent());
      }
  }
  log = () => {
    if (this.editorRef.current) {
        console.log(this.editorRef.current.getContent());
    }
  }
  render() {
      alert(window.tinymce)
    return (
      <div>
        <Editor
         onInit={(evt, editor) => this.editorRef.current = editor}
         initialValue="<p>This is the initial content of the editor.</p>"
         init={{
           height: 500,
           menubar: false,
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'
           ],
           toolbar: 'undo redo | formatselect | ' +
           'bold italic backcolor | alignleft aligncenter ' +
           'alignright alignjustify | bullist numlist outdent indent | ' +
           'removeformat | help',
           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
         }}
       />
       <button onClick={this.log}>Log editor content</button>
      </div>
    )
  }
}

export default HtmlEditor