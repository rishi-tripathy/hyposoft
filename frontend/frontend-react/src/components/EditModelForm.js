import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {
  Button, Container, TextField,
  Grid, Input, FormControl, List,
  ListItem, Typography, Tooltip,
  FormLabel, Radio, RadioGroup, FormControlLabel,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Link, Redirect } from "react-router-dom";
import CancelIcon from '@material-ui/icons/Cancel';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditModelForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      model: {
        'vendor': null,
        'model_number': null,
        'height': null,
        'display_color': null,
        'network_ports': [],
        'network_ports_num': null,
        'power_ports': null,
        'cpu': null,
        'memory': null,
        'storage': null,
        'comment': null,
        'mount_type': null,
      },
      vendorOptions: [],
      selectedVendorOption: null,

      //networkPorts: null,
      redirect: false,
    }
  }

  loadModel = () => {
    let dst = '/api/models/'.concat(this.props.match.params.id).concat('/');
    axios.get(dst).then(res => {
      let modelCopy = JSON.parse(JSON.stringify(this.state.model));
      modelCopy.vendor = res.data.vendor;
      modelCopy.model_number = res.data.model_number;
      modelCopy.height = res.data.height;
      modelCopy.display_color = res.data.display_color;
      modelCopy.network_ports = res.data.network_ports;
      modelCopy.network_ports_num = res.data.network_ports_num;
      modelCopy.power_ports = res.data.power_ports;
      modelCopy.cpu = res.data.cpu;
      modelCopy.memory = res.data.memory;
      modelCopy.storage = res.data.storage;
      modelCopy.comment = res.data.comment;
      modelCopy.mount_type = res.data.mount_type;
      this.setState({
        model: modelCopy,
      })
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadVendors = () => {
    // VENDOR
    let dst = '/api/models/vendors/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.vendors.length; i++) {
        myOptions.push(res.data.vendors[i]);
      }
      console.log(myOptions)
      this.setState({
        vendorOptions: myOptions,
        selectedVendorOption: { value: this.state.model.vendor, label: this.state.model.vendor }
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    const delay = 50;
    this.loadModel();
    setTimeout(() => {
      this.loadVendors();
    }, delay);
  }

  handleChangeVendor = (event, selectedVendorOption) => {
    this.setState({ selectedVendorOption });
  };

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/models/'.concat(this.props.match.params.id).concat('/');

    let stateCopy = Object.assign({}, this.state.model);
    stateCopy.network_ports = this.fillInEmptyDefaultNPNames()
    let stateToSend = this.removeEmpty(stateCopy);

    if (stateCopy.mount_type === 'blade') {
      stateCopy.network_ports = []
      stateCopy.network_ports_num = "0"
      stateCopy.power_ports = "0"
      stateCopy.height = "1"
    }

    console.log(stateToSend)
    var self = this;

    axios.put(dst, stateToSend)
      .then(function (response) {
        alert('Edit was successful');
        // window.location = '/models'
        self.setState({
          redirect: true,
        });
      })
      .catch(function (error) {
        alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  handleChangeNP = (e) => {
    let modelCopy = Object.assign({}, this.state.model);
    modelCopy.network_ports_num = e.target.value
    this.setState({
      model: modelCopy
    })
    //this.clearNetworkPortNames();
  }

  fillInEmptyDefaultNPNames = () => {
    let tmp = this.state.model.network_ports.slice(); //creates the clone of the state
    for (let i = 0; i < this.state.model.network_ports_num; i++) {
      let num = i + 1;
      if (!tmp[i]) {
        tmp[i] = num.toString();
      }
    }
    return tmp
  }

  openNetworkPortFields = () => {
    let fieldList = [];
    // if (!this.state.networkPorts || this.state.networkPorts == 0) {
    //   return fieldList;
    // }

    for (let i = 0; i < this.state.model.network_ports_num; i++) {
      const num = i + 1;
      const fieldLabel = 'Network Port ' + num + ' name';
      fieldList.push(
        <ListItem>
          <TextField label={fieldLabel}
            type="text"
            // set its value
            value={this.state.model.network_ports[i]}
            disabled={this.state.model.mount_type === 'blade'}

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

  render() {
    return (
      <div>
        {this.state.redirect && <Redirect to={{ pathname: '/models' }} />}
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Edit Model
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      <Typography variant="h6" gutterBottom>
                        Model Type
                      </Typography>
                    </FormLabel>
                    <RadioGroup aria-label="permissions" name="permissions" value={this.state.model.mount_type}
                      //onChange={this.handleModelTypeChange} 
                      onChange={e => {
                        let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                        modelCopy.mount_type = e.target.value
                        this.setState({
                          model: modelCopy
                        })
                      }}
                    >
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
                    shrink
                    id="model-vendor-select"
                    noOptionsText={"Create New"}
                    options={this.state.vendorOptions}
                    onInputChange={this.handleChangeVendor}
                    //defaultValue={this.state.model.vendor}
                    //value={this.state.selectedVendorOption}
                    value={this.state.model.vendor}
                    renderInput={params => (
                      <TextField {...params} label="Vendor" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Model Number' type="text" fullWidth
                    value={this.state.model.model_number}
                    InputLabelProps={{ shrink: true }}
                    onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.model_number = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Height' type="number"
                    value={this.state.model.height}
                    disabled={this.state.model.mount_type === 'blade'}
                    InputLabelProps={{ shrink: true }}
                    fullWidth onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.height = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />
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
                      }} />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Network Ports' type="number" fullWidth
                    disabled={this.state.model.mount_type === 'blade'}
                    InputLabelProps={{ shrink: true }}
                    value={this.state.model.network_ports_num}
                    onChange={e => {
                      this.handleChangeNP(e);
                    }} />{' '}

                  <List style={{ maxHeight: 200, overflow: 'auto' }}>
                    {this.openNetworkPortFields()}
                  </List>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Power Ports' type="number" fullWidth
                    disabled={this.state.model.mount_type === 'blade'}
                    InputLabelProps={{ shrink: true }}
                    value={this.state.model.power_ports}
                    onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.power_ports = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />
                </Grid>

                <Grid item xs={4}>
                  <TextField label='Memory' type="number"
                    fullWidth
                    value={this.state.model.memory}
                    InputLabelProps={{ shrink: true }}
                    onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.memory = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='CPU' type="text" fullWidth
                    value={this.state.model.cpu}
                    InputLabelProps={{ shrink: true }}
                    onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.cpu = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Storage' type="text" fullWidth
                    value={this.state.model.storage}
                    InputLabelProps={{ shrink: true }}
                    onChange={e => {
                      let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                      modelCopy.storage = e.target.value
                      this.setState({
                        model: modelCopy
                      })
                    }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Comment"
                    multiline value={this.state.model.comment}
                    InputLabelProps={{ shrink: true }}
                    rows="4"
                    type="text"
                    onChange={e => {
                      let instanceCopy = JSON.parse(JSON.stringify(this.state.model))
                      instanceCopy.comment = e.target.value
                      this.setState({
                        model: instanceCopy
                      })
                    }} />
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary" endIcon={<AddCircleIcon />}
                      onClick={() => this.handleSubmit}>Update
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

EditModelForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditModelForm
