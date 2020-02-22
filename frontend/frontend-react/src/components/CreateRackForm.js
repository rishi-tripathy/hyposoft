import React, {Component} from 'react'
import axios from 'axios'
import {
  Grid, Button, Container, TextField, Paper, ButtonGroup, Switch, FormControlLabel, Typography
} from "@material-ui/core"
import {Link} from 'react-router-dom'
import DatacenterContext from './DatacenterContext';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateRackForm extends Component {
  constructor() {
    super();
    this.state = {
      'id': null,
      'rack_number': null,
      'rack_num_start': null,
      'rack_num_start_valid': false,
      'rack_num_end': null,
      'rack_num_end_valid': false,
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

    // let singleFirstState = Object.assign({}, this.state.id);
    // let singleStateCopy = Object.assign(singleFirstState, this.state.rackNumber);
    let stateCopy = Object.assign({}, this.state);
    console.log(stateCopy);

    let stateToSend = this.removeEmpty(stateCopy);

    // let multipleFirstState = Object.assign({}, this.state.rack_num_start)

    const validNumRegex = new RegExp("^[A-Z]\\d+$", 'i');

    if(start_rack !== null && (end_rack == null || end_rack === '')){
      if ((validNumRegex.test(start_rack))) {
        axios.post('/api/racks/', stateToSend)
          .then(function (response) {
            alert('Creation of ' + start_rack + ' was successful.');
          window.location = '/racks'
          })
          .catch(function (error) {
            alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
          });
      } else {
        // console.log(this.state.rack_number);
        alert("Rack Numbers must be specified by a Single Letter Followed by Multiple Numbers.");
      }
    }
    else if(start_rack !== null && end_rack !== null){
      if ((validNumRegex.test(start_rack) && validNumRegex.test(end_rack))) {
        axios.post('/api/racks/many/', stateToSend)
          .then(function (response) {
            let message = response.data.results;
            alert(response.data.results);
            window.location = '/racks'
          })
          .catch(function (error) {
            alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
          });
      } else {
        alert("Rack Numbers must be specified by a Single Letter Followed by Multiple Numbers.");
      }
    }
  }

  getDefaultDC = () => {
    axios.get('/api/datacenters/').then(res => {
      //loop through and check matching context
      for(var i = 0; i <= res.data.count; i++){
        if(res.data.results[i].id === this.context.datacenter){
          return res.data.results[i].abbreviation;
        }
      }
    })
  }

  render() {
    let defaultDC = this.getDefaultDC();
    return (
      <div>
      <Container maxwidth="xl">
        <Grid container className="themed-container" spacing={2} />
          <Grid item alignContent='center' xs={12}>
            <form onSubmit={this.handleSubmit} action='/racks/'>>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <h1>Create Rack(s)</h1>
                </Grid>
                <Grid item xs={12}>
                  <p>Enter a valid rack number (i.e. "A1) the first field to create a single rack. Enter a valid rack number in the second field to create a range of racks. </p>
                </Grid>
              <Grid item xs={3}>
              <TextField label='Datacenter' type="text" fullWidth
                 defaultValue={defaultDC}
                         onChange={e => this.setState({datacenter: e.target.value})}/>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Creation Range Start' type="text" fullWidth
                         onChange={e => this.setState({rack_num_start: e.target.value, rack_number: e.target.value})}/>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Creation Range End (optional)' type="text" fullWidth
                         onChange={e => this.setState({rack_num_end: e.target.value})}/>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Create
                +</Button>{' '}
              <Link to='/racks/'><Button variant="outlined">Cancel</Button>{' '}</Link>
            </Grid>
          </Grid>
        </form>
      </Grid>
      </Container>
      </div>
    )
  }

}

CreateRackForm.contextType = DatacenterContext;

export default CreateRackForm