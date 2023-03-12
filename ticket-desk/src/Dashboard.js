import React from 'react';
import axios from 'axios';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectTotal: 0,
      ticketTotal: 0
    }

    this.getProjectTotal = this.getProjectTotal.bind(this);
    this.getTicketTotal = this.getTicketTotal.bind(this);
  }

  getProjectTotal() {
    axios.get(`/api/projects?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {

      this.setState({

        projectTotal: response.data.length

      });

    });
  }

  getTicketTotal() {
    axios.get(`/api/user/tickets?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {

      this.setState({

        ticketTotal: response.data.length

      });

    });

  }

  componentDidMount() {
    this.getProjectTotal();
    this.getTicketTotal();
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
                            <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.ticketTotal}</div>
                        </div>
                        <div className="col-auto">
                            <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
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