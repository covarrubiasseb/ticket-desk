import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import CommentForm from './CommentForm';
import TicketEditForm from './TicketEditForm';

class Ticket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      project: '',
      dev: '',
      title: this.props.ticketData.title,
      status: this.props.ticketData.status,
      priority: this.props.ticketData.priority,
      type: this.props.ticketData.type,
      description: this.props.ticketData.description,
      submit_date: this.props.ticketData.submit_date
    }

    this.getComments = this.getComments.bind(this);
    this.getTicketUser = this.getTicketUser.bind(this);
    this.getTicketProject = this.getTicketProject.bind(this);
    this.reloadTicketData = this.reloadTicketData.bind(this);

  }

  getComments() {

    axios.get(`/api/ticket/comments?ticketID=${this.props.ticketID}`)
    .then(response => {

      this.setState({

        comments: response.data.map(comment => {

          return (

            <div className="card mb-2">

              <div className="card-header">

                <div className="row">

                  <div className="col">
                    <span className="font-weight-bold text-dark">UserID:</span> {comment.userID}
                  </div>

                  <div className="col">

                    <div className="dropdown no-arrow float-right">
                      <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuCommentEdit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuCommentEdit">
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#commentEditModal">Edit</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#commentDeleteModal" onClick={this.reloadTicketData}><span className="text-danger">Delete</span></a>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              <div className="card-body">

                <div>{comment.content}</div>

                <div className="float-right">
                  <span className=" font-weight-bold text-dark">Date Posted:</span> {comment.submit_date}
                </div>

              </div>

            </div>

          );

        })

      });

    });

  }

  getTicketProject() {
    axios.get(`/api/project?projectID=${this.props.ticketData.projectID}`)
    .then(response => {

      let project = response.data[0];

      this.setState({
        project: project.name
      });

    });

  }

  getTicketUser() {
    axios.get(`/api/ticket/dev?userID=${this.props.ticketData.userID}`)
    .then(response => {

      let user = response.data[0];

      this.setState({
        dev: user.name
      });

    });
  }

  reloadTicketData() {

    axios.get(`/api/ticket?ticketID=${this.props.ticketData.ticketID}`)
    .then(response => {

      let updatedTicket = response.data[0];

      this.setState({
        title: updatedTicket.title,
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        type: updatedTicket.type,
        description: updatedTicket.description
      });

    });

    $("#closeTicketEditModal").trigger("click");

  }

  componentDidMount() {
    this.getComments();

    this.getTicketProject();
    this.getTicketUser();
  }

  render() {
    
    return (

      <div className="container-fluid">

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">

                <div className="row">

                  <div className="col">

                    <h6 className="m-0 font-weight-bold text-primary">{this.state.title}</h6>

                  </div>

                  {/* Display Conditionallly on page load if User submitted Ticket or is an Admin */}
                  <div className="col">
                    
                    <div className="dropdown no-arrow float-right">
                      <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuTicketEdit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuTicketEdit">
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#ticketEditModal">Edit</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#ticketDeleteModal" onClick={this.reloadTicketData}><span className="text-danger">Delete</span></a>
                      </div>
                    </div>

                    <div className="modal fade" id="ticketEditModal" tabIndex="-1" role="dialog" aria-labelledby="ticketEditModalLabel"
                        aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="ticketEditModalLabel">Edit Ticket</h5>
                            <button className="close" id="closeTicketEditModal" type="button" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>

                          <div className="modal-body">
                            <TicketEditForm ticketData={this.props.ticketData} userID={this.props.userID} reloadTicketData={this.reloadTicketData}/>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="modal fade" id="ticketDeleteModal" tabIndex="-1" role="dialog" aria-labelledby="ticketDeleteModalLabel"
                        aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="ticketDeleteModalLabel">(Delete Prompt Here)</h5>
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

                <div className="row">

                  <div className="col-6">

                    <div className="card">

                      <div className="card-header">
                        <h6 className="m-0 font-weight-bold text-dark">Description</h6>
                      </div>

                      <div className="card-body">
                        {this.state.description}
                      </div>

                    </div>

                  </div>

                  <div className="col-6">

                    <div className="card mb-4">

                      <div className="card-header">
                        <h6 className="m-0 font-weight-bold text-dark">Info</h6>
                      </div>

                      <div className="card-body">

                        <table className="table table-hover">

                          <tbody>
                            <tr>
                              <td className="font-weight-bold text-dark">Status</td>
                              <td>{this.state.status}</td>
                            </tr>

                            <tr>
                              <td className="font-weight-bold text-dark">Priority</td>
                              <td>{this.state.priority}</td>
                            </tr>

                            <tr>
                              <td className="font-weight-bold text-dark">Type</td>
                              <td>{this.state.type}</td>
                            </tr>

                            <tr>
                              <td className="font-weight-bold text-dark">Project</td>
                              <td>{this.state.project}</td>
                            </tr>

                            <tr>
                              <td className="font-weight-bold text-dark">Creator</td>
                              <td>{this.state.dev}</td>
                            </tr>

                          </tbody>

                        </table>

                      </div>

                    </div>                    

                  </div>

                </div> 

              </div>

              <div className="card-footer">
                <span className="float-right">Created: {this.state.submit_date}</span>
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Comments</h6>
              </div>

              <div className="card-body">

                {this.state.comments}

              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Post a Comment</h6>
              </div>

              <CommentForm userID={this.props.userID} ticketID={this.props.ticketID} getComments={this.getComments}/>

            </div>
          </div>
        </div>

      </div>

    );

  }
}

export default Ticket;