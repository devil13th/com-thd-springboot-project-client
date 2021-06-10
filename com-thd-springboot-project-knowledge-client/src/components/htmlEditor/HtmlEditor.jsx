import React from 'react'


class HtmlEditor extends React.Component {
  
      editor={}
 

  editorRef = React.createRef()

  componentDidMount(){
      
    this.editor = window.tinymce.init({
        selector: "#" + this.editorRef.current.id,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor image',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
        toolbar: 'undo redo | formatselect | image |' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help'
      });
  }
  log = () => {
    if (this.editorRef.current) {
        console.log(this.editor.getContent());
    }
  }
  render() {
 
    return (
      <div>
          <textarea id="mytextarea" ref={this.editorRef}></textarea>
       
       <button onClick={this.log}>Log editor content</button>
      </div>
    )
  }
}

export default HtmlEditor