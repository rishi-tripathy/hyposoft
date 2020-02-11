import React, {Component} from 'react'
import {Autocomplete} from "@material-ui/lab"
import {Button, TextField, Grid, Input, Container, FormControl} from "@material-ui/core";

//import {Button, Container, Form, FormGroup, FormText, Input, Label, Row, Col} from "reactstrap";

export class ModelFilters extends Component {

  constructor() {
    super();
    this.state = {
      identifiers: {
        vendor: '',
        model_number: '',
        height_min: '',
        height_max: '',
        display_color: '',
        ethernet_ports_min: '',
        ethernet_ports_max: '',
        power_ports_min: '',
        power_ports_max: '',
        cpu: '',
        memory_min: '',
        memory_max: '',
        storage: '',
      },
      query: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  createQuery = () => {
    const {vendor, model_number, height_min, height_max, display_color, ethernet_ports_min, ethernet_ports_max, power_ports_min, power_ports_max, cpu, memory_min, memory_max, storage} = this.state.identifiers;
    // NO '?' here!!
    let q = '' +
      'vendor=' + vendor + '&' +
      'model_number=' + model_number + '&' +
      'height_min=' + height_min + '&' +
      'height_max=' + height_max + '&' +
      'display_color=' + display_color + '&' +
      'ethernet_ports_min=' + ethernet_ports_min + '&' +
      'ethernet_ports_max=' + ethernet_ports_max + '&' +
      'power_ports_min=' + power_ports_min + '&' +
      'power_ports_max=' + power_ports_max + '&' +
      'cpu=' + cpu + '&' +
      'memory_min=' + memory_min + '&' +
      'memory_max=' + memory_max + '&' +
      'storage=' + storage;
    this.setState({query: q});
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
                }}/>
              </Grid>
              <Grid item xs={3}>
                <TextField label='Model Number' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.model_number = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={2}>
                <TextField label='Min Height (U)' type="number" fullWidth defaultValue={0} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.height_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max Height (U)' type="number" fullWidth defaultValue={"42"} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.height_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={3}>
                <Input type="color" name="Display Color" startAdornment="Display Color"
                       onChange={e => {
                         let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                         identifiersCopy.display_color = e.target.value.replace('#', '');
                         this.setState({
                           identifiers: identifiersCopy
                         })
                       }}/>
              </Grid>
              <Grid item xs={2}>
                <TextField label='Min Ethernet Ports' type="number" fullWidth defaultValue={0} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.ethernet_ports_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max Ethernet Ports' type="number" fullWidth defaultValue={"24"} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.ethernet_ports_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={2}>
                <TextField label='Min Power Ports' type="number" fullWidth defaultValue={0} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.power_ports_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max Power Ports' type="number" fullWidth defaultValue={"24"} onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.power_ports_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={3}>
                <TextField label='CPU' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.cpu = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>{' '}

              </Grid>
              <Grid item xs={2}>
                <TextField label='Min Memory (GB)' type="number" defaultValue={"0"} fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.memory_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={2}>
                <TextField label='Max Memory (GB)' type="number" defaultValue={"8192"} fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.memory_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
              </Grid>
              <Grid item xs={3}>
                <TextField label='Storage' type="text" fullWidth onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.storage = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                }}/>
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

export default ModelFilters
