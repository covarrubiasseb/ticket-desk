import React from 'react';
import axios from 'axios';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';

class ProjectUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      currentTableUsers: [],
      usersPagination: [],
      usersEntriesLength: 10
    }

    this.getUsers = this.getUsers.bind(this);
    this.handleSearchUsers = this.handleSearchUsers.bind(this);

    this.handleUsersPagination = this.handleUsersPagination.bind(this);
    this.renderUsersPagination = this.renderUsersPagination.bind(this);
  }

  getUsers() {

    axios.get(`/api/project/users?projectID=${this.props.projectID}`, this.props.headersConfig)
    .then(response => {
      
      this.setState({
        users: response.data.map(user => {
          
          return (

            <tr>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>

          );

        })

      }, () => {

        this.setState({

          currentTableUsers: this.state.users.slice(0, this.state.usersEntriesLength)

        }, () => {

          this.renderUsersPagination();

        });

      });

    });

  }

  handleSearchUsers(event) {

    TableFilterByName("tableProjectUsers", event.target.value);

  }

  handleUsersPagination(event, pageIndex) {
    event.preventDefault();

    let start = 0;
    let end = this.state.usersEntriesLength;

    for (let i = 0; i < pageIndex; i++) {
      start += this.state.usersEntriesLength;
      end += this.state.usersEntriesLength;
    }

    this.setState({
      currentTableUsers: this.state.users.slice(start, end)
    });

  }

  renderUsersPagination() {
    let totalPages = CountPages(this.state.users.length, this.state.usersEntriesLength);

    let list = [];

    for (let i = 0; i < totalPages; i++) {

      list.push(
        <li className="page-item"><a className="page-link" href="#" onClick={e => this.handleUsersPagination(e, i)}>{i + 1}</a></li>
      );

    }

    this.setState({
      usersPagination: list
    });

  }


  componentDidMount() {
    // GET Project Users
    this.getUsers();

  }

  render() {

    return (

      <div className="row">
        <div className="col-xl-9">
          <div className="card shadow mb-4">

            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Users</h6>
            </div>

            <div className="card-body">

              <div className="row justify-content-end">

                <div class="col-4">

                  <input className="form-control bg-light" type="text" placeholder="Search for users..." onChange={this.handleSearchUsers} />

                </div>

              </div>                

              <table className="table table-hover" id="tableProjectUsers">

                <thead className="table-light">
                  <tr className="text-dark">
                    <th scope="col">Name</th>
                    <th scope="col">email</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.currentTableUsers}
                </tbody>

              </table>

              <ul className="pagination">
                {this.state.usersPagination}
              </ul>

            </div>

          </div>
        </div>
      </div>

    );

  }  

}

export default ProjectUsers;