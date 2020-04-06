import React, { Component } from 'react'
import axios from 'axios'
import { Autocomplete } from "@material-ui/lab"
import {
  Button, Container, TextField,
  Grid, Input, FormControl, Typography,
  Tooltip, Paper, List,
  ListItem, Card, CardContent,
  FormLabel, RadioGroup, FormControlLabel, Radio,
} from "@material-ui/core";
import { Redirect, Link } from 'react-router-dom'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from '@material-ui/icons/Cancel';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateModelForm extends Component {

  constructor() {
    super();
    this.state = {
      model: {
        'vendor': null,
        'model_number': null,
        'height': null,
        'display_color': 'ffffff',
        'network_ports': [],
        'network_ports_num': null,
        'power_ports': null,
        'cpu': null,
        'memory': null,
        'storage': null,
        'comment': null,
      },
      vendorOptions: [],
      selectedVendorOption: null,

      networkPorts: null,

      redirect: false,

      modelType: 'normal',
    }
  }

  loadVendors = () => {
    let dst = '/api/models/vendors/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.vendors.length; i++) {
        myOptions.push(res.data.vendors[i]);
      }
      this.setState({ vendorOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model vendors. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    this.loadVendors();
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  fillInEmptyDefaultNPNames = () => {
    let tmp = this.state.model.network_ports.slice(); //creates the clone of the state
    for (let i = 0; i < this.state.networkPorts; i++) {
      let num = i + 1;
      if (!tmp[i]) {
        tmp[i] = num.toString();
      }
    }

    // // reformatting the JSON object
    // for (let i = 0; i < this.state.networkPorts; i++) {
    //   let obj = JSON.parse('{ "mac": null, "name": "' + tmp[i] + '", "connection": {} }')
    //   console.log(obj)
    //   tmp[i] = obj;
    // }

    return tmp
  }

  handleSubmit = (e) => {
    if (e) e.preventDefault();

    let stateCopy = Object.assign({}, this.state.model);
    stateCopy.vendor = this.state.selectedVendorOption ? this.state.selectedVendorOption : null;
    stateCopy.network_ports = this.fillInEmptyDefaultNPNames();
    stateCopy.network_ports_num = this.state.networkPorts;
    console.log(stateCopy.network_ports_num)
    let stateToSend = this.removeEmpty(stateCopy);
    console.log(stateToSend)
    // make sure there are no empty default values
    //console.log(this.fillInEmptyDefaultNPNames());



    //THE API CALL TO POST
    // var self = this;
    // axios.post('/api/models/', stateToSend)
    //   .then(function (response) {
    //     alert('Created successfully');
    //     // window.location = '/models'
    //     self.setState({
    //       redirect: true,
    //     });

    //   })
    //   .catch(function (error) {
    //     alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    //   });
  };

  handleChangeVendor = (event, selectedVendorOption) => {
    this.setState({ selectedVendorOption });
  };

  handleChangeNP = (e) => {
    this.setState({
      networkPorts: e.target.value,
    })
    this.clearNetworkPortNames();
  }

  clearNetworkPortNames = () => {
    let stateCopy = Object.assign({}, this.state.model);
    stateCopy.network_ports = [];
    this.setState({
      model: stateCopy
    })
  }

  openNetworkPortFields = () => {
    let fieldList = [];
    // if (!this.state.networkPorts || this.state.networkPorts == 0) {
    //   return fieldList;
    // }

    for (let i = 0; i < this.state.networkPorts; i++) {
      const num = i + 1;
      const fieldLabel = 'Network Port ' + num + ' name';
      fieldList.push(
        <ListItem>
          <TextField label={fieldLabel}
            type="text"
            // set its value
            //value={this.state.networkPortNames[i]}
            //placeholder={num}
            defaultValue={num}
            fullWidth onChange={e => {
              //let tmp = this.state.model.network_ports.slice(); //creates the clone of the state
              let stateCopy = Object.assign({}, this.state.model);
              stateCopy.network_ports[i] = e.target.value;
              this.setState({ model: stateCopy });
            }} />
        </ListItem>
      )
    }
    return fieldList;
  }

  handleModelTypeChange = (event) => {
    this.setState({ modelType: event.target.value });
  }

  render() {
    return (
      <div>
        {this.state.redirect && <Redirect to={{ pathname: '/models' }} />}
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item alignContent='center' xs={12} />
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Create Model
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      <Typography variant="h6" gutterBottom>
                        Model Type
                      </Typography>
                    </FormLabel>
                    <RadioGroup aria-label="permissions" name="permissions" value={this.state.modelType}
                      onChange={this.handleModelTypeChange}>
                      <FormControlLabel value='normal' control={<Radio />} label="Normal Rack Mount" />
                      <FormControlLabel value='chassis' control={<Radio />} label="Blade Chassis" />
                      <FormControlLabel value='blade' control={<Radio />} label="Blade Server" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    freeSolo
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="model-vendor-select"
                    noOptionsText={"Create New"}
                    options={this.state.vendorOptions}
                    onInputChange={this.handleChangeVendor}
                    renderInput={params => (
                      <TextField {...params} label="Vendor" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Model Number' type="text" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.model_number = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Height' type="number" fullWidth disabled={this.state.modelType === 'blade'}
                    onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.height = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />{' '}
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Input type="color" name="Display Color" startAdornment="Display Color"
                      value={'#' + this.state.model.display_color}
                      onChange={e => {
                        let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                        modelCopy.display_color = e.target.value.replace('#', '');
                        this.setState({
                          model: modelCopy
                        })
                      }} />{' '}
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Network Ports' type="number" fullWidth disabled={this.state.modelType === 'blade'}
                    onChange={e => {
                      this.handleChangeNP(e);
                    }} />{' '}

                  <List style={{ maxHeight: 200, overflow: 'auto' }}>
                    {this.openNetworkPortFields()}
                  </List>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Power Ports' type="number" fullWidth disabled={this.state.modelType === 'blade'}
                    onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.power_ports = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />{' '}
                </Grid>

                <Grid item xs={4}>
                  <TextField label='Memory' type="number" helperText="RAM available in GB" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.memory = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }} />{' '}
                </Grid>
                <Grid item xs={6}>
                  <TextField label='CPU' type="text" helperText="Describe the CPU" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.cpu = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }} />{' '}
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Storage' type="text" helperText="Describe the storage" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.storage = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }} />{' '}
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Comment"
                    multiline
                    fullWidth
                    rows="4"
                    type="text"
                    onChange={e => {
                      let instanceCopy = JSON.parse(JSON.stringify(this.state.model))
                      instanceCopy.comment = e.target.value
                      this.setState({
                        model: instanceCopy
                      })
                    }} />{' '}
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary" endIcon={<AddCircleIcon />}
                      onClick={() => this.handleSubmit}>Create
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Link to={'/models'}>
                    <Tooltip title='Cancel'>
                      <Button variant="outlined" type="submit" color="primary" endIcon={<CancelIcon />}>Cancel</Button>
                    </Tooltip>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default CreateModelForm
