import React from 'react';
import axios from 'axios';
import $ from 'jquery';

import ProjectTickets from './ProjectTickets';

import TicketForm from'./TicketForm';
import ProjectEditForm from './ProjectEditForm';
import AdminManageProjectUsers from './AdminManageProjectUsers';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';



class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      name: this.props.projectData.name,
      desc: this.props.projectData.desc,
      currentTableUsers: [],
      usersPagination: [],
      usersEntriesLength: 10
    };

    this.closeTicketModal = this.closeTicketModal.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.handleProjectDelete = this.handleProjectDelete.bind(this);
    this.handleSearchUsers = this.handleSearchUsers.bind(this);

    this.handleUsersPagination = this.handleUsersPagination.bind(this);
    this.renderUsersPagination = this.renderUsersPagination.bind(this);

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
        }, () => {

          this.setState({

            currentTableUsers: this.state.users.slice(0, this.state.usersEntriesLength)

          }, () => {

            this.renderUsersPagination();

          });

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

  handleSearchUsers(event) {

    TableFilterByName("tableProjectUsers", event.target.value);

  }

  handleUsersPagination(event, pageIndex) {
    event.preventDefault();

    let start = 0;
    let end = this.state.usersEntriesLength;

    for (let i = 0; i < pageIndex; i++) {
      start += this.state.usersEntriesLength;
      end += this.state.usersEntriesLength;
    }

    this.setState({
      currentTableUsers: this.state.users.slice(start, end)
    });

  }

  renderUsersPagination() {
    let totalPages = CountPages(this.state.users.length, this.state.usersEntriesLength);

    let list = [];

    for (let i = 0; i < totalPages; i++) {

      list.push(
        <li className="page-item"><a className="page-link" href="#" onClick={e => this.handleUsersPagination(e, i)}>{i + 1}</a></li>
      );

    }

    this.setState({
      usersPagination: list
    });

  }


  componentDidMount() {
    // GET Project Users
    this.getUsers();

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

        <ProjectTickets headersConfig={this.props.headersConfig}
                        userID={this.props.userID} 
                        projectID={this.props.projectData.projectID}
                        projectData={this.props.projectData}
                        setPageTicket={this.props.setPageTicket}
                        closeTicketModal={this.closeTicketModal} />

                   
        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Users</h6>
              </div>

              <div className="card-body">

                <div className="row justify-content-end">

                  <div class="col-4">

                    <input className="form-control bg-light" type="text" placeholder="Search for users..." onChange={this.handleSearchUsers} />

                  </div>

                </div>                

                <table className="table table-hover" id="tableProjectUsers">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Name</th>
                      <th scope="col">email</th>
                      <th scope="col">Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.currentTableUsers}
                  </tbody>

                </table>

                <ul className="pagination">
                  {this.state.usersPagination}
                </ul>

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