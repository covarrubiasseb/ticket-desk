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
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">{data.name}</h6>
                </div>
                <div class="card-body">
                    {data.description}
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

        <div>
          {this.state.projects}
        </div>
      </div>
    );
  }

}

export default Projects;
