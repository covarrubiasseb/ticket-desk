import React from 'react';
import axios from 'axios';

import ProjectForm from './ProjectForm';
import TableFilterByName from './utils/tableFilterByName';


class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: []
    };

    this.getProjects = this.getProjects.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getProjects() {
    axios.get(`/api/projects?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {

      this.setState({
        projects: response.data.map(data => {

          return (
            
            <tr>
              <td><a href="#" onClick={e =>

                  this.props.setPageProject({
                    name: data.project.name,
                    user: data.user[0],
                    desc: data.project.description,
                    submit_date: data.project.submit_date,
                    projectID: data.project.projectID 
                  })
                
              }>
                <h6 className="m-0 font-weight-bold text-primary">
                  {data.project.name}
                </h6>
              </a></td>

              <td>
                {`${data.user[0].firstName} ${data.user[0].lastName}`}
              </td>

              <td>
                {data.project.submit_date.slice(0,10)}
              </td>
            </tr>
            
          );

        })
      });
    }).catch(error => {
      console.log(error);
    });

  }

  handleChange(event) {

    TableFilterByName("tableProjects", event.target.value);

  }

  componentDidMount() {
    this.getProjects();
  }

  render() {
    return (
      <div className="container-fluid">

        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Projects</h1>
        </div>

        <button className="btn btn-primary mb-2" type="button" data-toggle="collapse" data-target="#collapseNewProjectForm" aria-expanded="false" aria-controls="collapseNewProjectForm">
          Create New Project (Admin only)
        </button>

        <div className="row">

          <div className="collapse col-xl-9" id="collapseNewProjectForm">
            <div className="card card-body mt-2">
              <ProjectForm className="mb-2" getProjects={this.getProjects} userID={this.props.userID} userEmail={this.props.userData.email} headersConfig={this.props.headersConfig} />
            </div>
          </div>

        </div>
        
        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">
              <div className="card-body">

              <div className="row justify-content-end">

                <div class="col-4">

                  <input className="form-control bg-light" type="text" placeholder="Search for projects..." onChange={this.handleChange} />

                </div>

              </div> 

                <table className="table table-hover" id="tableProjects">
                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Project Name</th>
                      <th scope="col">Creator</th>
                      <th scope="col">Submit Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.projects}
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

export default Projects;
