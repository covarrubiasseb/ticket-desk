import React from 'react';
import $ from 'jquery';
import axios from 'axios';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: this.props.comment.content,
      submit_date: this.props.comment.submit_date,
      edit_content: this.props.comment.content
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
                commentID: this.props.comment.commentID,
                content: this.state.edit_content
              }
    )
    .then(response => {
      $("#closeCommentEditModal").trigger("click");
    });
  }

  render() {

    return (

      <div className="card mb-2">

        <div className="card-header">

          <div className="row">

            <div className="col">
              <span className="font-weight-bold text-dark">UserID:</span> {this.props.comment.userID}
            </div>

            <div className="col">

              {/* Display Conditionallly on page load if User submitted Comment or is an Admin */}
              <div className="dropdown no-arrow float-right">
                <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuCommentEdit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuCommentEdit">
                  <a className="dropdown-item" href="#" data-toggle="modal" data-target="#commentEditModal">Edit</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#" data-toggle="modal" data-target="#commentDeleteModal"><span className="text-danger">Delete</span></a>
                </div>
              </div>

              <div className="modal fade" id="commentEditModal" tabIndex="-1" role="dialog" aria-labelledby="commentEditModalLabel"
                  aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="commentEditModalLabel">(Edit Comment Form)</h5>
                      <button className="close" id="closeCommentEditModal" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
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

              <div className="modal fade" id="commentDeleteModal" tabIndex="-1" role="dialog" aria-labelledby="commentDeleteModalLabel"
                  aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="commentDeleteModalLabel">(Delete Prompt Here)</h5>
                      <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className="card-body">

          <div>{this.state.content}</div>

          <div className="float-right">
            <span className=" font-weight-bold text-dark">Date Posted:</span> {this.state.submit_date}
          </div>

        </div>

      </div>

    );

  } 
}

export default Comment;