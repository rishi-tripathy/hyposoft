import React, {Component} from 'react'
import axios from 'axios'
import {Autocomplete} from "@material-ui/lab"
import {
  Grid, Button, Container, TextField, Paper, ButtonGroup, Switch, FormControlLabel, Typography
} from "@material-ui/core"
import {Link, Redirect} from 'react-router-dom'
import DatacenterContext from './DatacenterContext';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateRackForm extends Component {
  constructor() {
    super();
    this.state = {
      'id': null,
      'datacenter': null,
      'rack_number': null,
      'rack_num_start': null,
      'rack_num_start_valid': false,
      'rack_num_end': null,
      'rack_num_end_valid': false,
      datacenterOptions: [],
      datacenterToIdMap: [],
      selectedDataCenterOption: null,
      redirect: false,
    }
  }

  componentDidMount() {
    this.loadDatacenters();
    this.setState({
      datacenter: '/api/datacenters/'.concat(this.context.datacenter_id).toString().concat('/'),
    })
    console.log(this.state.datacenter)
  }

  loadDatacenters = () => {
    // DCs
    let dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      let myIds = [];
      let myIdMap = [];
      for(var i = 0; i < res.data.length; i++) {
        myOptions.push(res.data[i].abbreviation);
        myIds.push(res.data[i].id);
        var obj = {id: res.data[i].id, datacenter: res.data[i].abbreviation};

        myIdMap.push(obj);
      }
      this.setState({
        datacenterOptions: myOptions,
        datacenterToIdMap: myIdMap,
      });

    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not datacenters.\n' + JSON.stringify(error.response.data.result, null, 2));
      });
  }

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

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // console.log(this.state.datacenter)

    let start_rack = this.state.rack_num_start;
    let end_rack = this.state.rack_num_end;

    let stateCopy = Object.assign({}, this.state);
    console.log(stateCopy);

    let stateToSend = this.removeEmpty(stateCopy);
    const validNumRegex = new RegExp("^[A-Z]\\d+$", 'i');
    var self = this;

    if(start_rack !== null && (end_rack == null || end_rack === '')){
      if ((validNumRegex.test(start_rack))) {
        axios.post('/api/racks/', stateToSend)
          .then(function (response) {
            if(response)
            alert('Creation of ' + start_rack + ' was successful.');
            self.setState({
              redirect:true,
            });
          })
          .catch(function (error) {
            console.log(error.response.data)
            alert('Creation was not successful.\n' + JSON.stringify(error.response.data.non_field_errors, null, 2));
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
            alert('Succesfully created '+response.data.results.successfully_created
            + '\n Failed to create: ' +response.data.results.failed_to_create);
            self.setState({
              redirect:true,
            });
          })
          .catch(function (error) {
            alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
          });
      } else {
        alert("Rack Numbers must be specified by a Single Letter Followed by Multiple Numbers.");
      }
    }
  }

  render() {
    // console.log(this.context.datacenter_ab)

    let defVal;

    if(this.context.datacenter_id === -1){
      defVal = '';
    }
    else{
      defVal = this.context.datacenter_ab;
    }

    console.log(this.state.redirect)
    let content;

    if(this.state.redirect){
      return <Redirect to = {{ pathname: "/racks" }} />;
    }
    else{
      content = <Container maxwidth="xl">
      <Grid container className="themed-container" spacing={2} />
        <Grid item alignContent='center' xs={12}>
          <form onSubmit={this.handleSubmit} action='/racks/'>>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h1>Create Rack(s)</h1>
              </Grid>
              <Grid item xs={12}>
                <p>Enter a valid rack number (i.e. "A1") the first field to create a single rack. Enter a valid rack number in the second field to create a range of racks. </p>
              </Grid>
            <Grid item xs={3}>
            {/* < label='Datacenter' type="text" fullWidth
               defaultValue={defaultDC}
                       onChange={e => this.setState({datacenter: '/api/datacenters/'+e.target.value+'/'})}/> */}
                <Autocomplete
                  freeSolo
                  autoComplete
                  autoHighlight
                  autoSelect
                  id="rack-datacenter-select"
                  noOptionsText={"Create New in DC tab"}
                  options={this.state.datacenterOptions}
                  onInputChange={this.handleChangeDatacenter}
                  defaultValue={defVal}
                  renderInput={params => (
                    <TextField {...params} label="Datacenter" fullWidth/>
                  )}
                />
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
    </Container>;
    }

    return (
      <div>
     {content}
      </div>
    )
  }

}

CreateRackForm.contextType = DatacenterContext;

export default CreateRackForm
