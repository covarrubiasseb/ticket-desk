import React from 'react';
import axios from 'axios';
import $ from 'jquery';

import ProjectTickets from './ProjectTickets';

import ProjectCurrentUsers from './ProjectCurrentUsers';
import AdminManageProjectUsers from './AdminManageProjectUsers';

import ProjectEditForm from './ProjectEditForm';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.projectData.name,
      desc: this.props.projectData.desc,
    };

    this.closeTicketModal = this.closeTicketModal.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.handleProjectDelete = this.handleProjectDelete.bind(this);

  }

  closeTicketModal() {
    $("#closeCreateTicketModal").trigger("click");
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

        <ProjectCurrentUsers headersConfig={this.props.headersConfig}
                      userID={this.props.userID} 
                      projectID={this.props.projectData.projectID} />

        <AdminManageProjectUsers headersConfig={this.props.headersConfig} 
                                 userID={this.props.userID} 
                                 projectID={this.props.projectData.projectID} 
                                 getUsers={this.getUsers}/>

      </div>
    );
  }
}

export default Project;