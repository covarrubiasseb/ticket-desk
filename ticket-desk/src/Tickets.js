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
    axios.get(`/api/user/tickets?userID=${this.props.userID}`)
    .then(response => {
      
      this.setState({

        tickets: response.data.map(ticket => {

          return (

            <div className="row">
              <div className="col-xl-9">
                <div className="card shadow mb-4">

                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary"><a href="#" onClick={e => this.props.setPageTicket(ticket)}>{ticket.title}</a></h6>
                  </div>

                  <div className="card-body">
                    {ticket.description}
                  </div>

                  <div className="card-footer">
                    <span className="float-right">{ticket.submit_date}</span>
                  </div>

                </div>
              </div>
            </div>

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

        {this.state.tickets}

      </div>

    );

  }
}

export default Tickets;