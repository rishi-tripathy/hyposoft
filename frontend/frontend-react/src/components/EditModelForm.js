import React, {Component} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {Button, Input, FormControl, Grid, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

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

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/models/'.concat(this.props.editID).concat('/');

    let stateCopy = Object.assign({}, this.state.model);
    stateCopy.vendor = this.state.selectedVendorOption ? this.state.selectedVendorOption : null;
    let stateToSend = this.removeEmpty(stateCopy);

    axios.put(dst, stateToSend)
      .then(function (response) {
        alert('Edit was successful');
      })
      .catch(function (error) {
        alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
    this.props.sendShowTable(true);
  }

  loadModel = () => {
    let dst = '/api/models/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
      let modelCopy = JSON.parse(JSON.stringify(this.state.model));
      modelCopy.vendor = res.data.vendor;
      modelCopy.model_number = res.data.model_number;
      modelCopy.height = res.data.height;
      modelCopy.display_color = res.data.display_color;
      modelCopy.ethernet_ports = res.data.ethernet_ports;
      modelCopy.power_ports = res.data.power_ports;
      modelCopy.cpu = res.data.cpu;
      modelCopy.memory = res.data.memory;
      modelCopy.storage = res.data.storage;
      modelCopy.comment = res.data.comment;
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
        selectedVendorOption: {value: this.state.model.vendor, label: this.state.model.vendor}
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

  handleChangeVendor = selectedVendorOption => {
    this.setState({selectedVendorOption});
  };

  render() {
    return (
      <div>
        <Button variant="outlined" onClick={() => this.props.sendShowTable(true)}>Back</Button>{' '}
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h1>Edit Model Form</h1>
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                autoComplete
                autoHighlight
                autoSelect
                shrink
                id="model-vendor-select"
                value={this.state.model.vendor}
                options={this.state.vendorOptions}
                onInputChange={this.handleChangeVendor}
                renderInput={params => (
                  <TextField {...params} label="Vendor" fullWidth/>
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
                         }}/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Height' type="number"
                         value={this.state.model.height}
                         InputLabelProps={{ shrink: true }}
                         fullWidth onChange={e => {
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
              <TextField label='Ethernet Ports' type="number" fullWidth
                         value={this.state.model.ethernet_ports}
                         InputLabelProps={{ shrink: true }}
                         onChange={e => {
                           let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                           modelCopy.ethernet_ports = e.target.value
                           this.setState({
                             model: modelCopy
                           })
                         }}/>{' '}
            </Grid>
            <Grid item xs={4}>
              <TextField label='Power Ports' type="number" fullWidth
                         value={this.state.model.power_ports}
                         InputLabelProps={{ shrink: true }}
                         onChange={e => {
                           let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                           modelCopy.power_ports = e.target.value
                           this.setState({
                             model: modelCopy
                           })
                         }}/>{' '}
            </Grid>

            <Grid item xs={4}>
              <TextField label='Memory' type="number" helperText="RAM available in GB" fullWidth
                         value={this.state.model.memory}
                         InputLabelProps={{ shrink: true }}
                         onChange={e => {
                           let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                           modelCopy.memory = e.target.value
                           this.setState({
                             model: modelCopy
                           })
                         }}/>{' '}
            </Grid>
            <Grid item xs={6}>
              <TextField label='CPU' type="text" helperText="Describe the CPU" fullWidth
                         value={this.state.model.cpu}
                         InputLabelProps={{ shrink: true }}
                         onChange={e => {
                           let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                           modelCopy.cpu = e.target.value
                           this.setState({
                             model: modelCopy
                           })
                         }}/>{' '}
            </Grid>
            <Grid item xs={6}>
              <TextField label='Storage' type="text" helperText="Describe the storage" fullWidth
                         value={this.state.model.storage}
                         InputLabelProps={{ shrink: true }}
                         onChange={e => {
                           let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                           modelCopy.storage = e.target.value
                           this.setState({
                             model: modelCopy
                           })
                         }}/>{' '}
            </Grid>
            <Grid item xs={12}>
              <TextField label="Comment"
                         multiline value={this.state.model.comment}
                         InputLabelProps={{ shrink: true }}
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
            <Grid item xs={12}>
              <Button variant="contained" type="submit" color="primary"
                      onClick={() => this.handleSubmit}>Update</Button>{' '}
            </Grid>
          </Grid>
        </form>
      </div>
    )
  }
}

EditModelForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditModelForm
