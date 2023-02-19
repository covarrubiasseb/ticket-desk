import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();

    axios.post('/api/login', {
      email: this.state.email,
      password: this.state.password
    })
    .then(response => {
      if (response.status === 200) {
        console.log(response.data);

        this.props.getUserData(response.data.userData);
        this.props.setPageMain();
      } else {
        console.log(response);
      }
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
                                        <h1 className="h4 text-gray-900 mb-4">Login</h1>
                                    </div>

                                    <form className="user" onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user" id="loginInputEmail" value={this.state.email} onChange={this.handleEmailChange} placeholder="Enter Email Address..." />
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-user" id="loginInputPassword" value={this.state.password} onChange={this.handlePasswordChange} placeholder="Password" />
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-user btn-block">
                                            Login
                                        </button>
                                        
                                    </form>

                                    <hr />

                                    <div className="text-center">
                                        <a className="small" href="#" onClick={this.props.setPageRegister}>Create an Account!</a>
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

export default Login;