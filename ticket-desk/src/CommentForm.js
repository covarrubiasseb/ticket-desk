import React from 'react';
import axios from 'axios';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    axios.put('/api/ticket/comments', {
      userID: this.props.userID,
      projectID: this.props.projectID,
      content: this.state.comment 
    })
    .then(response => {
      console.log(response);
      this.clearForm();
    });
  }

  handleCommentChange(event) {
    this.setState({
      comment: event.target.value
    });
  }

  clearForm() {
    this.setState({
      comment: ''
    });
  }

  render() {

    return (

      <form onSubmit={this.handleSubmit}
        className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 container-fluid">

        <div className="row mb-2">    
          <textarea className="form-control bg-light border-1 col-12" placeholder="Type your comment here..."
              aria-describedby="basic-addon2" onChange={this.handleCommentChange} value={this.state.comment} />
        </div>

        <button href="#" className="btn btn-secondary btn-icon-split float-right mb-2" type="submit" data-toggle="modal" data-target="#commentModal">
          <span className="icon text-white-50">
              <i className="fas fa-arrow-right"></i>
          </span>
          <span className="text">Send Comment</span>
        </button>

        <div className="modal fade" id="commentModal" tabIndex="-1" role="dialog" aria-labelledby="commentModalLabel"
              aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="commentModalLabel"></h5>
                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </form>

    );

  }

}

export default CommentForm;