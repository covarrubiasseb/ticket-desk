import React from 'react';
import $ from 'jquery';
import axios from 'axios';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      edit_content: this.props.comment.content
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange(event) {
    this.setState({
      edit_content: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    axios.post(`/api/ticket/comments?userID=${this.props.userID}`,
              {
                comment: this.props.comment,
                content: this.state.edit_content
              },
              {
                headers: this.props.headersConfig.headers
              }
    )
    .then(response => {
      if (response.data.valid) {
        this.props.editComment();
      }
    });

    $(`#closeCommentEditModal${this.props.commentIndex}`).trigger("click");
  }

  handleDelete() {
    $(`#closeDeleteEditModal${this.props.commentIndex}`).trigger("click");

    this.props.deleteComment(this.props.comment.commentID);
  } 

  componentDidMount() {
    axios.get(`/api/ticket/comment/user?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {

      let user = response.data[0];

      this.setState({
        firstName: user.firstName,
        lastName: user.lastName
      });

    });
  }

  render() {

    return (

      <div className="card mb-2">

        <div className="card-header">

          <div className="row">

            <div className="col">
              <span className="font-weight-bold text-dark">{`${this.state.firstName} ${this.state.lastName}`}</span> 
              <span className="float-right"><span className="font-weight-bold">Comment ID: </span>{this.props.comment.commentID}</span>
            </div>

            <div className="col">

              {/* Display Conditionallly on page load if User submitted Comment or is an Admin */}
              <div className="dropdown no-arrow float-right">
                <a className="dropdown-toggle" href="#" role="button" id={`dropdownMenuCommentEdit${this.props.commentIndex}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby={`dropdownMenuCommentEdit${this.props.commentIndex}`}>
                  <a className="dropdown-item" href="#" data-toggle="modal" data-target={`#commentEditModal${this.props.commentIndex}`}>Edit</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" data-toggle="modal" data-target={`#commentDeleteModal${this.props.commentIndex}`}><span className="text-danger">Delete</span></a>
                </div>
              </div>

              <div className="modal fade" id={`commentEditModal${this.props.commentIndex}`} tabIndex="-1" role="dialog" aria-labelledby={`commentEditModalLabel${this.props.commentIndex}`}
                  aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id={`commentEditModalLabel${this.props.commentIndex}`}>Edit Comment</h5>
                      <button className="close" id={`closeCommentEditModal${this.props.commentIndex}`} type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">??</span>
                      </button>
                    </div>

                    <div className="modal-body">
                      {/*Edit Comment Form Body*/}
                      <form onSubmit={this.handleSubmit}>
                        <div className="row mb-2">
                          <textarea className="form-control bg-light col-12" value={this.state.edit_content} onChange={this.handleChange}/>
                        </div>

                        <button href="#" className="btn btn-secondary btn-icon-split float-right" type="submit">
                          <span className="icon text-white-50">
                              <i className="fas fa-arrow-right"></i>
                          </span>
                          <span className="text">Edit Comment</span>
                        </button>
                      </form>

                    </div>

                  </div>
                </div>
              </div>

              <div className="modal fade" id={`commentDeleteModal${this.props.commentIndex}`} tabIndex="-1" role="dialog" aria-labelledby={`commentDeleteModalLabel${this.props.commentIndex}`}
                  aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">

                    <div className="modal-header">
                      <h5 className="modal-title" id={`commentDeleteModalLabel${this.props.commentIndex}`}>Delete Comment</h5>
                      <button className="close" id={`closeDeleteEditModal${this.props.commentIndex}`} type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">??</span>
                      </button>
                    </div>

                    <div className="modal-body">
                      Select "Delete" if you want to delete this comment.
                    </div>

                    <div className="modal-footer">
                      <a className="btn btn-danger float-right" onClick={this.handleDelete}>Delete</a>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className="card-body">

          <div>{this.props.comment.content}</div>

          <div className="float-right">
            <span className=" font-weight-bold text-dark">Date Posted:</span> {this.props.comment.submit_date.slice(0,10)}
          </div>

        </div>

      </div>

    );

  } 
}

export default Comment;