import React, { Component } from 'react'
import axios from 'axios'
import {Button, TextField, Grid} from "@material-ui/core";

//import {Button, Form, FormGroup, Input, Label} from "reactstrap";
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
       if (e)  e.preventDefault();

        let start_rack = this.state.rack_num_start;
        let end_rack = this.state.rack_num_end;
        let stateCopy = Object.assign({}, this.state);
        let stateToSend = this.removeEmpty(stateCopy);
        const validNumRegex = new RegExp("^[A-Z]\\d+$", 'i');

        if((validNumRegex.test(start_rack) && validNumRegex.test(end_rack))){
          axios.post('/api/racks/many/', stateToSend)
        .then(function (response) {
          let message = response.data.results;
          alert(response.data.results);
        })
        .catch(function (error) {
          alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
        });
        }
        else{
          alert("Rack Numbers must be specified by a Single Letter Followed by Multiple Numbers.");
        }
        this.props.sendShowTable(true);
      }
  
  render() {
    let start_rack;
    let end_rack;
    return (
  <div>
    <Button variant="outlined" onClick={() => this.props.sendShowTable(true)} >Back</Button>{' '}
     <form onSubmit={this.handleSubmit}>
       <Grid container spacing={1}>
        <Grid item xs={12}>
        <h1>Create Multiple Racks</h1>
        </Grid>
        <Grid item xs={6}>
            <TextField label = 'Creation Range Start' type="text" fullWidth onChange={e => this.setState({rack_num_start: e.target.value})} />
         </Grid>
        <Grid item xs={6}>
            <TextField label = 'Creation Range End' type="text" fullWidth onChange={e => this.setState({rack_num_end: e.target.value})} />
         </Grid>
       <Grid item xs={12}>
       <Button variant="contained" type="submit" color= "primary" onClick={() => this.handleSubmit} >Create +</Button>{' '}
        </Grid>
       </Grid>
    </form>
  </div>
    )
  }

}

export default CreateMultipleRacksForm