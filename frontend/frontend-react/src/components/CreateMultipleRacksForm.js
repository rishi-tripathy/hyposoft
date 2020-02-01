import React, { Component } from 'react'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateMultipleRacksForm extends Component {
    constructor() {
        super();
        this.state = {
        'start_rack_letter': null,
        'end_rack_letter' : null,
        'start_rack_num' : null,
        'end_rack_num' : null,
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

        let start_rack = this.state.start_rack;
        let end_rack = this.state.end_rack;
        let stateCopy = Object.assign({}, this.state);
        let stateToSend = this.removeEmpty(stateCopy);

        // for(var i: )
        
        axios.post('/api/racks/', stateToSend)
        .then(function (response) {
        alert('Created successfully');
        })
        .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data));
    });
  }
  
  render() {
    let start_rack;
    let end_rack;
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Create rackSSSS form</h3>
        <p>Start Rack Letter </p> <input type="text" onChange={this.setState(this.state.start_rack_letter)} />
        <p>End Rack Letter </p> <input type="text" onChange={this.setState(this.state.end_rack_letter)} />
        {console.log(this.state.start_rack_letter)}
        {console.log(this.state.end_rack_letter)}
        <p>Start Rack Number</p> <input type="number" onChange={this.setState(this.state.end_rack)} />
        <p>End Rack Number</p> <input type="number" onChange={this.setState(this.state.end_rack)} />
        {console.log(this.state.start_rack_num)}
        {console.log(this.state.end_rack_num)}
        <input type="submit" value="Submit" />
      </form>
    )
  }

}

export default CreateMultipleRacksForm