import axios from 'axios';
import React from 'react';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Project from './Project';
import Ticket from './Ticket';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: '',
      currentPage: 'Dashboard',
      userID: '',
      currentProjectData: null,
      currentTicketData: null
    };

    this.setUserData = this.setUserData.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.setPageDashboard = this.setPageDashboard.bind(this);
    this.setPageProjects = this.setPageProjects.bind(this);
    this.setPageProject = this.setPageProject.bind(this);
    this.setPageTicket = this.setPageTicket.bind(this);
  }

  setUserData(data) {
    this.setState({ 
      displayName: data.name,
      userID: data.userID
    });
  }

  setCurrentPage() {
    switch (this.state.currentPage) {
      case 'Dashboard':
        return <Dashboard userID={this.state.userID} />
      case 'Projects':
        return <Projects userID={this.state.userID} setPageProject={this.setPageProject}/>
      case 'Project':
        return <Project userID={this.state.userID} projectData={this.state.currentProjectData} setPageTicket={this.setPageTicket}/>
      case 'Ticket':
        return <Ticket ticketData={this.state.currentTicketData} userID={this.state.userID} projectID={this.state.currentProjectData.projectID}/>
    };
  }

  setPageDashboard() {
    this.setState({ currentPage: 'Dashboard' });
  }

  setPageProjects() {
    this.setState({ currentPage: 'Projects' });
  }

  setPageProject(projectData) {
    this.setState({
      currentProjectData: projectData
    }, () => {
      this.setState({ currentPage: 'Project' });
    });
  }

  setPageTicket(ticketData) {
    this.setState({
      currentTicketData: ticketData
    }, () => {
      this.setState({ currentPage: 'Ticket' });
    });
    
  }

  componentDidMount() {
    axios.get('/api/users')
      .then(response => {
        this.setUserData(response.data);
    })
      .catch(error => {
        console.log(error);
    });
  }

  render() {

    return (
      <div className="App">

        <div id="page-top">
      
          <div id="wrapper">

              
              <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                  
                  <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                      <div className="sidebar-brand-icon rotate-n-15">
                          <i className="fas fa-tasks"></i>
                      </div>
                      <div className="sidebar-brand-text mx-3">Ticket Desk</div>
                  </a>

                  
                  <hr className="sidebar-divider my-0"/>

                  
                  <li className="nav-item active">
                      <a className="nav-link" href="#" onClick={this.setPageDashboard}>
                          <i className="fas fa-fw fa-tachometer-alt"></i>
                          <span>Dashboard</span></a>
                  </li>

                  
                  <hr className="sidebar-divider"/>

                  
                  <div className="sidebar-heading">
                      Admin
                  </div>

                  
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                          <i className="fas fa-fw fa-cog"></i>
                          <span>Manage Users</span>
                      </a>
                  </li>

                  
                  <hr className="sidebar-divider"/>

                  
                  <div className="sidebar-heading">
                      General
                  </div>

                  
                  <li className="nav-item">
                      <a className="nav-link" href="#" onClick={this.setPageProjects}>
                          <i className="fas fa-fw fa-folder"></i>
                          <span>My Projects</span>
                      </a>
                  </li>

                  
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                          <i className="fas fa-fw fa-chart-area"></i>
                          <span>My Tickets</span></a>
                  </li>

                  
                  <li className="nav-item">
                      <a className="nav-link" href="#">
                          <i className="fas fa-fw fa-table"></i>
                          <span>User Profile</span></a>
                  </li>

                  
                  <hr className="sidebar-divider d-none d-md-block"/>

              </ul>
              
              <div id="content-wrapper" className="d-flex flex-column">

                  
                  <div id="content">

                      
                      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                          
                          <ul className="navbar-nav ml-auto">


                              <div className="topbar-divider d-none d-sm-block"></div>

                              
                              <li className="nav-item dropdown no-arrow">
                                  <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <span className="mr-2 d-none d-lg-inline text-gray-600 small">{this.state.displayName}</span>
                                      <img className="img-profile rounded-circle"
                                          src="img/undraw_profile.svg"/>
                                  </a>
                                  
                                  <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                      aria-labelledby="userDropdown">
                                      <a className="dropdown-item" href="#">
                                          <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                          Profile
                                      </a>
                                      <a className="dropdown-item" href="#">
                                          <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                          Settings
                                      </a>
                                      <a className="dropdown-item" href="#">
                                          <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                          Activity Log
                                      </a>
                                      <div className="dropdown-divider"></div>
                                      <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                          <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                          Logout
                                      </a>
                                  </div>
                              </li>


                          </ul>

                      </nav>
                      
                      {
                        this.setCurrentPage()
                      }
                      

                  </div>
                  
                  
                  <footer className="sticky-footer bg-white">
                      <div className="container my-auto">
                          <div className="copyright text-center my-auto">
                              <span>Copyright &copy; Your Website 2021</span>
                          </div>
                      </div>
                  </footer>
                  

              </div>
              

          </div>
          
          
          <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="logoutModalLabel"
              aria-hidden="true">
              <div className="modal-dialog" role="document">
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title" id="logoutModalLabel">Ready to Leave?</h5>
                          <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                          </button>
                      </div>
                      <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                      <div className="modal-footer">
                          <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                          <a className="btn btn-primary" href="/logout">Logout</a>
                      </div>
                  </div>
              </div>
          </div>


        </div>


      </div>
    );
  }
}

export default App;
