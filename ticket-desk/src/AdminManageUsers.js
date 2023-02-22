import React from 'react';
import axios from 'axios';

class AdminManageUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  handleSubmit(event, userID) {

    axios.post(`/api/users?userID=${userID}`,
               {
                role: event.target.value
               },
               {
                headers: this.props.headersConfig.headers
               }
    )
    .then(response => {

      if (response.data.valid) {

        this.setState({
          users: []
        }, () => {
          this.getUsers();
        });

      } else {
        console.log("Could Not Update User Role");
      }

    });
  }

  getUsers() {
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
                <td>
                  <form>
                    <select className="form-select" value={user.role} onChange={e => this.handleSubmit(e, user.userID)}>
                      <option value="Unassigned">Unassigned</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Project Manager</option>
                      <option value="Developer">Developer</option>
                      <option value="User">User</option>
                    </select>
                  </form>
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

  componentDidMount() {
    this.getUsers();
  }

  render() {

    return (

      <div className="container-fluid"> 

        <div className="d-sm-flex align-items-center justify-content-between mb-4 ms-2">
          <h1 className="h3 mb-0 text-gray-800">Manage Users</h1>
        </div>

        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">
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
          </div>
        </div>

      </div>

    );

  }
}

export default AdminManageUsers;