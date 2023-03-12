import axios from 'axios';
import React from 'react';

class ProjectForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: '',
      projectDesc: ''
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleNameChange(event) {
    this.setState({
      projectName: event.target.value
    });
  }

  handleDescChange(event) {
    this.setState({
      projectDesc: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    
    if (this.state.projectName && this.state.projectDesc) {

      axios.put(`/api/projects?userID=${this.props.userID}`, 
              { 
                userEmail: this.props.userEmail,
                projectName: this.state.projectName,
                projectDesc: this.state.projectDesc 
              },
              {
                headers: this.props.headersConfig.headers
              }
      )
      .then(response => {

        if (response.data.valid) {
          this.props.closeCreateProjectModal();
          // refresh Projects
          this.props.getProjects();
        }

        this.clearForm();

      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  clearForm() {
    this.setState({
      projectName: '',
      projectDesc: ''
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}
        className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 container-fluid">

        <div className="row mb-2">
          <h6 className="col-12 font-weight-bold text-dark">Name</h6>
          <input type="text" className="form-control bg-light border-1 small col-12" placeholder="Project Name..."
              aria-describedby="basic-addon2" onChange={this.handleNameChange} value={this.state.projectName} />
        </div>

        <div className="row mb-2">
          <h6 className="col-12 font-weight-bold text-dark">Description</h6>    
          <textarea className="form-control bg-light border-1 col-12" placeholder="Project Description..."
              aria-describedby="basic-addon2" onChange={this.handleDescChange} value={this.state.projectDesc} />
        </div>

        <button href="#" className="btn btn-secondary btn-icon-split float-right" type="submit">
          <span className="icon text-white-50">
              <i className="fas fa-arrow-right"></i>
          </span>
          <span className="text">Create Project</span>
        </button>

      </form>
    );
  }
}

export default ProjectForm;