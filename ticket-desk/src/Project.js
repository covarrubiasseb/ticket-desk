import React from 'react';
import axios from 'axios';
import TicketForm from'./TicketForm';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      tickets: []
    };

    this.getTickets = this.getTickets.bind(this);
  }

  getTickets() {    
    axios.get(`/api/project/tickets?projectID=${this.props.projectData.projectID}`, this.props.headersConfig)
      .then(response => {

        this.setState({
          tickets: response.data.map(ticket => {
            
            return (

              <tr>

                <td>

                  <a href="#" onClick={e =>

                    this.props.setPageTicket(ticket)

                  }>{ticket.title}</a>

                </td>

                <td>
                  <span className="float-right">{ticket.submit_date.slice(0,10)}</span>
                </td>

              </tr>

            );

          })
        });
    });
  }

  componentDidMount() {
    // GET Project Users
    axios.get(`/api/project/users?projectID=${this.props.projectData.projectID}`, this.props.headersConfig)
      .then(response => {
        
        this.setState({
          users: response.data.map(user => {
            
            return (

              <tr>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>

            );

          })
        });
    });

    // GET Project Tickets
    this.getTickets();
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

                <table className="table table-hover">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Title</th>
                      <th className="float-right" scope="col">Submit Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.tickets}
                  </tbody>

                </table>

              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Send a New Ticket</h6>
              </div>

              <div className="card-body">
                <TicketForm userID={this.props.userID} projectID={this.props.projectData.projectID} getTickets={this.getTickets} headersConfig={this.props.headersConfig}/>
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

                <table className="table table-hover">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Name</th>
                      <th scope="col">email</th>
                      <th scope="col">Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.users}
                  </tbody>
                </table>

              </div>

            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Project;