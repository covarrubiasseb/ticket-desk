import React from 'react';
import axios from 'axios';

import TableFilterByName from './utils/TableFilterByName';

class AdminManageProjectUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }

    this.getAllUsers = this.getAllUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  getAllUsers() {
    axios.get(`/api/users`, this.props.headersConfig)
    .then(response => {
      if (response.data.valid) {

        let users = response.data.results;

        this.setState({

          users: users.map(user => {

            return (
            
              <tr>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div><a href="#" onClick={e => this.addUser(e, user.userID, this.props.projectID)}>Add</a></div>
                  <div><a href="#" onClick={e => this.removeUser(e, user.userID, this.props.projectID)}>Delete</a></div>
                </td>
              </tr>

            );

          })

        });

      } else {
        console.log("Could Not Get Users");
      }
    });
  }

  addUser(event, projectUserID, projectID) {
    event.preventDefault();

    axios.post(`/api/project/users`,
               {
                 userID: this.props.userID,
                 projectID: projectID,
                 projectUserID: projectUserID
               }, 
               this.props.headersConfig)
    .then(response => {
      if (response.data.valid) {
        // User Added
        // Refresh Page Data
        this.props.getUsers();

      } else {
        console.log("Could Not Add User To Project");
      }
    });

  }

  removeUser(event, projectUserID, projectID) {
    event.preventDefault();

    axios.delete(`/api/project/users?userID=${this.props.userID}&projectUserID=${projectUserID}&projectID=${projectID}`, this.props.headersConfig)
    .then(response => {
      if (response.data.valid) {
        // User Deleted
        // Refresh Page Data
        this.props.getUsers();
      } else {
        console.log("Could Not Remove User From Project");
      }
    });

  }

  handleChange(event) {

    TableFilterByName("tableAdminManageProjectUsers", event.target.value);

  }

  componentDidMount() {
    this.getAllUsers();
  }

  render() {

    return (

      <div className="card shadow">

        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Manage Users</h6>
        </div>

        <div className="card-body">

          <div className="row justify-content-end">

            <div class="col-4">

              <input className="form-control bg-light" type="text" placeholder="Search for users..." onChange={this.handleChange}/>

            </div>

          </div>

          <table className="table table-hover" id="tableAdminManageProjectUsers">

            <thead className="table-light text-dark">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">email</th>
                <th scope="col">Role</th>
              </tr>
            </thead>

            <tbody>
              {this.state.users}
            </tbody>

          </table>

        </div>

      </div>

    );

  }
}

export default AdminManageProjectUsers;