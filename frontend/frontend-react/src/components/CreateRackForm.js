import React, { Component } from 'react'
import axios from 'axios'
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateRackForm extends Component {
    constructor() {
        super();
        this.state = {
          'id': null,
          'rack_number': null,
          'u1': null,
          'u2': null,
          'u3': null,
          'u4': null,
          'u5': null,
          'u6': null,
          'u7': null,
          'u8': null,
          'u9': null,
          'u10': null,
          'u11': null,
          'u12': null,
          'u13': null,
          'u14': null,
          'u15': null,
          'u16': null,
          'u17': null,
          'u18': null,
          'u19': null,
          'u20': null,
          'u21': null,
          'u22': null,
          'u23': null,
          'u24': null,
          'u25': null,
          'u26': null,
          'u27': null,
          'u28': null,
          'u29': null,
          'u30': null,
          'u31': null,
          'u32': null,
          'u33': null,
          'u34': null,
          'u35': null,
          'u36': null,
          'u37': null,
          'u38': null,
          'u39': null,
          'u40': null,
          'u41': null,
          'u42': null,
        }
      }

    removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
    };

    handleSubmit = (e) => {
    e.preventDefault();

    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);
    
    axios.post('/api/racks/', stateToSend)
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
        <Form onSubmit={this.handleSubmit}>
        <h1>Rack Creation form</h1>{' '}
      <FormGroup>
        <Label for="Rack Number">Rack Number</Label>
        <Input type="text" onChange={e => this.setState({rack_number: e.target.value})} />
      </FormGroup>
          <FormGroup>
       <Button>Submit</Button>
      </FormGroup>
      <FormGroup>
      </FormGroup>
    </Form>
    )
  }

}

export default CreateRackForm