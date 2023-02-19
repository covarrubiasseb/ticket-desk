import React from 'react';
import axios from 'axios';

class TicketForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketTitle: '',
      ticketStatus: 'open',
      ticketType: 'client',
      ticketDesc: '',
      ticketPriority: 'medium',
      submitModalText: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.setTicketPriority = this.setTicketPriority.bind(this);
    this.setTicketType = this.setTicketType.bind(this);
  }

  clearForm() {
    this.setState({
      ticketTitle: '',
      ticketStatus: '',
      ticketType: '',
      ticketDesc: '',
      ticketPriority: ''
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    axios.put('/api/project/tickets',
      {
        headers: this.props.headersConfig.headers,
        userID: this.props.userID,
        projectID: this.props.projectID,
        ticketTitle: this.state.ticketTitle,
        ticketStatus: this.state.ticketStatus,
        ticketType: this.state.ticketType,
        ticketDesc: this.state.ticketDesc,
        ticketPriority: this.state.ticketPriority
      })
    .then(response => {
      if (response.data.valid) {
        this.clearForm();

        this.setState({
          submitModalText: 'Ticket Submitted'
        });

        this.props.getTickets();
        
      } else {
        this.setState({
          submitModalText: 'Something went wrong. Please try again.'
        });
      }
    });
  }

  handleTitleChange(event) {
    this.setState({
      ticketTitle: event.target.value
    });
  }

  handleDescChange(event) {
    this.setState({
      ticketDesc: event.target.value
    });
  }

  setTicketPriority(event) {
    this.setState({
      ticketPriority: event.target.value
    });
  }

  setTicketType(event) {
    this.setState({
      ticketType: event.target.value
    });
  }

  render() {

    return (

      <form onSubmit={this.handleSubmit}
        className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 container-fluid">

        <div className="row mb-2">

          <h6 className="font-weight-bold text-dark">Title</h6>

          <input type="text" className="form-control bg-light border-1 small col-12" placeholder="Ticket Title..."
              aria-describedby="basic-addon2" onChange={this.handleTitleChange} value={this.state.ticketTitle} />

        </div>

        <div className="row mb-2">

          <h6 className="font-weight-bold text-dark">Description</h6>

          <textarea className="form-control bg-light border-1 col-12" placeholder="Ticket Description..."
              aria-describedby="basic-addon2" onChange={this.handleDescChange} value={this.state.ticketDesc} />

        </div>

        <div className="row mb-2">

          <div className="col-6">

            <h6 className="font-weight-bold text-dark">Priority</h6>

            <select className="form-select" value={this.state.ticketPriority} onChange={this.setTicketPriority}>
              <option value="high">High</option>
              <option value="medium" selected>Medium</option>
              <option value="low">Low</option>
            </select>

          </div>

          <div className="col-6">

            <h6 className="font-weight-bold text-dark">Type</h6>

            <select className="form-select" value={this.state.ticketType} onChange={this.setTicketType}>
              <option value="client" selected>Client Side</option>
              <option value="server">Server Side</option>
              <option value="dev">Dev Ops</option>
            </select>

          </div>

        </div>

        <button href="#" className="btn btn-secondary btn-icon-split float-right" type="submit" data-toggle="modal" data-target="#ticketModal">
          <span className="icon text-white-50">
              <i className="fas fa-arrow-right"></i>
          </span>
          <span className="text">Send Ticket</span>
        </button>

        <div className="modal fade" id="ticketModal" tabIndex="-1" role="dialog" aria-labelledby="ticketModalLabel"
              aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="ticketModalLabel">{this.state.submitModalText}</h5>
                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </form>

    );

  }
}

export default TicketForm;