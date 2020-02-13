import React, {Component} from 'react'
import axios from 'axios'
import Select from 'react-select';
import {Autocomplete} from "@material-ui/lab"
import {Button, Container, TextField, Grid, Input, FormControl, Typography, Tooltip} from "@material-ui/core";
import {Redirect, Link} from 'react-router-dom'
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
        'ethernet_ports': null,
        'power_ports': null,
        'cpu': null,
        'memory': null,
        'storage': null,
        'comment': null,
      },
      vendorOptions: [],
      selectedVendorOption: null,
    }
  }

  loadVendors = () => {
    // MODEL
    let dst = '/api/models/vendors/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.vendors.length; i++) {
        myOptions.push(res.data.vendors[i]);
      }
      this.setState({vendorOptions: myOptions});
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

  handleSubmit = (e) => {
    if (e) e.preventDefault();

    let stateCopy = Object.assign({}, this.state.model);
    stateCopy.vendor = this.state.selectedVendorOption ? this.state.selectedVendorOption : null;
    let stateToSend = this.removeEmpty(stateCopy);

    axios.post('/api/models/', stateToSend)
      .then(function (response) {
        alert('Created successfully');
        window.location = '/models'
      })
      .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
    //this.props.sendShowTable(true);
  };

  handleChangeVendor = (event, selectedVendorOption) => {
    this.setState({selectedVendorOption});
  };


  render() {
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item alignContent='center' xs={12}/>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Create Model
                  </Typography>
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
                      <TextField {...params} label="Vendor" fullWidth/>
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
                  }}/>
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Height' type="number" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.height = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }}/>{' '}
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
                           }}/>{' '}
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Ethernet Ports' type="number" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.ethernet_ports = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }}/>{' '}
                </Grid>
                <Grid item xs={4}>
                  <TextField label='Power Ports' type="number" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.power_ports = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }}/>{' '}
                </Grid>

                <Grid item xs={4}>
                  <TextField label='Memory' type="number" helperText="RAM available in GB" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.memory = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }}/>{' '}
                </Grid>
                <Grid item xs={6}>
                  <TextField label='CPU' type="text" helperText="Describe the CPU" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.cpu = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }}/>{' '}
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Storage' type="text" helperText="Describe the storage" fullWidth onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.storage = e.target.value
                    this.setState({
                      model: modelCopy
                    })
                  }}/>{' '}
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Comment"
                             multiline
                             fullWidth
                             rows="4"
                             type="text"
                             onChange={e => {
                               let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                               instanceCopy.comment = e.target.value
                               this.setState({
                                 instance: instanceCopy
                               })
                             }}/>{' '}
                </Grid>
               <Grid item xs={2}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary" endIcon={<AddCircleIcon/>}
                            onClick={() => this.handleSubmit}>Create
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Link to={'/models'}>
                    <Tooltip title='Cancel'>
                      <Button variant="outlined" type="submit" color="primary" endIcon={<CancelIcon/>}>Cancel</Button>
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
