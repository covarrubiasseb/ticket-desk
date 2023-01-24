import React from 'react';
import axios from 'axios';

class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    axios.get(`/api/projects?userID=${this.props.userID}`)
      .then(response => {
        this.setState({
          projects: response.data.map(data => {

            return (
              <div className="col-xl-9">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">{data.name}</h6>
                  </div>
                  <div className="card-body">
                      {data.description}
                  </div>
                </div>
              </div>
            );
          })
        });
      })
      .catch(error => {
        console.log(error);
    });
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
                <form
                  className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 container-fluid">
                  <div className="row mb-2">
                    <input type="text" className="form-control bg-light border-1 small col-12" placeholder="Project Name..."
                        aria-describedby="basic-addon2" />
                  </div>

                  <div className="row mb-2">    
                    <textarea className="form-control bg-light border-1 col-12" placeholder="Project Description..."
                        aria-describedby="basic-addon2" />
                  </div>

                  <button className="btn-circle float-right mt-2">
                    <i className="fa fa-plus"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {this.state.projects}
        </div>
      </div>
    );
  }

}

export default Projects;
