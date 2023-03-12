import React from 'react';
import axios from 'axios';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectTotal: 0,
      tickets: [],
      ticketsTypeClientTotal: 0,
      ticketsTypeServerTotal: 0,
      ticketsTypeDevOpsTotal: 0
    }

    this.getProjectTotal = this.getProjectTotal.bind(this);
    this.getTickets = this.getTickets.bind(this);
    this.calculateTicketTypeTotals = this.calculateTicketTypeTotals.bind(this);
  }

  getProjectTotal() {
    axios.get(`/api/projects?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {

      this.setState({

        projectTotal: response.data.length

      });

    });
  }

  getTickets() {
    axios.get(`/api/user/tickets?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {

      this.setState({

        tickets: response.data

      }, () => {

        this.calculateTicketTypeTotals();

      });

    });

  }

  calculateTicketTypeTotals() {
    let clientTotal = 0;
    let serverTotal = 0;
    let devOpsTotal = 0;

    this.state.tickets.forEach(ticket => {
      if (ticket.type === 'Client Side') {
        clientTotal++;
      }

      if (ticket.type === 'Server Side') {
        serverTotal++;
      }

      if (ticket.type === 'Dev Ops') {
        devOpsTotal++;
      }
    });

    this.setState({

      ticketsTypeClientTotal: clientTotal,
      ticketsTypeServerTotal: serverTotal,
      ticketsTypeDevOpsTotal: devOpsTotal 

    });

  }

  componentDidMount() {
    this.getProjectTotal();
    this.getTickets();
  }

  render() {
    return (
      <div className="container-fluid"> 

        <div className="d-sm-flex align-items-center justify-content-between mb-4 ms-2">
          <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        </div>

        <div className="row">

          <div className="col-6">

            <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Projects (Total)</div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.projectTotal}</div>
                        </div>
                        <div className="col-auto">
                            <i className="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>

          </div>

          <div className="col-6">

            <div class="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Tickets Created</div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.tickets.length}</div>
                        </div>
                        <div className="col-auto">
                            <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>

          </div>

        </div>

        <div className="row">

          <div className="col-12">

            <div className="card shadow my-4">

              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary">Tickets By Type</h6>
              </div>

              <div className="card-body">
                
                <div className="m-2">Client Side</div>
                <div className="progress m-2">
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: `${Math.round( (this.state.ticketsTypeClientTotal / this.state.tickets.length) * 100 )}%`}} 
                       aria-valuenow={Math.round(this.state.ticketsTypeClientTotal / this.state.tickets.length)} aria-valuemin="0" aria-valuemax={this.state.tickets.length}>
                    <span className="text-gray-800 font-weight-bold">{this.state.ticketsTypeClientTotal}</span>
                  </div>
                </div>

                <div className="m-2">Server Side</div>
                <div className="progress m-2">
                  <div className="progress-bar bg-info" role="progressbar" style={{ width: `${Math.round( (this.state.ticketsTypeServerTotal / this.state.tickets.length) * 100 )}%`}} 
                       aria-valuenow={Math.round(this.state.ticketsTypeServerTotal / this.state.tickets.length)} aria-valuemin="0" aria-valuemax={this.state.tickets.length}>
                    <span className="text-gray-800 font-weight-bold">{this.state.ticketsTypeServerTotal}</span>
                  </div>
                </div>

                <div className="m-2">Dev Ops</div>
                <div className="progress m-2">
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${Math.round( (this.state.ticketsTypeDevOpsTotal / this.state.tickets.length) * 100 )}%`}} 
                       aria-valuenow={Math.round(this.state.ticketsTypeDevOpsTotal / this.state.tickets.length)} aria-valuemin="0" aria-valuemax={this.state.tickets.length}>
                    <span className="text-gray-800 font-weight-bold">{this.state.ticketsTypeDevOpsTotal}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default Dashboard;