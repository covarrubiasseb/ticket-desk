import React from 'react';
import axios from 'axios';
import $ from 'jquery';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';

import HandlePagination from './utils/HandlePagination';
import RenderPagination from './utils/RenderPagination';
import PaginationPrevious from './utils/PaginationPrevious';
import PaginationNext from './utils/PaginationNext';

class Tickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickets: [],
      currentTableTickets: [],
      pagination: [],
      entriesLength: 10,
      maxPageTableTickets: 10,
      maxTotalPageTabs: 10
    };

    this.getUserTickets = this.getUserTickets.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.renderPagination = this.renderPagination.bind(this);

    this.paginationPrevious = this.paginationPrevious.bind(this);
    this.paginationNext = this.paginationNext.bind(this);
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

    if (!event.target.value) {

      $("#TicketsPagination").show();

      TableFilterByName("tableTickets", event.target.value);

      this.renderPagination();
      this.handlePagination(event, 0);

    } else {

      $("#TicketsPagination").hide();

      this.setState({
        currentTableTickets: this.state.tickets
      }, () => TableFilterByName("tableTickets", event.target.value));

    }

  }

  handlePagination(event, pageIndex) {
    event.preventDefault();

    let [start, end] = HandlePagination(pageIndex, this.state.entriesLength);

    this.setState({
      currentTableTickets: this.state.tickets.slice(start, end)
    });

  }

  renderPagination() {
    let totalPages = CountPages(this.state.tickets.length, this.state.entriesLength);
    
    let list = RenderPagination(totalPages, this.state.maxPageTableTickets, this.paginationPrevious, 
                                                                            this.paginationNext,
                                                                            this.handlePagination);



    this.setState({
      pagination: list
    });

  }

  paginationPrevious(event) {
    event.preventDefault();

    // if there's still 10 more pages to scroll thru (previous), render the previous 10 pagination tabs
    if (this.state.maxPageTableTickets > this.state.maxTotalPageTabs) {

      let list = PaginationPrevious(this.state.maxPageTableTickets, this.state.maxTotalPageTabs, this.paginationPrevious, 
                                                                                                 this.paginationNext,
                                                                                                 this.handlePagination);

      this.setState({
        pagination: list,
        maxPageTableTickets: this.state.maxPageTableTickets - this.state.maxTotalPageTabs
      });

    } 

  }

  paginationNext(event) {
    event.preventDefault();

    let totalPages = CountPages(this.state.tickets.length, this.state.entriesLength);
    let currentMaxPage = this.state.maxPageTableTickets;

    if (currentMaxPage < totalPages) {

      let list = PaginationNext(totalPages, currentMaxPage, this.state.maxTotalPageTabs, this.paginationPrevious, 
                                                                                         this.paginationNext,
                                                                                         this.handlePagination);

      this.setState({
        pagination: list,
        maxPageTableTickets: currentMaxPage + this.state.maxTotalPageTabs
      });

    }

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

                <ul className="pagination" id="TicketsPagination">
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