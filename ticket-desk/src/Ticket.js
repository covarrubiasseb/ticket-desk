import React from 'react';

class Ticket extends React.Component {
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
                  <h6 className="m-0 font-weight-bold text-primary">Ticket Name</h6>
              </div>
              <div className="card-body">
                  Ticket Description
              </div>
            </div>
          </div>
        </div>

      </div>

    );

  }
}

export default Ticket;