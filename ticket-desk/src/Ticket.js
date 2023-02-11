import React from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';


class Ticket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      project: '',
      dev: ''
    };

    this.getComments = this.getComments.bind(this);
    this.getTicketUser = this.getTicketUser.bind(this);
    this.getTicketProject = this.getTicketProject.bind(this);

  }

  getComments() {
    axios.get(`/api/ticket/comments?ticketID=${this.props.ticketID}`)
    .then(response => {

      this.setState({

        comments: response.data.map(comment => {

          return (

            <div className="card mb-2">

              <div className="card-header">
                <span className=" font-weight-bold text-dark">UserID:</span> {comment.userID}
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

                    <h6 className="m-0 font-weight-bold text-primary">{this.props.ticketData.title}</h6>

                  </div>

                  <div className="col">
                    {/* Display Conditionallly on page load if User submitted Ticket*/}
                    <div className="dropdown no-arrow float-right">
                      <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuTicketEdit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuTicketEdit">
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#ticketEditModal">Edit</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#ticketDeleteModal"><span className="text-danger">Delete</span></a>
                      </div>
                    </div>

                    <div className="modal fade" id="ticketEditModal" tabIndex="-1" role="dialog" aria-labelledby="ticketEditModalLabel"
                        aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="ticketEditModalLabel">(Edit Ticket Form here)</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
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

                <div className="card mb-4">

                  <div className="card-header">
                    <h6 className="m-0 font-weight-bold text-dark">Info</h6>
                  </div>

                  <div className="card-body">

                    <table className="table table-hover">

                      <thead className="table-light">
                        <th className="text-dark" scope="col">Status</th>
                        <th className="text-dark" scope="col">Priority</th>
                        <th className="text-dark" scope="col">Type</th>
                        <th className="text-dark" scope="col">Project</th>
                        <th className="text-dark" scope="col">Creator</th>
                      </thead>

                      <tbody>
                        <tr>
                          <td>{this.props.ticketData.status}</td>
                          <td>{this.props.ticketData.priority}</td>
                          <td>{this.props.ticketData.type}</td>
                          <td>{this.state.project}</td>
                          <td>{this.state.dev}</td>
                        </tr>
                      </tbody>

                    </table>

                  </div>

                </div>

                <div className="card">

                  <div className="card-header">
                    <h6 className="m-0 font-weight-bold text-dark">Description</h6>
                  </div>

                  <div className="card-body">
                    {this.props.ticketData.description}
                  </div>

                </div>  

              </div>

              <div className="card-footer">
                <span className="float-right">Created: {this.props.ticketData.submit_date}</span>
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