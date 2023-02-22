import axios from 'axios';
import React from 'react';

import Login from './Login';
import Register from './Register';

import Main from './Main';

import Dashboard from './Dashboard';
import Projects from './Projects';
import Project from './Project';
import Ticket from './Ticket';
import Tickets from './Tickets';
import AdminManageUsers from './AdminManageUsers';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      currentPage: 'Dashboard',
      userData: null,
      currentProjectData: null,
      currentTicketData: null,
      currentLoginRegister: 'Login',
      token: null
    };

    this.getUserData = this.getUserData.bind(this);
    this.renderLoginRegister = this.renderLoginRegister.bind(this);
    this.renderCurrentPage = this.renderCurrentPage.bind(this);
    this.setPageLogin = this.setPageLogin.bind(this);
    this.setPageRegister = this.setPageRegister.bind(this);
    this.setPageMain = this.setPageMain.bind(this); 
    this.setPageDashboard = this.setPageDashboard.bind(this);
    this.setPageProjects = this.setPageProjects.bind(this);
    this.setPageProject = this.setPageProject.bind(this);
    this.setPageTicket = this.setPageTicket.bind(this);
    this.setPageUserTickets = this.setPageUserTickets.bind(this);
    this.setPageAdminManageUsers = this.setPageAdminManageUsers.bind(this);
  }

  getUserData(data) {
    this.setState({
      userData: {
        userID: data.userID,
        name: {
          firstName: data.name.firstName,
          lastName: data.name.lastName
        },
        email: data.email,
        role: data.role,
        token: data.token
      },
      config: {
        headers: {
          'jwt-token': data.token
        }
      }
    });
  }

  renderLoginRegister() {
    switch (this.state.currentLoginRegister) {
      case 'Login':
        return <Login setPageRegister={this.setPageRegister} setPageMain={this.setPageMain} getUserData={this.getUserData}/>
      case 'Register':
        return <Register setPageLogin={this.setPageLogin} setPageMain={this.setPageMain} getUserData={this.getUserData}/>
      case 'Main':
        return (

          <Main
            setPageDashboard={this.setPageDashboard} 
            setPageProjects={this.setPageProjects} 
            setPageUserTickets={this.setPageUserTickets} 
            renderCurrentPage={this.renderCurrentPage}
            setPageAdminManageUsers={this.setPageAdminManageUsers}
            userName={
              {
                firstName: this.state.userData.name.firstName,
                lastName: this.state.userData.name.lastName
              }
            }
          />

        )
    }
  }

  renderCurrentPage() {
    switch (this.state.currentPage) {
      case 'Dashboard':
        return <Dashboard userID={this.state.userData.userID} />
      case 'Projects':
        return <Projects headersConfig={this.state.config} 
                         userID={this.state.userData.userID} 
                         setPageProject={this.setPageProject} 
                         userData={this.state.userData}/>
      case 'Project':
        return <Project headersConfig={this.state.config} 
                        userID={this.state.userData.userID} 
                        projectData={this.state.currentProjectData} 
                        setPageTicket={this.setPageTicket}
                        setPageDashboard={this.setPageDashboard}/>
      case 'Ticket':
        return <Ticket headersConfig={this.state.config} 
                       ticketData={this.state.currentTicketData} 
                       userID={this.state.userData.userID} 
                       ticketID={this.state.currentTicketData.ticketID}
                       setPageDashboard={this.setPageDashboard} />
      case 'Tickets':
        return <Tickets headersConfig={this.state.config} 
                        userID={this.state.userData.userID} 
                        setPageTicket={this.setPageTicket} />
      case 'AdminManageUsers':
        return <AdminManageUsers headersConfig={this.state.config} />
    };
  }

  setPageLogin() {
    this.setState({
      currentLoginRegister: 'Login'
    });
  }

  setPageRegister() {
    this.setState({
      currentLoginRegister: 'Register'
    });
  }

  setPageMain() {
    this.setState({
      currentLoginRegister: 'Main'
    });
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

  setPageUserTickets() {
    this.setState({ currentPage: 'Tickets' });
  }

  setPageAdminManageUsers() {
    if (this.state.userData.role === 'Admin') {
      this.setState({ currentPage: 'AdminManageUsers' });
    }
  }

  render() {

    return (
      <div className="App">

        { this.renderLoginRegister() }

      </div>
    );
  }
}

export default App;
