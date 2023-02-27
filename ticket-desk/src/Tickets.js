import React from 'react';
import axios from 'axios';

class Tickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickets: []
    };

    this.getUserTickets = this.getUserTickets.bind(this);
  }

  getUserTickets() {
    axios.get(`/api/user/tickets?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {
      
      this.setState({

        tickets: response.data.map(ticket => {

          return (

            <tr>
              <td>
                <h6 className="m-0 font-weight-bold text-primary"><a href="#" onClick={e => this.props.setPageTicket(ticket)}>{ticket.title}</a></h6>
              </td>

              <td>
                <span className={ticket.status === "Open" ? "text-success mr-2" : "text-danger mr-2"}>
                  <i className="fa fa-circle"></i>
                </span>

                {ticket.status}
              </td>

              <td>

                <div className="row">

                  <div className="col-4 pr-0">
                    {
                      ticket.priority === 'Low' ? <div className="progress">
                                                    <div className="progress-bar-striped bg-success" role="progressbar" 
                                                         style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                  </div>
                                                : null
                    }

                    {
                      ticket.priority === 'Medium' ? <div className="progress">
                                                       <div className="progress-bar-striped bg-success" role="progressbar" 
                                                         style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>

                                                       <div className="progress-bar-striped bg-warning" role="progressbar" 
                                                         style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                     </div>
                                                    : null
                    }

                    {
                      ticket.priority === 'High' ? <div className="progress">
                                                      <div className="progress-bar-striped bg-success" role="progressbar" 
                                                        style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>

                                                      <div className="progress-bar-striped bg-warning" role="progressbar" 
                                                        style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>

                                                      <div className="progress-bar-striped bg-danger" role="progressbar" 
                                                           style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                  : null
                    }
                  </div>

                  <div className="col-8">
                    {ticket.priority}
                  </div>

                </div>

              </td>

              <td>
                {ticket.submit_date.slice(0,10)}
              </td>

            </tr>

          );

        })

      });

    });
  }

  componentDidMount() {
    this.getUserTickets();
  }

  render() {

    return (

      <div className="container-fluid">

        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Tickets</h1>
        </div>

        <div className="row">
          <div className="col-xl-9">

            <div className="card shadow mb-4">

              <div className="card-body">

                <table className="table table-hover">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Submit Date</th>
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

      </div>

    );

  }
}

export default Tickets;