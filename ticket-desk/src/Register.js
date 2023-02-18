import React from 'react';
import axios from 'axios';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
   }

  handleSubmit(event) {
    event.preventDefault();

    axios.post('/api/register', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    })
    .then(response => {
      if (response.status === 200) {
        this.props.setPageMain();
      } else {
        console.log(response);
      }
    });
  }

  handleFirstNameChange(event) {
    this.setState({
      firstName: event.target.value
    });
  }

  handleLastNameChange(event) {
    this.setState({
      lastName: event.target.value
    });
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  render() {

    return (

      <div className="container">

        <div className="row justify-content-center">

            <div className="col-md-6">

                <div className="card o-hidden border-0 shadow-lg my-5">

                    <div className="card-body p-0">
                        
                        <div className="row">
                            
                            <div className="col-12">

                                <div className="p-5">

                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Register</h1>
                                    </div>

                                    <form className="user" onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user" id="registerInputFirstName" value={this.state.firstName} onChange={this.handleFirstNameChange} placeholder="Enter First Name..." />
                                        </div>

                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user" id="registerInputLastName" value={this.state.lastName} onChange={this.handleLastNameChange} placeholder="Enter Last Name..." />
                                        </div>

                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user" id="registerInputEmail" value={this.state.email} onChange={this.handleEmailChange} placeholder="Enter Email Address..." />
                                        </div>

                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-user" id="registerInputPassword" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Password" />
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-user btn-block">
                                            Register
                                        </button>
                                        
                                    </form>

                                    <hr />

                                    <div className="text-center">
                                        <a className="small" href="#" onClick={this.props.setPageLogin}>Already have an account? Login!</a>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

      </div>

    );

  }
}

export default Register;