import React from 'react';
import axios from 'axios';
import ProjectForm from './ProjectForm';

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: []
    };

    this.getProjects = this.getProjects.bind(this);
  }

  getProjects() {
    axios.get(`/api/projects?userID=${this.props.userID}`)
      .then(response => {

        this.setState({
          projects: response.data.map(project => {

            return (
              
              <li className="list-group-item">
                <a href="#" onClick={e =>

                    this.props.setPageProject({
                      name: project.name,
                      desc: project.description,
                      projectID: project.projectID 
                    })
                  
                }>
                  <h6 className="m-0 font-weight-bold text-primary">
                    {project.name}
                  </h6>
                </a>
              </li>
              
            );

          })
        });
      }).catch(error => {
          console.log(error);
      });

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

        <div className="row">
          <div className="col-xl-9">
            <div className="card mb-4">
              <div className="card-header py-3">
                Create New Project (Admin only)
              </div>
              <div className="card-body">
                <ProjectForm getProjects={this.getProjects}/>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">
              <div className="card-body">
                <ul className="list-group">
                  {this.state.projects}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default Projects;
