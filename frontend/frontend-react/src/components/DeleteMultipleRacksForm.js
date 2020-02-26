import React, {Component} from 'react'
import axios from 'axios'
import {
  Grid, Button, Container, Paper, ButtonGroup, Switch, FormControlLabel, TextField
} from "@material-ui/core"
import {Link, Redirect} from 'react-router-dom'
import Autocomplete from '@material-ui/lab/Autocomplete';
import DatacenterContext from './DatacenterContext';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DeleteMultipleRacksForm extends Component {
  constructor() {
    super();
    this.state = {
      'datacenter': null,
      'rack_num_start': null,
      'rack_num_start_valid': false,
      'rack_num_end': null,
      'rack_num_end_valid': false,
      redirect: false,
      datacenterOption: [],
      datacenterToIdMap: [],
      selectedDataCenterOption: null,
      redirect: false,
    }
  }

  componentDidMount() {
    console.log(this.context)
    this.loadDatacenters();
    this.setState({
      datacenter: '/api/datacenters/'.concat(this.context.datacenter_id).toString().concat('/'),
    })
    console.log(this.state.datacenter)
  }

  loadDatacenters = () => {
    // DCs
    let dst = '/api/datacenters/';
    axios.get(dst).then(res => {
      let myOptions = [];
      let myIds = [];
      let myIdMap = [];
      for(var i = 0; i < res.data.results.length; i++) {
        myOptions.push(res.data.results[i].abbreviation);
        myIds.push(res.data.results[i].id);
        var obj = {id: res.data.results[i].id, datacenter: res.data.results[i].abbreviation};

        myIdMap.push(obj);
      }
      this.setState({
        datacenterOptions: myOptions,
        datacenterToIdMap: myIdMap,
      });

    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model vendors. Re-login.\n' + JSON.stringify(error.response.data.result, null, 2));
      });
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleChangeDatacenter = (event, selectedDataCenterOption) => {
    if(selectedDataCenterOption!== null || selectedDataCenterOption!== undefined ){
      // console.log((this.state.datacenterToIdMap.find(x => x.datacenter === selectedDataCenterOption)))
      let id = this.state.datacenterToIdMap.find(x => x.datacenter === selectedDataCenterOption);
      if(id=== null || id=== undefined){
        //do nothing (doesn't work flipped idk why JS shit)
      }
      else{
        let dc = '/api/datacenters/'.concat(id.id).concat('/');
        this.setState({datacenter: dc});
      }
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let start_rack = this.state.rack_num_start;
    let end_rack = this.state.rack_num_end;
    let stateCopy = Object.assign({}, this.state);
    let stateToSend = this.removeEmpty(stateCopy);
    console.log(stateCopy)
    const validNumRegex = new RegExp("^[A-Z]\\d+$", 'i');
    var self = this;
    if (validNumRegex.test(start_rack) && validNumRegex.test(end_rack)) {
      axios.delete('/api/racks/many/', {
        data: stateToSend
      })
        .then(function (response) {
          console.log(response);
          let message = response.data.results;
          alert(response.data.results);
          self.setState({
            redirect: true,
          });
        })
        .catch(function (error) {
          alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
        });
    } else {
        alert("Rack Numbers must be specified by a Single Capital Letter Followed by Multiple Numbers.");
      return
    }
  }

  render() {
    let start_rack;
    let end_rack;
    return (
      <div>
      {this.state.redirect && <Redirect to= {{pathname: '/racks/'}}/>}
      <Container maxwidth="s">
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h1>Delete Racks</h1>
            </Grid>
            <Grid item xs={3}>
            <Autocomplete
                  freeSolo
                  autoComplete
                  autoHighlight
                  autoSelect
                  id="rack-datacenter-select"
                  noOptionsText={"Create New in DC tab"}
                  options={this.state.datacenterOptions}
                  onInputChange={this.handleChangeDatacenter}
                  defaultValue={this.context.datacenter_ab}
                  renderInput={params => (
                    <TextField {...params} label="Datacenter" fullWidth/>
                  )}
                />
            </Grid>
            <Grid item xs={3}>
              <TextField label='Deletion Range Start' type="text" fullWidth
                         onChange={e => this.setState({rack_num_start: e.target.value})}/>
            </Grid>
            <Grid item xs={3}>
              <TextField label='Deletion Range End' type="text" fullWidth
                         onChange={e => this.setState({rack_num_end: e.target.value})}/>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Delete
                -</Button>{' '}
              <Link to='/racks/'><Button variant="outlined">Cancel</Button>{' '}</Link>

            </Grid>
          </Grid>
        </form>
      </Container>
      </div>
    )
  }

}

DeleteMultipleRacksForm.contextType = DatacenterContext;

export default DeleteMultipleRacksForm