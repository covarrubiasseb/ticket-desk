import React from 'react';
import axios from 'axios';

class AdminManageUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: '',
      users: []
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  handleSubmit(event) {
    this.setState({
      selectedOption: event.target.value
    }, () => {
      console.log(this.state.selectedOption);
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
                <td>{user.role}</td>
                <td>
                  <form>
                    <select className="form-select" value={this.state.selectedOption} onChange={this.handleSubmit}>
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