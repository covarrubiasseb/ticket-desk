import React from 'react';
import axios from 'axios';

class AdminManageProjectUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }

    this.getAllUsers = this.getAllUsers.bind(this);
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
              </tr>

            );

          })

        });

      } else {
        console.log("Could Not Get Users");
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