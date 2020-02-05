import React, { Component } from 'react'
import {Button, Container, Form, FormGroup, FormText, Input, Label, Row, Col} from "reactstrap";
import Creatable from "react-select/creatable/dist/react-select.esm";

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
    const { vendor, model_number, height_min, height_max, display_color, ethernet_ports_min, ethernet_ports_max, power_ports_min, power_ports_max, cpu, memory_min, memory_max, storage } = this.state.identifiers;
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
          <h4>Filters</h4>
        <Container>
          <Row>
            <Col>
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
            </Col>
            <Col>
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
            </Col>
              <Col>
              <FormGroup>
                <Label for="height">Min Height (in U)</Label>
                <Input type="number" onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.height_min = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  } } />{' '}
              </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                <Label for="height">Max Height (in U)</Label>
                <Input type="number" onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.height_max = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  } } />{' '}
              </FormGroup>
              </Col>
          </Row>
          <Row>
            <Col>
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
            </Col>
            <Col>
            <FormGroup>
              <Label for="ethernet">Min Ethernet Ports</Label>
                <Input type="number" onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.ethernet_ports_min = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  } } />{' '}
            </FormGroup>
            </Col>
            <Col>
              <FormGroup>
              <Label for="ethernet">Max Ethernet Ports</Label>
                <Input type="number" onChange={e => {
                    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                    identifiersCopy.ethernet_ports_max = e.target.value
                    this.setState({
                      identifiers: identifiersCopy
                    })
                  } } />{' '}
                </FormGroup>
          </Col>
            <Col>
            <FormGroup>
              <Label for="powerports">Min Power Ports</Label>
              <Input type="number" onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.power_ports_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                } } />{' '}
            </FormGroup>
            </Col>
            <Col>
              <FormGroup>
              <Label for="powerports">Max Power Ports</Label>
              <Input type="number" onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.power_ports_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                } } />{' '}
            </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
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
            </Col>
            <Col>
                <FormGroup>
              <Label for="Memory">Min Memory (GB)</Label>
              <Input type="number" onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.memory_min = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                } } />{' '}
                </FormGroup>
            </Col>
            <Col>
              <FormGroup>
              <Label for="Memory">Max Memory (GB)</Label>
              <Input type="number" onChange={e => {
                  let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
                  identifiersCopy.memory_max = e.target.value
                  this.setState({
                    identifiers: identifiersCopy
                  })
                } } />{' '}
              </FormGroup>
            </Col>
            <Col>
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
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col>
              <FormGroup>
              <Input color="green" type="submit" value="Apply Filters" />
            </FormGroup>
            </Col>
          </Row>
        </Container>
        </Form>
      </div>
    )
  }
}

export default ModelFilters
