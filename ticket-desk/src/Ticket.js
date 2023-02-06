import React from 'react';
import CommentForm from './CommentForm';


class Ticket extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props)
    return (

      <div className="container-fluid">

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">{this.props.ticketData.title}</h6>
              </div>

              <div className="card-body">
                {this.props.ticketData.description}
              </div>

              <div className="card-footer">
                <span className="float-right">{this.props.ticketData.submit_date}</span>
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Comments</h6>
              </div>

              <div className="card-body">
                {/* Comments Array here */}
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Post a Comment</h6>
              </div>

              <CommentForm userID={this.props.userID} projectID={this.props.projectID}/>

            </div>
          </div>
        </div>

      </div>

    );

  }
}

export default Ticket;