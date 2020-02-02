import React, { Component } from 'react'
import axios from 'axios'
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
      <form onSubmit={this.handleSubmit}>
        <h3>Create Racks</h3>
        <p>Start Rack Number </p> <input type="text" onChange={e => this.setState({rack_num_start: e.target.value})} />
        {/* validate that it's one letter followed by numbers */}
        <p>End Rack Number </p> <input type="text" onChange={e => this.setState({rack_num_end: e.target.value})} />
        {console.log(this.state)}
        <input type="submit" value="Submit" />
      </form>
    )
  }

}

export default CreateMultipleRacksForm