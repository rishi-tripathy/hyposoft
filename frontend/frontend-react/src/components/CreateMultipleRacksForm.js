import React, { Component } from 'react'
import axios from 'axios'
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateMultipleRacksForm extends Component {
    constructor() {
        super();
        this.state = {
        'rack_num_start': null,
        'rack_num_start_valid': false,
        'rack_num_end' : null,
        'rack_num_end_valid': false
        }
      }

    removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
    };

    handleSubmit = (e) => {
        e.preventDefault();

        let start_rack = this.state.rack_num_start;
        let end_rack = this.state.rack_num_end;
        let stateCopy = Object.assign({}, this.state);
        let stateToSend = this.removeEmpty(stateCopy);

        //validate

        console.log(start_rack);
        console.log(end_rack);
        
        const validNumRegex = new RegExp("^[A-Z]\\d+$", 'i');
        console.log(validNumRegex);

        if(validNumRegex.test(start_rack) && validNumRegex.test(end_rack)){
          console.log("we in this bitch");
      }
      else {
          alert("Rack Numbers must be specified by a Single Letter Followed by Multiple Numbers.");
      }

        // for(var i: )
        console.log(stateToSend);
        
        axios.post('/api/racks/many/', stateToSend)
        .then(function (response) {
          console.log(response);
          let message = response.data.results;
          alert(response.data.results);
        })
        .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data));
    });
  }
  
  render() {
    let start_rack;
    let end_rack;
    return (
        <Form onSubmit={this.handleSubmit}>
            <h1>Create Multiple Racks</h1>
      <FormGroup>
        <Label for="Start of Range">Creation Range Start</Label>
        <Input type="text" onChange={e => this.setState({rack_num_start: e.target.value})} />{' '}

         <Label for="End of Range">Creation Range End</Label>
        <Input type="text" onChange={e => this.setState({rack_num_end: e.target.value})} />{' '}
      </FormGroup>
          <FormGroup>
       <Button>Submit</Button>
      </FormGroup>
     {console.log(this.state)}
    </Form>


    )
  }

}

export default CreateMultipleRacksForm