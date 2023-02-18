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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: '',
      currentPage: 'Dashboard',
      userID: '',
      currentProjectData: null,
      currentTicketData: null,
      currentLoginRegister: 'Login'
    };

    this.setUserData = this.setUserData.bind(this);
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
  }

  setUserData(data) {
    this.setState({ 
      displayName: data.name,
      userID: data.userID
    });
  }

  renderLoginRegister() {
    switch (this.state.currentLoginRegister) {
      case 'Login':
        return <Login setPageRegister={this.setPageRegister} setPageMain={this.setPageMain}/>
      case 'Register':
        return <Register setPageLogin={this.setPageLogin} setPageMain={this.setPageMain} />
      case 'Main':
        return (

          <Main 
            setPageDashboard={this.setPageDashboard} 
            setPageProjects={this.setPageProjects} 
            setPageUserTickets={this.setPageUserTickets} 
            displayName={this.state.displayName} 
            renderCurrentPage={this.renderCurrentPage}
          />

        )
    }
  }

  renderCurrentPage() {
    switch (this.state.currentPage) {
      case 'Dashboard':
        return <Dashboard userID={this.state.userID} />
      case 'Projects':
        return <Projects userID={this.state.userID} setPageProject={this.setPageProject}/>
      case 'Project':
        return <Project userID={this.state.userID} projectData={this.state.currentProjectData} setPageTicket={this.setPageTicket}/>
      case 'Ticket':
        return <Ticket ticketData={this.state.currentTicketData} userID={this.state.userID} ticketID={this.state.currentTicketData.ticketID}/>
      case 'Tickets':
        return <Tickets userID={this.state.userID} setPageTicket={this.setPageTicket}/>
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

  componentDidMount() {
    // axios.get('/api/users')
    //   .then(response => {
    //     this.setUserData(response.data);
    // })
    //   .catch(error => {
    //     console.log(error);
    // });

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
