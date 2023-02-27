import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import TicketForm from'./TicketForm';
import ProjectEditForm from './ProjectEditForm';
import AdminManageProjectUsers from './AdminManageProjectUsers';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      tickets: [],
      name: this.props.projectData.name,
      desc: this.props.projectData.desc
    };

    this.closeTicketModal = this.closeTicketModal.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getTickets = this.getTickets.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.handleProjectDelete = this.handleProjectDelete.bind(this);
  }

  closeTicketModal() {
    $("#closeCreateTicketModal").trigger("click");
  }

  getUsers() {
    axios.get(`/api/project/users?projectID=${this.props.projectData.projectID}`, this.props.headersConfig)
      .then(response => {
        
        this.setState({
          users: response.data.map(user => {
            
            return (

              <tr>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>

            );

          })
        });
    });
  }

  getTickets() {    
    axios.get(`/api/project/tickets?projectID=${this.props.projectData.projectID}`, this.props.headersConfig)
      .then(response => {

        this.setState({
          tickets: response.data.map( (data, index) => {

            return (

              <tr>

                <td>

                  <a href="#" onClick={e =>

                    this.props.setPageTicket(data.ticket)

                  }>{data.ticket.title}</a>

                </td>

                <td>
                  <span className={data.ticket.status === "Open" ? "text-success mr-2" : "text-danger mr-2"}>
                    <i className="fa fa-circle"></i>
                  </span>

                  {data.ticket.status}
                </td>

                <td>
                  
                  <div className="row">

                    <div className="col-8 pr-0">
                      {
                        data.ticket.priority === 'Low' ? <div className="progress">
                                                      <div className="progress-bar-striped bg-success" role="progressbar" 
                                                           style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                  : null
                      }

                      {
                        data.ticket.priority === 'Medium' ? <div className="progress">
                                                         <div className="progress-bar-striped bg-success" role="progressbar" 
                                                           style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>

                                                         <div className="progress-bar-striped bg-warning" role="progressbar" 
                                                           style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                       </div>
                                                      : null
                      }

                      {
                        data.ticket.priority === 'High' ? <div className="progress">
                                                        <div className="progress-bar-striped bg-success" role="progressbar" 
                                                          style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>

                                                        <div className="progress-bar-striped bg-warning" role="progressbar" 
                                                          style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>

                                                        <div className="progress-bar-striped bg-danger" role="progressbar" 
                                                             style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                      </div>
                                                    : null
                      }
                    </div>

                  </div>

                </td>

                <td>
                  {`${data.user[0].firstName} ${data.user[0].lastName}`}
                </td>

                <td>
                  {data.ticket.submit_date.slice(0,10)}
                </td>

              </tr>

            );

          })
        });
    });
  }

  updateProject(data) {
    $("#closeProjectEditModal").trigger("click");

    this.setState({

      name: data.name,
      desc: data.desc

    });

  }

  handleProjectDelete() {
    axios.delete(`/api/projects?userID=${this.props.userID}&projectID=${this.props.projectData.projectID}`, this.props.headersConfig)
    .then(response => {
      if (response.data.valid) {
        this.props.setPageDashboard();
      } else {
        console.log("Could Not Be Deleted");
      }
    });
  }

  componentDidMount() {
    // GET Project Users
    this.getUsers();

    // GET Project Tickets
    this.getTickets();
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

                    <h6 className="m-0 font-weight-bold text-primary">{this.state.name}</h6>

                  </div>

                  <div className="col">

                    <div className="dropdown no-arrow float-right">
                      <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuProjectEdit" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuProjectEdit">
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#projectEditModal">Edit</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#" data-toggle="modal" data-target="#projectDeleteModal" onClick={this.reloadTicketData}><span className="text-danger">Delete</span></a>
                      </div>
                    </div>

                    <div className="modal fade" id="projectEditModal" tabIndex="-1" role="dialog" aria-labelledby="projectEditModalLabel"
                        aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="projectEditModalLabel">Edit Project</h5>
                            <button className="close" id="closeProjectEditModal" type="button" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>

                          <div className="modal-body">
                            <ProjectEditForm userID={this.props.userID} headersConfig={this.props.headersConfig} projectData={this.props.projectData} updateProject={this.updateProject}/>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="modal fade" id="projectDeleteModal" tabIndex="-1" role="dialog" aria-labelledby="projectDeleteModalLabel"
                        aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">

                          <div className="modal-header">
                            <h5 className="modal-title" id="projectDeleteModalLabel">Delete Project</h5>
                            <button className="close" id="closeProjectDeleteModal" type="button" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>

                          <div className="modal-body">
                            Select "Delete" if you want to delete this project.
                          </div>

                          <div className="modal-footer">
                            <a className="btn btn-danger float-right" onClick={this.handleProjectDelete}>Delete</a>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                
              </div>

              <div className="card-body">
                {this.state.desc}
              </div>

              <div className="card-footer">
                <span className="float-right">
                  <span className="font-italic font-weight-bold text-dark">Created By: </span>
                  <span className="pr-4">{`${this.props.projectData.user.firstName} ${this.props.projectData.user.lastName}`}</span>

                  <span className="font-weight-bold text-dark">Submit Date: </span>{this.props.projectData.submit_date.slice(0,10)}
                </span>
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Tickets</h6>
              </div>

              <div className="card-body">

                <button className="btn btn-primary" type="button" data-toggle="modal" data-target="#createTicketModal" aria-expanded="false" aria-controls="createTicketModal">
                  Create New Ticket
                </button>

                <div className="modal fade" id="createTicketModal" tabIndex="-1" role="dialog" aria-labelledby="createTicketModalLabel"
                    aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="createTicketModalLabel">Create New Ticket</h5>
                        <button className="close" id="closeCreateTicketModal" type="button" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>

                      <div className="modal-body">
                        <TicketForm headersConfig={this.props.headersConfig}
                                    userID={this.props.userID} 
                                    projectID={this.props.projectData.projectID}
                                    closeTicketModal={this.closeTicketModal} 
                                    getTickets={this.getTickets} />
                      </div>

                    </div>
                  </div>
                </div>

                <table className="table table-hover">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Creator</th>
                      <th scope="col">Submit Date</th>
                    </tr>
                  </thead>

                  <tbody>

                    {this.state.tickets}

                  </tbody>

                </table>

              </div>

            </div>
          </div>
        </div>
                
        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Users</h6>
              </div>

              <div className="card-body">

                <table className="table table-hover">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Name</th>
                      <th scope="col">email</th>
                      <th scope="col">Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.users}
                  </tbody>
                </table>

              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">

            <AdminManageProjectUsers headersConfig={this.props.headersConfig} userID={this.props.userID} projectID={this.props.projectData.projectID} getUsers={this.getUsers}/>

          </div>
        </div>

      </div>
    );
  }
}

export default Project;