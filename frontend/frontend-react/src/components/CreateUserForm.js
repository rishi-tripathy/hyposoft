import React, { Component } from 'react'
import axios from 'axios'
import {Button, Form, FormGroup, Label, Input}  from "reactstrap";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateUserForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      first_name: '',
      last_name:'',
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
      alert('Creation was not successful.\n' + JSON.stringify(error.response.data));
    });

    this.props.sendShowTable(true);
  }

  render() {
    return (
      <Form onSubmit={ this.handleSubmit }>
        <FormGroup>
          <Label>Username</Label>
          <Input type='text' value={ this.state.username } onChange={ this.handleUsernameChange } />
        </FormGroup>
        <FormGroup>
          <Label>First name</Label>
          <Input type='text' value={ this.state.first_name } onChange={ this.handleFirstNameChange } />
        </FormGroup>
        <FormGroup>
          <Label>Last name</Label>
          <Input type='text' value={ this.state.last_name } onChange={ this.handleLastNameChange } />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input type='text' value={ this.state.email } onChange={ this.handleEmailChange } />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type='password' value={ this.state.password } onChange={ this.handlePasswordChange } />
        </FormGroup>
        <Button color="success" type="submit">Create</Button>
      </Form>
    )
  }
}

export default CreateUserForm
