import React from 'react';
import axios from 'axios';
import $ from 'jquery';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';

import HandlePagination from './utils/HandlePagination';
import RenderPagination from './utils/RenderPagination';
import PaginationPrevious from './utils/PaginationPrevious';
import PaginationNext from './utils/PaginationNext';

class ProjectUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      currentTableUsers: [],
      usersPagination: [],
      usersEntriesLength: 10,
      maxPageTableUsers: 10,
      maxTotalPageTabs: 10
    }

    this.getUsers = this.getUsers.bind(this);
    this.handleSearchUsers = this.handleSearchUsers.bind(this);

    this.handleUsersPagination = this.handleUsersPagination.bind(this);
    this.renderUsersPagination = this.renderUsersPagination.bind(this);

    this.paginationPrevious = this.paginationPrevious.bind(this);
    this.paginationNext = this.paginationNext.bind(this);
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

    if (!event.target.value) {

      $("#UsersPagination").show();

      TableFilterByName("tableeUsers", event.target.value);

      this.renderPagination();
      this.handlePagination(event, 0);

    } else {

      $("#UsersPagination").hide();

      this.setState({
        currentTableUsers: this.state.users
      }, () => TableFilterByName("tableUsers", event.target.value));

    }

  }

  handleUsersPagination(event, pageIndex) {
    event.preventDefault();

    let [start, end] = HandlePagination(pageIndex, this.state.entriesLength);

    this.setState({
      currentTableUsers: this.state.users.slice(start, end)
    });

  }

  renderUsersPagination() {
    let totalPages = CountPages(this.state.users.length, this.state.usersEntriesLength);

    let list = RenderPagination(totalPages, this.state.maxPageTableUsers, this.paginationPrevious, 
                                                                          this.paginationNext,
                                                                          this.handlePagination);

    this.setState({
      usersPagination: list
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

              <ul className="pagination" id ="UsersPagination">
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