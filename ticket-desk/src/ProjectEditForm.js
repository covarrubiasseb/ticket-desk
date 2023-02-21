import React from 'react';
import axios from 'axios';

class ProjectEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectEditName: this.props.projectData.name,
      projectEditDesc: this.props.projectData.desc
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    axios.post(`/api/projects?userID=${this.props.userID}&projectID=${this.props.projectData.projectID}`, 
               {
                 name: this.state.projectEditName,
                 description: this.state.projectEditDesc
               },
               {
                headers: this.props.headersConfig.headers
               }
    )
    .then(response => {
      if (response.data.valid) {
        this.props.updateProject(
        {
          name: this.state.projectEditName,
          desc: this.state.projectEditDesc,
        }
        );
      } else {
        console.log("Could Not Be Updated");
      }
    });
  }

  handleNameChange(event) {
    this.setState({
      projectEditName: event.target.value
    });
  }

  handleDescChange(event) {
    this.setState({
      projectEditDesc: event.target.value
    });
  }

  render() {

    return (

      <form onSubmit={this.handleSubmit}>

        <div className="row mb-2">
          <h6 className="col-12 font-weight-bold text-dark">Name</h6>
          <input type="text" className="form-control bg-light border-1 small col-12" placeholder="Project Name..."
              aria-describedby="basic-addon2" onChange={this.handleNameChange} value={this.state.projectEditName} />
        </div>

        <div className="row mb-2">   
          <h6 className="col-12 font-weight-bold text-dark">Description</h6> 
          <textarea className="form-control bg-light border-1 col-12" placeholder="Project Description..."
              aria-describedby="basic-addon2" onChange={this.handleDescChange} value={this.state.projectEditDesc} />
        </div>

        <button href="#" className="btn btn-secondary btn-icon-split float-right" type="submit">
          <span className="icon text-white-50">
              <i className="fas fa-arrow-right"></i>
          </span>
          <span className="text">Edit Project</span>
        </button>

      </form>

    );

  }
}

export default ProjectEditForm;