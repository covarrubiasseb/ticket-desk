import React from 'react';
import axios from 'axios';

import ProjectCurrentUsers from './ProjectCurrentUsers';
import AdminManageProjectUsers from './AdminManageProjectUsers';


class ProjectUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      projectCurrentUsersComponent: <div></div>
    }

    this.updateCurrentUsers = this.updateCurrentUsers.bind(this);
  }

  updateCurrentUsers() {
    axios.get(`/api/project/users?projectID=${this.props.projectID}`, this.props.headersConfig)
    .then(response => {

      this.setState({

        users: response.data

      }, () => {

        this.setState({

          projectCurrentUsersComponent: <ProjectCurrentUsers headersConfig={this.props.headersConfig}
                                                             userID={this.props.userID} 
                                                             projectID={this.props.projectID}
                                                             currentUsers={this.state.users} />

        });

      });

    });

  }

  componentDidMount() {
    this.updateCurrentUsers();
  }

  render() {

    return (

      <div>

        {this.state.projectCurrentUsersComponent}

        <AdminManageProjectUsers headersConfig={this.props.headersConfig} 
                                 userID={this.props.userID} 
                                 projectID={this.props.projectID}
                                 updateCurrentUsers={this.updateCurrentUsers} />

      </div>

    );

  }
}

export default ProjectUsers;