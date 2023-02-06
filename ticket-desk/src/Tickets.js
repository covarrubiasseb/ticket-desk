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

            <li className="list-group-item">

              <h6 className="m-0 font-weight-bold text-primary"><a href="#" onClick={e => this.props.setPageTicket(ticket)}>{ticket.title}</a></h6>
              
              <span className="float-right">{ticket.submit_date}</span>

            </li>

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
            <ul className="list-group">
              {this.state.tickets}
            </ul>
          </div>
        </div>

      </div>

    );

  }
}

export default Tickets;