import React, { Component } from 'react'
import axios from 'axios'
import { Autocomplete } from "@material-ui/lab"
import {Container, Button, FormGroup, makeStyles, TextField, Grid} from "@material-ui/core";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class CreateInstanceForm extends Component {
  
  constructor() {
    super();
    this.state = {
      instance: {
        model: null,
        hostname: null,
        rack: null,
        rack_u: null,
        owner: null,
        comment: null,
      },
      modelOptions: [],
      selectedModelOption: null,

      rackOptions: [], 
      selectedRackOption: null,

      ownerOptions: [],
      selectedOwnerOption: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    if (e) e.preventDefault();

    let stateCopy = Object.assign({}, this.state.instance);
    stateCopy.model = this.state.selectedModelOption ? this.state.selectedModelOption.value : null;
    stateCopy.rack = this.state.selectedRackOption ? this.state.selectedRackOption.value : null;
    stateCopy.owner = this.state.selectedOwnerOption ? this.state.selectedOwnerOption.value : null;
    let stateToSend = this.removeEmpty(stateCopy);
   

    axios.post('/api/instances/', stateToSend)
    .then(function (response) {
      alert('Created successfully');
    })
    .catch(function (error) {
      alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    });
    this.props.sendShowTable(true);
  }

  componentDidMount() {
    // MODEL
    let dst = '/api/instances/model_names/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      this.setState({ modelOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });

    // RACK
    dst = '/api/racks/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].rack_number });
      }
      this.setState({ rackOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Could not load racks. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });

    // OWNER
    dst = '/api/users/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].username });
      }
      this.setState({ ownerOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  handleChangeModel = (event, selectedModelOption)=> {
    this.setState({ selectedModelOption });
  };

  handleChangeRack =  (event, selectedRackOption) => {
    this.setState({ selectedRackOption });
  };

  handleChangeOwner = (event, selectedOwnerOption) => {
    this.setState({ selectedOwnerOption });
  };


  render() {
    return (
    <div>
      <Button variant="outlined" onClick={() => this.props.sendShowTable(true)} >Back</Button>{' '}
          <form onSubmit={this.handleSubmit}>
      <Grid container spacing={1}>
          <Grid item xs={12}>
          <h1>Create an Instance</h1>
          </Grid>
          <Grid item xs={6}>
              <Autocomplete
                id="instance-model-select"
                options={this.state.modelOptions}
                getOptionLabel={option => option.label}
                onChange={ this.handleChangeModel }
                value={this.state.selectedModelOption}
                renderInput={params => (
                  <TextField {...params} label="Model" fullWidth/>
                )}
              />
          </Grid>
        <Grid item xs={6}>
              <TextField label = 'Hostname' type="text" fullWidth onChange={e => {
                let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                instanceCopy.hostname = e.target.value
                this.setState({
                  instance: instanceCopy 
                }) 
              } } />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            id="instance-rack-select"
            options={this.state.rackOptions}
            getOptionLabel={option => option.label}
            onChange={ this.handleChangeRack }
            value={this.state.selectedRackOption}
            renderInput={params => (
              <TextField {...params} label="Rack" fullWidth/>
            )}
          />
      </Grid>
      <Grid item xs={6}>
        < TextField label="Rack U"
                    fullWidth
                    type="number"
                    onChange={e => {
                    let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                    instanceCopy.rack_u = e.target.value
                    this.setState({
                      instance: instanceCopy
                    })
        } } />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
        id="instance-owner-select"
        options={this.state.ownerOptions}
        getOptionLabel={option => option.label}
        onChange={ this.handleChangeOwner}
        value={this.state.selectedOwnerOption}
        renderInput={params => (
          <TextField {...params} label="Owner" fullWidth/>
        )}
      />
      </Grid>
      <Grid item xs={6}>
        <TextField label = "Comment"
                   fullWidth
                   multiline
                   rows="4"
                   type="text"
                   onChange={e => {
                  let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                  instanceCopy.comment = e.target.value
                  this.setState({
                    instance: instanceCopy
                  })
        } } />
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

export default CreateInstanceForm
