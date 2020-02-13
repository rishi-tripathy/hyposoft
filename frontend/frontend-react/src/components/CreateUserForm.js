import React, {Component} from 'react'
import axios from 'axios'
import {Button, Grid, TextField} from "@material-ui/core";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateUserForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
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
      first_name: event.target.value
    });
  }

  handleLastNameChange = (event) => {
    this.setState({
      last_name: event.target.value
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
    event.preventDefault();
    console.log(this.state);

    axios.post('/api/users/', this.state)
      .then(function (response) {
        alert('Created successfully');
      })
      .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });

    this.props.sendShowTable(true);
  }

  render() {
    return (
      <div>

        <Button variant="outlined" onClick={() => this.props.sendShowTable(true)}>Back</Button>{' '}
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h1>Create User</h1>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Username' type="text" fullWidthvalue={this.state.username}
                         onChange={this.handleUsernameChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='First Name' type="text" fullWidthvalue={this.state.first_name}
                         onChange={this.handleFirstNameChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Last Name' type="text" fullWidthvalue={this.state.last_name}
                         onChange={this.handleLastNameChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Email' type="text" fullWidthvalue={this.state.email} onChange={this.handleEmailChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Password' type="password" fullWidthvalue={this.state.password}
                         onChange={this.handlePasswordChange}/>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Create
                +</Button>{' '}
            </Grid>
          </Grid>
        </form>
      </div>
    )
  }
}

export default CreateUserForm
