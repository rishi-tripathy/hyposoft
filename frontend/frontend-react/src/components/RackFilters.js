import React, { Component } from 'react'
import axios from 'axios'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Select from 'react-select';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RackFilters extends Component {
  
  constructor() {
    super();
    this.state = {
      identifiers: {
        rackStart: '',
        rackEnd: '',
      }, 
      query: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
    }

  createQuery = () => {
    const { rackStart, rackEnd } = this.state.identifiers;
    let q = '' + 
            'rack_num_start=' + rackStart + '&' + 
            'rack_num_end=' + rackEnd;
    this.setState({ query: q });
    return q;
  }

  handleSubmit = (e) => {
    e.preventDefault();


    let start_rack = this.state.identifiers.rackStart;
    let end_rack = this.state.identifiers.rackEnd;
    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);
    const validNumRegex = new RegExp("^[A-Z]\\d+$", 'i');

    if((validNumRegex.test(start_rack) && validNumRegex.test(end_rack))){
      this.props.sendFilterQuery(this.createQuery());
    }
    else{
      alert("Rack Numbers must be specified by a Single Letter Followed by Multiple Numbers.");
    }
  }

  resetFilters = () => {
    window.location.reload();
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
      <FormGroup>
        <Label for="rack_num_start">Starting Rack Number</Label>
        <Input type="text" name="rack_num_start" id="rack_num_start" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.rackStart = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />
        <FormText color="muted">
          The rack number you want to start filtering from.
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label for="rack_num_end">Ending Rack Number</Label>
        <Input type="text" name="rack_num_end" id="rack_num_end" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.rackEnd = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })

          } } />
         <FormText color="muted">
          The last rack in the range you want to filter.
           Note: A range like A2-B3 will return only A2, A3, B2, and B3, but not A4 or B1.
        </FormText>
      </FormGroup>
      <FormGroup>
       <Button>Submit</Button>
      </FormGroup>
      <FormGroup>
        <Button onClick={ this.resetFilters }>Reset Filters</Button>
      </FormGroup>
    </Form>

    </div>
    )
  }
}

export default RackFilters