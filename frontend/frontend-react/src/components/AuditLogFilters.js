import React, { Component } from 'react'
import { Autocomplete } from "@material-ui/lab"
import { Button, TextField, Grid, Input, Container, FormControl } from "@material-ui/core";

export class AuditLogFilters extends Component {

  constructor() {
    super();
    this.state = {
      identifiers: {
        user: '',
        asset: '',
      },
      query: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  createQuery = () => {
    const { user, asset } = this.state.identifiers;
    console.log(this.state.identifiers)
    
    // NO '?' here!!
    let q = '' +
      'vendor=' + vendor + '&' +
      'model_number=' + model_number + '&' +
      'height_min=' + (height_min == '' && height_max == '' ? '' : (height_min ? height_min : '0')) + '&' +
      'height_max=' + (height_min == '' && height_max == '' ? '' : (height_max ? height_max : '42')) + '&' +
      'display_color=' + display_color + '&' +
      'network_ports_num_min=' + (network_ports_num_min == '' && network_ports_num_max == '' ? '' : (network_ports_num_min ? network_ports_num_min : '0')) + '&' +
      'network_ports_num_max=' + (network_ports_num_min == '' && network_ports_num_max == '' ? '' : (network_ports_num_max ? network_ports_num_max : '1000')) + '&' +
      'power_ports_min=' + (power_ports_min == '' && power_ports_max == '' ? '' : (power_ports_min ? power_ports_min : '0')) + '&' +
      'power_ports_max=' + (power_ports_min == '' && power_ports_max == '' ? '' : (power_ports_max ? power_ports_max : '1000')) + '&' +
      'cpu=' + cpu + '&' +
      'memory_min=' + (memory_min == '' && memory_max == '' ? '' : (memory_min ? memory_min : '0')) + '&' +
      'memory_max=' + (memory_min == '' && memory_max == '' ? '' : (memory_max ? memory_max : '8192'))+ '&' +
      'storage=' + storage;
    this.setState({ query: q });
    return q;
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
                <TextField label='Vendor' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.vendor = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={3}>
                <TextField label='Model Number' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.model_number = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={2}>
                <TextField label='Min Height (U)' type="number" fullWidth value={this.state.identifiers.height_min} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.height_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max Height (U)' type="number" fullWidth value={this.state.identifiers.height_max} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.height_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={3}>
                <Input type="color" name="Display Color" startAdornment="Display Color" value={'#' + this.state.identifiers.display_color}
                  onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.display_color = e.target.value.replace('#', '');
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  }} />
              </Grid>
              <Grid item xs={2}>
                <TextField label='Min network Ports' type="number" fullWidth value={this.state.identifiers.network_ports_num_min} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.network_ports_num_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max network Ports' type="number" fullWidth value={this.state.identifiers.network_ports_num_max} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.network_ports_num_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={2}>
                <TextField label='Min Power Ports' type="number" fullWidth value={this.state.identifiers.power_ports_min} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.power_ports_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max Power Ports' type="number" fullWidth value={this.state.identifiers.power_ports_max} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.power_ports_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={3}>
                <TextField label='CPU' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.cpu = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />{' '}

              </Grid>
              <Grid item xs={2}>
                <TextField label='Min Memory (GB)' type="number" value={this.state.identifiers.memory_min} fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.memory_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max Memory (GB)' type="number" value={this.state.identifiers.memory_max} fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.memory_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={3}>
                <TextField label='Storage' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.storage = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }} />
              </Grid>
              <Grid item xs={9}>
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" type="submit" color="primary" onClick={() => this.handleSubmit}>Apply
                  Filters</Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
    )
  }
}

export default AuditLogFilters
