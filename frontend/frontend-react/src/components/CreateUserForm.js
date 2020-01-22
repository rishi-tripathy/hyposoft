import React, { Component } from 'react'

export class CreateUserForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      firstName: '',
      lastName:'',
      email: '',
      password: ''
    }
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  handleFirstNameChange = (event) => {
    this.setState({
      firstName: event.target.value
    });
  }

  handleLastNameChange = (event) => {
    this.setState({
      lastName: event.target.value
    });
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value
    });
  }

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  handleSubmit = (event) => {
    console.log(this.state);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={ this.handleSubmit }>
        <div>
          <label>Username</label>
          <input type='text' value={ this.state.username } onChange={ this.handleUsernameChange } />
        </div>
        <div>
          <label>First name</label>
          <input type='text' value={ this.state.firstName } onChange={ this.handleFirstNameChange } />
        </div>
        <div>
          <label>Last name</label>
          <input type='text' value={ this.state.lastName } onChange={ this.handleLastNameChange } />
        </div>
        <div>
          <label>Email</label>
          <input type='text' value={ this.state.email } onChange={ this.handleEmailChange } />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={ this.state.password } onChange={ this.handlePasswordChange } />
        </div>
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default CreateUserForm
