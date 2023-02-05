import React from 'react';

class TicketForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketTitle: '',
      ticketStatus: '',
      ticketType: '',
      ticketDate: '',
      ticketDesc: '',
      ticketPriority: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
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

  render() {

    return (

      <form onSubmit={this.handleSubmit}
        className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 container-fluid">

        <div className="row mb-2">
          <input type="text" className="form-control bg-light border-1 small col-12" placeholder="Project Name..."
              aria-describedby="basic-addon2" onChange={this.handleNameChange} value={this.state.ticketTitle} />
        </div>

        <div className="row mb-2">    
          <textarea className="form-control bg-light border-1 col-12" placeholder="Project Description..."
              aria-describedby="basic-addon2" onChange={this.handleDescChange} value={this.state.ticketDesc} />
        </div>

        <button className="btn-circle float-right mt-2" type="submit" data-toggle='modal' data-target="#projectModal">
          <i className="fa fa-plus"></i>
        </button>

        <div className="modal fade" id="projectModal" tabIndex="-1" role="dialog" aria-labelledby="projectModalLabel"
              aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="projectModalLabel">{this.state.modalText}</h5>
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