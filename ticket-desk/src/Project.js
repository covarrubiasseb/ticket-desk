import React from 'react';
import axios from 'axios';
import TicketForm from'./TicketForm';
import ProjectEditForm from './ProjectEditForm';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      tickets: []
    };

    this.getTickets = this.getTickets.bind(this);
  }

  getTickets() {    
    axios.get(`/api/project/tickets?projectID=${this.props.projectData.projectID}`, this.props.headersConfig)
      .then(response => {

        this.setState({
          tickets: response.data.map(ticket => {
            
            return (

              <tr>

                <td>

                  <a href="#" onClick={e =>

                    this.props.setPageTicket(ticket)

                  }>{ticket.title}</a>

                </td>

                <td>
                  <span className="float-right">{ticket.submit_date.slice(0,10)}</span>
                </td>

              </tr>

            );

          })
        });
    });
  }

  componentDidMount() {
    // GET Project Users
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

                    <h6 className="m-0 font-weight-bold text-primary">{this.props.projectData.name}</h6>

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
                            <ProjectEditForm headersConfig={this.props.headersConfig} projectData={this.props.projectData}/>
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
                            <a className="btn btn-danger float-right">Delete</a>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                
              </div>

              <div className="card-body">
                {this.props.projectData.desc}
              </div>

              <div className="card-footer">
                <span className="float-right"><span className="font-weight-bold text-dark">Submit Date: </span>{this.props.projectData.submit_date.slice(0,10)}</span>
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

                <table className="table table-hover">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Title</th>
                      <th className="float-right" scope="col">Submit Date</th>
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
                <h6 className="m-0 font-weight-bold text-primary">Send a New Ticket</h6>
              </div>

              <div className="card-body">
                <TicketForm userID={this.props.userID} projectID={this.props.projectData.projectID} getTickets={this.getTickets} headersConfig={this.props.headersConfig}/>
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

      </div>
    );
  }
}

export default Project;