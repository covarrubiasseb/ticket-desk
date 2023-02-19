import React from 'react';
import axios from 'axios';

class TicketEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketTitle: this.props.ticketData.title,
      ticketStatus: this.props.ticketData.status || 'open',
      ticketType: this.props.ticketData.type || 'client',
      ticketDesc: this.props.ticketData.description,
      ticketPriority: this.props.ticketData.priority || 'medium'
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.setTicketStatus = this.setTicketStatus.bind(this);
    this.setTicketPriority = this.setTicketPriority.bind(this);
    this.setTicketType = this.setTicketType.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    axios.post(`/api/project/tickets?userID=${this.props.userID}&ticketID=${this.props.ticketData.ticketID}`,
              {
                userID: this.props.ticketData.userID,
                projectID: this.props.ticketData.projectID,
                ticketTitle: this.state.ticketTitle,
                ticketStatus: this.state.ticketStatus,
                ticketType: this.state.ticketType,
                ticketDesc: this.state.ticketDesc,
                ticketPriority: this.state.ticketPriority
              },
              {
                headers: this.props.headersConfig.headers
              }
    )
    .then(response => {
      if (response.data.valid) {

        this.props.reloadTicketData();

        this.setState({
          submitModalText: 'Ticket Updated'
        });

      } else {

        this.setState({
          submitModalText: 'Something went wrong. Please Try again.'
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

  setTicketStatus(event) {
    this.setState({
      ticketStatus: event.target.value
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

          <div className="col-4">

            <h6 className="font-weight-bold text-dark">Status</h6>

            <select className="form-select" value={this.state.ticketStatus} onChange={this.setTicketStatus}>
              <option value="open" selected>Open</option>
              <option value="closed">Closed</option>
            </select>

          </div>

          <div className="col-4">

            <h6 className="font-weight-bold text-dark">Priority</h6>

            <select className="form-select" value={this.state.ticketPriority} onChange={this.setTicketPriority}>
              <option value="high">High</option>
              <option value="medium" selected>Medium</option>
              <option value="low">Low</option>
            </select>

          </div>

          <div className="col-4">

            <h6 className="font-weight-bold text-dark">Type</h6>

            <select className="form-select" value={this.state.ticketType} onChange={this.setTicketType}>
              <option value="client" selected>Client Side</option>
              <option value="server">Server Side</option>
              <option value="dev">Dev Ops</option>
            </select>

          </div>

        </div>

        <button href="#" className="btn btn-secondary btn-icon-split float-right" type="submit">
          <span className="icon text-white-50">
              <i className="fas fa-arrow-right"></i>
          </span>
          <span className="text">Update Ticket</span>
        </button>

      </form>

    );

  }
}

export default TicketEditForm;