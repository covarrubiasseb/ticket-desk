import React from 'react';
import axios from 'axios';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';

class AdminManageUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      currentTableUsers: [],
      pagination: [],
      entriesLength: 20,
      maxPageTableUsers: 10,
      maxTotalPageTabs: 10
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.renderPagination = this.renderPagination.bind(this);

    this.paginationPrevious = this.paginationPrevious.bind(this);
    this.paginationNext = this.paginationNext.bind(this);
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
                <td>{`${user.firstName} ${user.lastName}`}</td>
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

        }, () => {

          this.setState({

            currentTableUsers: this.state.users.slice(0, this.state.entriesLength)

          }, () => {

            this.renderPagination();

          });

        });

      } else {
        console.log("Could Not Get Users");
      }
    });
  }

  handleChange(event) {

    TableFilterByName("tableAdminManageUsers", event.target.value);

  }

  handlePagination(event, pageIndex) {
    event.preventDefault();

    let start = 0;
    let end = this.state.entriesLength;

    for (let i = 0; i < pageIndex; i++) {
      start += this.state.entriesLength;
      end += this.state.entriesLength;
    }

    this.setState({
      currentTableUsers: this.state.users.slice(start, end)
    });

  }

  renderPagination() {
    let totalPages = CountPages(this.state.users.length, this.state.entriesLength);

    let list = [];

    if (totalPages > this.state.maxPageTableUsers) {
      // Add Previous button
      list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationPrevious}>Previous</a></li>);

      // Add first 10 pages
      for (let i = 0; i < this.state.maxPageTableUsers; i++) {

        list.push(
          <li className="page-item"><a className="page-link" href="#" onClick={e => this.handlePagination(e, i)}>{i + 1}</a></li>
        );

      }

      // Add Next button
      list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationNext}>Next</a></li>);

    } else {


      for (let i = 0; i < totalPages; i++) {

        list.push(
          <li className="page-item"><a className="page-link" href="#" onClick={e => this.handlePagination(e, i)}>{i + 1}</a></li>
        );

      }

    }


    this.setState({
      pagination: list
    });
  }

  paginationPrevious(event) {
    event.preventDefault();

    // if there's still 10 more pages to scroll thru (previous), render the previous 10 pagination tabs
    if (this.state.maxPageTableUsers > this.state.maxTotalPageTabs) {

      let currentMaxPage = this.state.maxPageTableUsers;

      let list = [];

      // Add Previous button
      list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationPrevious}>Previous</a></li>);

      for (let i = (currentMaxPage - (this.state.maxTotalPageTabs * 2) ); i < (currentMaxPage - this.state.maxTotalPageTabs); i++) {

        list.push(
          <li className="page-item"><a className="page-link" href="#" onClick={e => this.handlePagination(e, i)}>{i + 1}</a></li>
        );

      }

      // Add Next button
      list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationNext}>Next</a></li>);

      this.setState({
        pagination: list,
        maxPageTableUsers: currentMaxPage - this.state.maxTotalPageTabs
      });

    } 

  }

  paginationNext(event) {
    event.preventDefault();

    let totalPages = CountPages(this.state.users.length, this.state.entriesLength);
    let currentMaxPage = this.state.maxPageTableUsers;

    let list = [];

    if (currentMaxPage < totalPages) {

      // if there's still this.state.maxTotalPageTabs more pages to scroll thru, render the next this.state.maxTotalPageTabs pagination tabs
      if ((totalPages - currentMaxPage) >= this.state.maxTotalPageTabs) {

        // Add Previous button
        list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationPrevious}>Previous</a></li>);

        for (let i = currentMaxPage; i < (currentMaxPage + this.state.maxTotalPageTabs); i++) {

          list.push(
            <li className="page-item"><a className="page-link" href="#" onClick={e => this.handlePagination(e, i)}>{i + 1}</a></li>
          );

        }

        // Add Next button
        list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationNext}>Next</a></li>);

        this.setState({
          pagination: list,
          maxPageTableUsers: currentMaxPage + this.state.maxTotalPageTabs
        });

      } else {

        // Add Previous button
        list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationPrevious}>Previous</a></li>);

        // render remaining pagination tabs
        for (let i = currentMaxPage; i < totalPages; i++) {

          list.push(
            <li className="page-item"><a className="page-link" href="#" onClick={e => this.handlePagination(e, i)}>{i + 1}</a></li>
          );

        }

        this.setState({
          pagination: list,
          maxPageTableUsers: currentMaxPage + this.state.maxTotalPageTabs
        });

      }

    }
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

                <div className="row justify-content-end">

                  <div class="col-4">

                    <input className="form-control bg-light" type="text" placeholder="Search for users..." onChange={this.handleChange} />

                  </div>

                </div> 

                <table className="table table-hover" id="tableAdminManageUsers">

                  <thead className="table-light text-dark">
                    <tr>
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
                  {this.state.pagination}
                </ul>

              </div>
            </div>
          </div>
        </div>

      </div>

    );

  }
}

export default AdminManageUsers;