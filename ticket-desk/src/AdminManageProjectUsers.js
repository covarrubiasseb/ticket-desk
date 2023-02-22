import React from 'react';
import axios from 'axios';

class AdminManageProjectUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }

    this.getAllUsers = this.getAllUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
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
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <a href="#" onClick={e => this.addUser(e, user.userID, this.props.projectID)}>Add</a>
                </td>
                <td>
                  <a href="#" onClick={e => this.removeUser(e, user.userID, this.props.projectID)}>Delete</a>
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

  addUser(event, userID, projectID) {
    event.preventDefault();

    axios.post(`/api/project/users?userID=${userID}&projectID=${projectID}`, {}, this.props.headersConfig)
    .then(response => {
      if (response.data.valid) {
        // User Added
        // Refresh Page Data

      } else {
        console.log("Could Not Add User To Project")
      }
    });

  }

  removeUser(event, userID, projectID) {
    event.preventDefault();

    axios.delete(`/api/project/users?userID=${userID}&projectID=${projectID}`, this.props.headersConfig)
    .then(response => {
      if (response.data.valid) {
        // User Deleted
        // Refresh Page Data

      } else {
        console.log("Could Not Remove User From Project")
      }
    });

  }

  componentDidMount() {
    this.getAllUsers();
  }

  render() {

    return (

      <div className="card shadow">

        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">All Users (Add/Delete)</h6>
        </div>

        <div className="card-body">

          <table className="table table-hover">

            <thead className="table-light text-dark">
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
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