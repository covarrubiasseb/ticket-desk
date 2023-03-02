import React from 'react';
import axios from 'axios';
import $ from 'jquery';

import TicketForm from'./TicketForm';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';

import HandlePagination from './utils/HandlePagination';
import RenderPagination from './utils/RenderPagination';
import PaginationPrevious from './utils/PaginationPrevious';
import PaginationNext from './utils/PaginationNext';

class ProjectTickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickets: [],
      currentTableTickets: [],
      ticketsPagination: [],
      ticketsEntriesLength: 10,
      maxPageTableTickets: 10,
      maxTotalPageTabs: 10
    }

    this.getTickets = this.getTickets.bind(this);
    this.handleSearchTickets = this.handleSearchTickets.bind(this);
    this.handleTicketsPagination = this.handleTicketsPagination.bind(this);
    this.renderTicketsPagination = this.renderTicketsPagination.bind(this);

    this.paginationPrevious = this.paginationPrevious.bind(this);
    this.paginationNext = this.paginationNext.bind(this);
  }

  getTickets() {    
    axios.get(`/api/project/tickets?projectID=${this.props.projectData.projectID}`, this.props.headersConfig)
    .then(response => {

      this.setState({
        tickets: response.data.map( (data, index) => {

          return (

            <tr>

              <td>

                <a href="#" onClick={e =>

                  this.props.setPageTicket(data.ticket)

                }>{data.ticket.title}</a>

              </td>

              <td>
                <span className={data.ticket.status === "Open" ? "text-success mr-2" : "text-danger mr-2"}>
                  <i className="fa fa-circle"></i>
                </span>

                {data.ticket.status}
              </td>

              <td>
                
                <div className="row">

                  <div className="col-8 pr-0">
                    {
                      data.ticket.priority === 'Low' ? <div className="progress">
                                                    <div className="progress-bar-striped bg-success" role="progressbar" 
                                                         style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                  </div>
                                                : null
                    }

                    {
                      data.ticket.priority === 'Medium' ? <div className="progress">
                                                       <div className="progress-bar-striped bg-success" role="progressbar" 
                                                         style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>

                                                       <div className="progress-bar-striped bg-warning" role="progressbar" 
                                                         style={{ width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                                                     </div>
                                                    : null
                    }

                    {
                      data.ticket.priority === 'High' ? <div className="progress">
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

                </div>

              </td>

              <td>
                {`${data.user[0].firstName} ${data.user[0].lastName}`}
              </td>

              <td>
                {data.ticket.submit_date.slice(0,10)}
              </td>

            </tr>

          );

        })

      }, () => {

        this.setState({

          currentTableTickets: this.state.tickets.slice(0, this.state.ticketsEntriesLength)

        }, () => {

          this.renderTicketsPagination();

        });
      
      });

    });
  }

  handleSearchTickets(event) {

    if (!event.target.value) {

      $("#ProjectTicketsPagination").show();

      TableFilterByName("tableProjectTickets", event.target.value);

      this.renderTicketsPagination();
      this.handleTicketsPagination(event, 0);

    } else {

      $("#ProjectTicketsPagination").hide();

      this.setState({
        currentTableTickets: this.state.tickets
      }, () => TableFilterByName("tableProjectTickets", event.target.value));

    }

  }

  handleTicketsPagination(event, pageIndex) {
    event.preventDefault();

    let [start, end] = HandlePagination(pageIndex, this.state.entriesLength);

    this.setState({
      currentTableTickets: this.state.tickets.slice(start, end)
    });

  }

  renderTicketsPagination() {
    let totalPages = CountPages(this.state.tickets.length, this.state.ticketsEntriesLength);

    let list = RenderPagination(totalPages, this.state.maxPageTableUsers, this.paginationPrevious, 
                                                                          this.paginationNext,
                                                                          this.handleTicketsPagination);

    this.setState({
      ticketsPagination: list
    });

  }

  paginationPrevious(event) {
    event.preventDefault();

    // if there's still 10 more pages to scroll thru (previous), render the previous 10 pagination tabs
    if (this.state.maxPageTableTickets > this.state.maxTotalPageTabs) {

      let list = PaginationPrevious(this.state.maxPageTableTickets, this.state.maxTotalPageTabs, this.paginationPrevious, 
                                                                                                 this.paginationNext,
                                                                                                 this.handleTicketsPagination);

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
                                                                                         this.handleTicketsPagination);

      this.setState({
        pagination: list,
        maxPageTableTickets: currentMaxPage + this.state.maxTotalPageTabs
      });

    }

  }

  componentDidMount() {
    // GET Project Tickets
    this.getTickets();
  }

  render() {

    return (

      <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">

              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Tickets</h6>
              </div>

              <div className="card-body">

                <button className="btn btn-primary" type="button" data-toggle="modal" data-target="#createTicketModal" aria-expanded="false" aria-controls="createTicketModal">
                  Create New Ticket
                </button>

                <div className="modal fade" id="createTicketModal" tabIndex="-1" role="dialog" aria-labelledby="createTicketModalLabel"
                    aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="createTicketModalLabel">Create New Ticket</h5>
                        <button className="close" id="closeCreateTicketModal" type="button" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>

                      <div className="modal-body">
                        <TicketForm headersConfig={this.props.headersConfig}
                                    userID={this.props.userID} 
                                    projectID={this.props.projectData.projectID}
                                    closeTicketModal={this.props.closeTicketModal} 
                                    getTickets={this.getTickets} />
                      </div>

                    </div>
                  </div>
                </div>

                <div className="row justify-content-end">

                  <div class="col-4">

                    <input className="form-control bg-light" type="text" placeholder="Search for tickets..." onChange={this.handleSearchTickets} />

                  </div>

                </div> 

                <table className="table table-hover" id="tableProjectTickets">

                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Creator</th>
                      <th scope="col">Submit Date</th>
                    </tr>
                  </thead>

                  <tbody>

                    {this.state.currentTableTickets}

                  </tbody>

                </table>

                <ul className="pagination" id="#ProjectTicketsPagination">
                  {this.state.ticketsPagination}
                </ul>

              </div>

            </div>
          </div>
        </div>

    );

  }
}

export default ProjectTickets;