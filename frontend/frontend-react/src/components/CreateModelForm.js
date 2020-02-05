import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
import {Button, Form, FormGroup, FormText, Input, Label, Container, Row, Col} from "reactstrap";
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

  componentDidMount() {
    // MODEL
    let dst = '/api/models/vendors/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.vendors.length; i++) {
        myOptions.push({ value: res.data.vendors[i], label: res.data.vendors[i] });
      }
      console.log(res.data)
      this.setState({ vendorOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response)
      alert('Could not load model vendors. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let stateCopy = Object.assign({}, this.state.model);
    stateCopy.vendor = this.state.selectedVendorOption ? this.state.selectedVendorOption.value : null;
    let stateToSend = this.removeEmpty(stateCopy);
    
    console.log(stateToSend)
    axios.post('/api/models/', stateToSend)
    .then(function (response) {
      alert('Created successfully');
    })
    .catch(function (error) {
      alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    });
    this.props.sendShowTable(true);
  }

  handleChangeVendor = selectedVendorOption => {
    this.setState({ selectedVendorOption });
  };

  isOptionUnique(prop) {
    // not sure if this does anything: check once backend updates
    const { option, options, valueKey, labelKey } = prop;
    return !options.find(opt => option[valueKey] === opt[valueKey])
  }

  render() {
    return (
   <div>
    <Button onClick={() => this.props.sendShowTable(true)} >Back</Button>
      <Container>
        <Row>
          <Col xs="6">
            <Form onSubmit={this.handleSubmit}>
              <h1>Create a Model</h1>
              <FormGroup>
                <Label for="vendor">Vendor</Label>
                <Creatable value={ this.state.selectedVendorOption }
                  onChange={ this.handleChangeVendor }
                  options={ this.state.vendorOptions }
                  isOptionUnique={this.isOptionUnique}
                  searchable={ true } />{' '}
              </FormGroup>
              <FormGroup>
                <Label for="model number">Model Number</Label>
                <Input type="text" onChange={e => {
                  let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                  modelCopy.model_number = e.target.value
                  this.setState({
                    model: modelCopy
                  })
                } } />{' '}
              </FormGroup>
              <FormGroup>
              <Label for="height">Height (in U)</Label>
              <Input type="number" onChange={e => {
                let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                modelCopy.height = e.target.value
                this.setState({
                  model: modelCopy
                })
              } } />{' '}
            </FormGroup>
              <FormGroup>
              <Label for="color">Display Color</Label>
                <Input type="color"
                  value={'#' + this.state.model.display_color}
                  onChange={e => {
                    let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                    modelCopy.display_color = e.target.value.replace('#', '');
                    this.setState({
                      model: modelCopy
                    })
                  }} />{' '}
            </FormGroup>
              <FormGroup>
              <Label for="ethernet">Ethernet Ports</Label>
              <Input type="number" onChange={e => {
                let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                modelCopy.ethernet_ports = e.target.value
                this.setState({
                  model: modelCopy
                })
              } } />{' '}
            </FormGroup>
              <FormGroup>
              <Label for="powerports">Power Ports</Label>
              <Input type="number" onChange={e => {
                let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                modelCopy.power_ports = e.target.value
                this.setState({
                  model: modelCopy
                })
              } } />{' '}
            </FormGroup>
              <FormGroup>
              <Label for="cpu">CPU</Label>
              <Input type="text" onChange={e => {
                let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                modelCopy.cpu = e.target.value
                this.setState({
                  model: modelCopy
                })
              } } />{' '}
              <FormText color="muted">
                Describe the CPU on this model
              </FormText>
            </FormGroup>
              <FormGroup>
              <Label for="Memory">Memory</Label>
                <Input type="number" onChange={e => {
                  let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                  modelCopy.memory = e.target.value
                  this.setState({
                    model: modelCopy
                  })
                } } />{' '}
                <FormText color="muted">
                  RAM available on this model, in GB
                </FormText>
            </FormGroup>
              <FormGroup>
              <Label for="Storage">Storage</Label>
              <Input type="text" onChange={e => {
                let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                modelCopy.storage = e.target.value
                this.setState({
                  model: modelCopy
                })
              } } />{' '}
              <FormText color="muted">
                Describe the storage offered on this model
              </FormText>
            </FormGroup>
              <FormGroup>
              <Label for="Comment">Comment</Label>
                <Input type="textarea" onChange={e => {
                  let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                  modelCopy.comment = e.target.value
                  this.setState({
                    model: modelCopy
                  })
                } } />{' '}
            </FormGroup>
              <FormGroup>
                <Input type="submit" value="Submit" />
              </FormGroup>
            </Form>
          </Col>
          <Col xs="6">
          </Col>
        </Row>
      </Container>
   </div>
    )
  }
}

export default CreateModelForm
