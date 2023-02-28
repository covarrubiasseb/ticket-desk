import React from 'react';
import axios from 'axios';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';

class Tickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickets: [],
      currentTableTickets: [],
      pagination: [],
      entriesLength: 10
    };

    this.getUserTickets = this.getUserTickets.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
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
                {ticket.submit_date.slice(0,this.state.entriesLength)}
              </td>

            </tr>

          );

        })

      }, () => {

        this.setState({

          currentTableTickets: this.state.tickets.slice(0, this.state.entriesLength)

        }, () => {

          this.renderPagination();

        });

      });

    });
  }

  handleChange(event) {

    TableFilterByName("tableTickets", event.target.value);

  }

  handlePagination(event, pageIndex) {
    event.preventDefault();

    let start = 0;
    let end = this.state.entriesLength;

    for (let i = 0; i < pageIndex; i++) {
      start += this.state.entriesLength;
      end += this.state.entriesLength;
    }

    this.setState({
      currentTableTickets: this.state.tickets.slice(start, end)
    });

  }

  renderPagination() {
    let totalPages = CountPages(this.state.tickets.length, this.state.entriesLength);

    let list = [];

    for (let i = 0; i < totalPages; i++) {

      list.push(
        <li className="page-item"><a className="page-link" href="#" onClick={e => this.handlePagination(e, i)}>{i + 1}</a></li>
      );

    }

    this.setState({
      pagination: list
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

                <div className="row justify-content-end">

                  <div class="col-4">

                    <input className="form-control bg-light" type="text" placeholder="Search for tickets..." onChange={this.handleChange} />

                  </div>

                </div> 

                <table className="table table-hover" id="tableTickets">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Submit Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.currentTableTickets}
                  </tbody>

                </table>

                <ul className="pagination">
                  {this.state.pagination}
                </ul>

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }
}

export default Tickets;