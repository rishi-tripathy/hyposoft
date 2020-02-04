import React, { Component } from 'react'
import {Button, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import Creatable from "react-select/creatable/dist/react-select.esm";

export class ModelFilters extends Component {

  constructor() {
    super();
    this.state = {
      identifiers: {
        vendor: '',
        model_number: '',
        height: '',
        display_color: '',
        ethernet_ports: '',
        power_ports: '',
        cpu: '',
        memory: '',
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
    const { vendor, model_number, height, display_color, ethernet_ports, power_ports, cpu, memory, storage } = this.state.identifiers;
    // NO '?' here!!
    let q = '' + 
            'vendor=' + vendor + '&' +
            'model_number=' + model_number + '&' +
            'height=' + height + '&' +
            'display_color=' + display_color + '&' +
            'ethernet_ports=' + ethernet_ports + '&' +
            'power_ports=' + power_ports + '&' +
            'cpu=' + cpu + '&' +
            'memory=' + memory + '&' +
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
        <Form onSubmit={this.handleSubmit}>
            <h3>Model Filters</h3>
      <FormGroup>
        <Label for="vendor">Vendor</Label>
        <Input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.vendor = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
      </FormGroup>
           <FormGroup>
        <Label for="model number">Model Number</Label>
        <Input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.model_number = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
         </FormGroup>
          <FormGroup>
        <Label for="height">Height (in U)</Label>
        <Input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.height = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
          </FormGroup>
           <FormGroup>
       <Label for="color">Display Color</Label>
        <Input type="color"
            // value={'#' + this.state.model.display_color}
            onChange={e => {
              let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
              identifiersCopy.display_color = e.target.value.replace('#', '');
              this.setState({
                identifiers: identifiersCopy
              })
            }} />{' '}
      </FormGroup>
          <FormGroup>
          <Label for="ethernet">Ethernet Ports</Label>
        <Input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.ethernet_ports = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
        </FormGroup>
          <FormGroup>
         <Label for="powerports">Power Ports</Label>
        <Input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.power_ports = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
          </FormGroup>
          <FormGroup>
        <Label for="cpu">CPU</Label>
        <Input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.cpu = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
        </FormGroup>
           <FormGroup>
       <Label for="Memory">Memory</Label>
        <Input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.memory = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
        </FormGroup>
           <FormGroup>
        <Label for="Storage">Storage</Label>
        <Input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.storage = e.target.value
            this.setState({
              identifiers: identifiersCopy
            })
          } } />{' '}
        </FormGroup>
        <FormGroup>
       <Button value="Apply filtering">Submit</Button>
      </FormGroup>
        </Form>

      </div>
    )
  }
}

export default ModelFilters
