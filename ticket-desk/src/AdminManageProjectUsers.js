import React from 'react';
import axios from 'axios';
import $ from 'jquery';

import TableFilterByName from './utils/TableFilterByName';
import TableClear from './utils/TableClear';
import CountPages from './utils/CountPages';

import HandlePagination from './utils/HandlePagination';
import RenderPagination from './utils/RenderPagination';
import PaginationPrevious from './utils/PaginationPrevious';
import PaginationNext from './utils/PaginationNext';

class AdminManageProjectUsers extends React.Component {
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

    this.getAllUsers = this.getAllUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.renderPagination = this.renderPagination.bind(this);

    this.paginationPrevious = this.paginationPrevious.bind(this);
    this.paginationNext = this.paginationNext.bind(this);
  }

  getAllUsers() {
    axios.get(`/api/users`, this.props.headersConfig)
    .then(response => {
      if (response.data.valid) {

        let users = response.data.results;

        this.setState({

          users: users.map(user => {

            return (
            
              <tr style={{display: "none"}}>
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

    if (!event.target.value) {

      $("#AdminManageProjectUsersPagination").show();

      TableClear("tableAdminManageProjectUsers");

    } else {

      $("#AdminManageProjectUsersPagination").hide();

      this.setState({
        currentTableUsers: this.state.users
      }, () => TableFilterByName("tableAdminManageProjectUsers", event.target.value));

    }

  }

  handlePagination(event, pageIndex) {
    event.preventDefault();

    let [start, end] = HandlePagination(pageIndex, this.state.entriesLength);

    this.setState({
      currentTableUsers: this.state.users.slice(start, end)
    });

  }

  renderPagination() {
    let totalPages = CountPages(this.state.users.length, this.state.entriesLength);

    let list = RenderPagination(totalPages, this.state.maxPageTableUsers, this.paginationPrevious, 
                                                                          this.paginationNext,
                                                                          this.handlePagination);

    this.setState({
      pagination: list
    });
  }

  paginationPrevious(event) {
    event.preventDefault();

    // if there's still 10 more pages to scroll thru (previous), render the previous 10 pagination tabs
    if (this.state.maxPageTableUsers > this.state.maxTotalPageTabs) {

      let list = PaginationPrevious(this.state.maxPageTableUsers, this.state.maxTotalPageTabs, this.paginationPrevious, 
                                                                                               this.paginationNext,
                                                                                               this.handlePagination);

      this.setState({
        pagination: list,
        maxPageTableUsers: this.state.maxPageTableUsers - this.state.maxTotalPageTabs
      });

    } 

  }

  paginationNext(event) {
    event.preventDefault();

    let totalPages = CountPages(this.state.users.length, this.state.entriesLength);
    let currentMaxPage = this.state.maxPageTableUsers;

    if (currentMaxPage < totalPages) {

      let list = PaginationNext(totalPages, currentMaxPage, this.state.maxTotalPageTabs, this.paginationPrevious, 
                                                                                         this.paginationNext,
                                                                                         this.handlePagination);

      this.setState({
        pagination: list,
        maxPageTableUsers: currentMaxPage + this.state.maxTotalPageTabs
      });

    }

  }

  componentDidMount() {
    this.getAllUsers();
  }

  render() {

    return (

      <div className="card">

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
              {this.state.currentTableUsers}
            </tbody>

          </table>

          <ul className="pagination" id="AdminManageProjectUsersPagination">
            {this.state.pagination}
          </ul>

        </div>

      </div>

    );

  }
}

export default AdminManageProjectUsers;