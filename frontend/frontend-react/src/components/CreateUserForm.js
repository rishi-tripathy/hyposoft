import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { Button, Grid, TextField, Container, Typography } from "@material-ui/core";
import { jsonToHumanText } from './Helpers'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateUserForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      redirect: false,
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

    var self = this;

    axios.post('/api/users/', this.state)
      .then(function (response) {
        alert('Created successfully');
        // window.location = '/users'
        self.setState({
          redirect: true,
        });

      })
      .catch(function (error) {
        alert('Creation was not successful.\n' + jsonToHumanText(error.response.data));
      });
  }

  render() {
    return (
      <div>
        {this.state.redirect && <Redirect to={{ pathname: '/users' }} />}
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item alignContent='center' xs={12} />
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Create User
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <TextField label='Username' type="text" fullWidth fullWidthvalue={this.state.username}
                    onChange={this.handleUsernameChange} />
                </Grid>
                <Grid item xs={8}></Grid>

                <Grid item xs={4}>
                  <TextField label='First Name' type="text" fullWidth fullWidthvalue={this.state.first_name}
                    onChange={this.handleFirstNameChange} />
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Last Name' type="text" fullWidth fullWidthvalue={this.state.last_name}
                    onChange={this.handleLastNameChange} />
                </Grid>
                <Grid item xs={4}></Grid>

                <Grid item xs={4}>
                  <TextField label='Email' type="text" fullWidth fullWidthvalue={this.state.email} onChange={this.handleEmailChange} />
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Password' type="password" fullWidth fullWidthvalue={this.state.password}
                    onChange={this.handlePasswordChange} />
                </Grid>
                <Grid item xs={4}></Grid>

                <Grid item xs={12}>
                  <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Create
                +</Button>{' '}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>

      </div>
    )
  }
}

export default CreateUserForm
