import React from 'react';

class AdminManageUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  handleSubmit(event) {
    this.setState({
      selectedOption: event.target.value
    });
  }

  getUsers() {

  }

  componentDidMount() {
    this.getUsers()
  }

  render() {

    return (

      <div className="container-fluid"> 

        <div className="d-sm-flex align-items-center justify-content-between mb-4 ms-2">
          <h1 className="h3 mb-0 text-gray-800">Manage Users</h1>
        </div>

        <form className>
          <label>
            Select an option:
            <select className="form-select" value={this.state.selectedOption} onChange={this.handleSubmit}>
              <option value="Admin">Admin</option>
              <option value="Manager">Project Manager</option>
              <option value="Developer">Developer</option>
              <option value="User">User</option>
            </select>
          </label>
        </form>

      </div>

    );

  }
}

export default AdminManageUsers;