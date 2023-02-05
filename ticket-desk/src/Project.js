import React from 'react';
import axios from 'axios';
import TicketForm from'./TicketForm';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      tickets: []
    }
  }

  componentDidMount() {
    // Get Project Users
    axios.get(`/api/project/users?projectID=${this.props.projectData.projectID}`)
      .then(response => {
        
        this.setState({
          users: response.data.map(user => {

            return (

              <li>{user.name}</li>

            );

          })
        });
    });

    // Get Project Tickets
    axios.get(`/api/project/tickets?projectID=${this.props.projectData.projectID}`)
      .then(response => {

        this.setState({
          tickets: response.data.map(ticket => {

            return (

              <li>{ticket.title}</li>

            );

          })
        });
    });

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
                <ul>
                  {this.state.tickets}
                </ul>
              </div>

              <div className="card-footer">
                <div className="card-header py-3">
                  Send a New Ticket
                </div>
                <TicketForm userID={this.props.userID} projectID={this.props.projectData.projectID}/>
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
                <ul>
                  {this.state.users}
                </ul>   
              </div>
            </div>
          </div>
        </div>



      </div>
    );
  }
}

export default Project;