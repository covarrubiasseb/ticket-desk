import React from 'react';

class Project extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">{this.props.projectData.name}</h6>
              </div>
              <div className="card-body">
                  {this.props.projectData.desc}
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
                  Filler
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
                  Filler
              </div>
            </div>
          </div>
        </div>



      </div>
    );
  }
}

export default Project;