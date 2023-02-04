import React from 'react';

class Project extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Individual Project Page</h1>
        </div>
      </div>
    );
  }
}

export default Project;