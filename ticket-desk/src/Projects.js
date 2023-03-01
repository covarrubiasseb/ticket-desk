import React from 'react';
import axios from 'axios';

import ProjectForm from './ProjectForm';

import TableFilterByName from './utils/tableFilterByName';
import CountPages from './utils/countPages';


class Projects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      currentTableProjects: [],
      pagination: [],
      entriesLength: 10,
      maxPageTableProjects: 10,
      maxTotalPageTabs: 10
    };

    this.getProjects = this.getProjects.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.handlePagination = this.handlePagination.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.paginationPrevious = this.paginationPrevious.bind(this);
    this.paginationNext = this.paginationNext.bind(this);
  }

  getProjects() {
    axios.get(`/api/projects?userID=${this.props.userID}`, this.props.headersConfig)
    .then(response => {

      this.setState({
        projects: response.data.map(data => {

          return (
            
            <tr>
              <td><a href="#" onClick={e =>

                  this.props.setPageProject({
                    name: data.project.name,
                    user: data.user[0],
                    desc: data.project.description,
                    submit_date: data.project.submit_date,
                    projectID: data.project.projectID 
                  })
                
              }>
                <h6 className="m-0 font-weight-bold text-primary">
                  {data.project.name}
                </h6>
              </a></td>

              <td>
                {`${data.user[0].firstName} ${data.user[0].lastName}`}
              </td>

              <td>
                {data.project.submit_date.slice(0,this.state.entriesLength)}
              </td>
            </tr>
            
          );

        })
      }, () => {

        this.setState({

          currentTableProjects: this.state.projects.slice(0, this.state.entriesLength)

        }, () => {

          this.renderPagination();

        });

      });
    }).catch(error => {
      console.log(error);
    });

  }

  handleChange(event) {

    TableFilterByName("tableProjects", event.target.value);

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
      currentTableProjects: this.state.projects.slice(start, end)
    });

  }

  renderPagination() {
    let totalPages = CountPages(this.state.projects.length, this.state.entriesLength);

    let list = [];


    if (totalPages > this.state.maxPageTableProjects) {
      // Add Previous button
      list.push(<li className="page-item"><a className="page-link" href="#" onClick={this.paginationPrevious}>Previous</a></li>);

      // Add first 10 pages
      for (let i = 0; i < this.state.maxPageTableProjects; i++) {

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
    if (this.state.maxPageTableProjects > this.state.maxTotalPageTabs) {

      let currentMaxPage = this.state.maxPageTableProjects;

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
        maxPageTableProjects: currentMaxPage - this.state.maxTotalPageTabs
      });

    } 

  }

  paginationNext(event) {
    event.preventDefault();

    let totalPages = CountPages(this.state.projects.length, this.state.entriesLength);
    let currentMaxPage = this.state.maxPageTableProjects;

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
          maxPageTableProjects: currentMaxPage + this.state.maxTotalPageTabs
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
          maxPageTableProjects: currentMaxPage + this.state.maxTotalPageTabs
        });

      }

    }
  }

  componentDidMount() {
    this.getProjects();
  }

  render() {
    return (
      <div className="container-fluid">

        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Projects</h1>
        </div>

        <button className="btn btn-primary mb-2" type="button" data-toggle="collapse" data-target="#collapseNewProjectForm" aria-expanded="false" aria-controls="collapseNewProjectForm">
          Create New Project (Admin only)
        </button>

        <div className="row">

          <div className="collapse col-xl-9" id="collapseNewProjectForm">
            <div className="card card-body mt-2">
              <ProjectForm className="mb-2" getProjects={this.getProjects} userID={this.props.userID} userEmail={this.props.userData.email} headersConfig={this.props.headersConfig} />
            </div>
          </div>

        </div>
        
        <div className="row">
          <div className="col-xl-9">
            <div className="card shadow mb-4">
              <div className="card-body">

              <div className="row justify-content-end">

                <div class="col-4">

                  <input className="form-control bg-light" type="text" placeholder="Search for projects..." onChange={this.handleChange} />

                </div>

              </div> 

                <table className="table table-hover" id="tableProjects">
                  <thead className="table-light">
                    <tr className="text-dark">
                      <th scope="col">Project Name</th>
                      <th scope="col">Creator</th>
                      <th scope="col">Submit Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.currentTableProjects}
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

export default Projects;
