import React, { Component } from 'react'
import axios from 'axios'
import { Button, TextField, Grid, Input, Container, FormControl } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class InstanceFilters extends Component {

  constructor() {
    super();
    this.state = {
      modelOptions: [],
      selectedModelOption: null,

      // rackOptions: [],
      // selectedRackOption: null,

      ownerOptions: [],
      selectedOwnerOption: null,

      datacenterOptions: [],
      selectedDatacenterOption: null,

      identifiers: {
        datacenterID: '',
        modelID: '',
        modelNumber: '',
        modelVendor: '',
        hostname: '',
        rackID: '',
        rack_u: '',
        ownerID: '',
        rackStart: '',
        rackEnd: '',
      },
      query: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  mountModelNames = () => {
    // MODEL NAMES
    let dst = '/api/assets/model_names/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      //console.log(res.data)
      this.setState({ modelOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  mountDatacenters = () => {
    // MODEL NAMES
    let dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].abbreviation });
      }
      //console.log(res.data)
      this.setState({ datacenterOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  // mountRacks = () => {
  //   // RACK
  //   let dst = '/api/racks/?show_all=true';
  //   axios.get(dst).then(res => {
  //     let myOptions = [];
  //     for (let i = 0; i < res.data.length; i++) {
  //       myOptions.push({value: res.data[i].id, label: res.data[i].rack_number});
  //     }
  //     //console.log(res.data)
  //     this.setState({rackOptions: myOptions});
  //   })
  //     .catch(function (error) {
  //       // TODO: handle error
  //       alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
  //     });
  // }

  mountOwners = () => {
    // OWNER
    let dst = '/api/users/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].username });
      }
      //console.log(res.data)
      this.setState({ ownerOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    this.mountModelNames();
    //this.mountRacks();
    this.mountDatacenters();
    this.mountOwners();
  }

  handleChangeModel = (event, selectedModelOption, reason) => {
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers));
    identifiersCopy.modelID = (selectedModelOption ? selectedModelOption.value : '')
    this.setState({
      selectedModelOption,
      identifiers: identifiersCopy,
    })
  };

  handleChangeDatacenter = (event, selectedDatacenterOption, reason) => {
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers));
    identifiersCopy.datacenterID = (selectedDatacenterOption ? selectedDatacenterOption.value : '')
    this.setState({
      selectedDatacenterOption,
      identifiers: identifiersCopy,
    })
  };

  // handleChangeRack = (event, selectedRackOption) => {
  //   let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
  //   identifiersCopy.rackID = (selectedRackOption ? selectedRackOption.value : '')
  //   this.setState({
  //     selectedRackOption,
  //     identifiers: identifiersCopy,
  //   })
  // };

  handleChangeOwner = (event, selectedOwnerOption) => {
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
    identifiersCopy.ownerID = (selectedOwnerOption ? selectedOwnerOption.value : '')
    this.setState({
      selectedOwnerOption,
      identifiers: identifiersCopy,
    })
  };

  createQuery = () => {
    const { datacenterID, modelID, modelNumber, modelVendor, hostname, rackID, rack_u, ownerID, rackStart, rackEnd } = this.state.identifiers;
    let q = '' +
      'datacenter=' + datacenterID + '&' +
      'model=' + modelID + '&' +
      'model_number=' + modelNumber + '&' +
      'vendor=' + modelVendor + '&' +
      'hostname=' + hostname + '&' +
      'rack=' + rackID + '&' +
      'rack_u=' + rack_u + '&' +
      'owner=' + ownerID + '&' +
      'rack_num_start=' + rackStart + '&' +
      'rack_num_end=' + rackEnd;
    this.setState({ query: q });
    return q;
  }

  handleClear = (e) => {
    let identifiersEmpty = {
      identifiers: {
        datacenterID: '',
        modelID: '',
        modelNumber: '',
        modelVendor: '',
        hostname: '',
        rackID: '',
        rack_u: '',
        ownerID: '',
        rackStart: '',
        rackEnd: '',
      },
    }
    this.setState({
      selectedModelOption: null,
      //selectedRackOption: null,
      selectedOwnerOption: null,
      selectedDatacenterOption: null,
      identifiers: identifiersEmpty,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let stateCopy = Object.assign({}, this.state.identifiers);
    let stateToSend = this.removeEmpty(stateCopy);

    console.log(stateToSend)
    console.log(this.createQuery())

    this.props.sendFilterQuery(this.createQuery());
  }

  render() {
    return (
      <div>
        <Container maxWidth="xl">
          <form onSubmit={this.handleSubmit}>
            <h4>Filters</h4>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Autocomplete
                  autoComplete
                  autoHighlight
                  id="instance-create-model-select"
                  options={this.state.modelOptions}
                  getOptionLabel={option => option.label}
                  onChange={this.handleChangeModel}
                  value={this.state.selectedModelOption}
                  renderInput={params => (
                    <TextField {...params} label="Model" fullWidth />
                  )}
                />
              </Grid>
              {/* <Grid item xs={3}>
                <Autocomplete
                  autoComplete
                  autoHighlight
                  id="instance-create-dc-select"
                  options={this.state.datacenterOptions}
                  getOptionLabel={option => option.label}
                  onChange={this.handleChangeDatacenter}
                  value={this.state.selectedDatacenterOption}
                  renderInput={params => (
                    <TextField {...params} label="Datacenter" fullWidth />
                  )}
                />
              </Grid> */}
              <Grid item xs={3}>
                <TextField label='Model Vendor' type="text" fullWidth
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.modelVendor = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>
              <Grid item xs={3}>
                <TextField label='Model Number' type="text" fullWidth
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.modelNumber = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>
              <Grid item xs={3}>
                <TextField label='Hostname' type="text" fullWidth
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.hostname = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>
              {/*<Grid item xs={3}>*/}
              {/*  <Autocomplete*/}
              {/*    autoComplete*/}
              {/*    autoHighlight*/}
              {/*    id="instance-create-rack-select"*/}
              {/*    options={this.state.rackOptions}*/}
              {/*    getOptionLabel={option => option.label}*/}
              {/*    onChange={ this.handleChangeRack }*/}
              {/*    value={this.state.selectedRackOption}*/}
              {/*    renderInput={params => (*/}
              {/*      <TextField {...params} label="Rack" fullWidth/>*/}
              {/*    )}*/}
              {/*  />*/}
              {/*</Grid>*/}
              <Grid item xs={3}>
                <TextField label='Rack Range Start' type="text" fullWidth
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.rackStart = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>

              <Grid item xs={3}>
                <TextField label='Rack Range End' type="text" fullWidth
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.rackEnd = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>
              <Grid item xs={3}>
                <TextField label='Rack U' type="number" fullWidth
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.rack_u = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  id="instance-owner-select"
                  autoComplete
                  autoHighlight
                  options={this.state.ownerOptions}
                  getOptionLabel={option => option.label}
                  onChange={this.handleChangeOwner}
                  value={this.state.selectedOwnerOption}
                  renderInput={params => (
                    <TextField {...params} label="Owner" fullWidth />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                
              </Grid>

              <Grid item xs={2}>
                <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Apply
                  Filters</Button>
              </Grid>
              {/*<Grid item xs={2}>*/}
              {/*  <Button variant="outlined" type="submit" color="primary" onClick={ () => this.handleClear }>Clear Filters</Button>*/}
              {/*</Grid>*/}
            </Grid>
          </form>
        </Container>
      </div>

    )
  }
}

export default InstanceFilters
