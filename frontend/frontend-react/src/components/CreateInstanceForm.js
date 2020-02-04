import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';
import {Button, Form, FormGroup, FormText, Input, Label, Container, Row, Col} from "reactstrap";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateInstanceForm extends Component {
  
  constructor() {
    super();
    this.state = {
      instance: {
        model: null,
        hostname: null,
        rack: null,
        rack_u: null,
        owner: null,
        comment: null,
      },
      modelOptions: [],
      selectedModelOption: null,

      rackOptions: [], 
      selectedRackOption: null,

      ownerOptions: [],
      selectedOwnerOption: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let stateCopy = Object.assign({}, this.state.instance);
    stateCopy.model = this.state.selectedModelOption ? this.state.selectedModelOption.value : null;
    stateCopy.rack = this.state.selectedRackOption ? this.state.selectedRackOption.value : null;
    stateCopy.owner = this.state.selectedOwnerOption ? this.state.selectedOwnerOption.value : null;
    let stateToSend = this.removeEmpty(stateCopy);
    
    console.log(stateToSend)

    axios.post('/api/instances/', stateToSend)
    .then(function (response) {
      alert('Created successfully');
    })
    .catch(function (error) {
      alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    });
    this.props.sendShowTable(true);
  }

  componentDidMount() {
    // MODEL
    let dst = '/api/instances/model_names/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      console.log(res.data)
      this.setState({ modelOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });

    // RACK
    dst = '/api/racks/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].rack_number });
      }
      console.log(res.data)
      this.setState({ rackOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Could not load racks. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });

    // OWNER
    dst = '/api/users/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].username });
      }
      console.log(res.data)
      this.setState({ ownerOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  handleChangeModel = selectedModelOption => {
    this.setState({ selectedModelOption });
  };

  handleChangeRack = selectedRackOption => {
    this.setState({ selectedRackOption });
  };

  handleChangeOwner = selectedOwnerOption => {
    this.setState({ selectedOwnerOption });
  };
  
  
  render() {
    return (
      <Container>
        <Row>
          <Col xs="6">
          <Form onSubmit={this.handleSubmit}>
            <h1>Create an Instance</h1>

            <FormGroup>
              <Label for="model">Model</Label>
              <Select value={ this.state.selectedModelOption }
              onChange={ this.handleChangeModel }
              options={ this.state.modelOptions }
              searchable={ true } />
            </FormGroup>

            <FormGroup>
              <Label for="hostname">Hostname</Label>
              <Input type="text" onChange={e => {
                let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                instanceCopy.hostname = e.target.value
                this.setState({
                  instance: instanceCopy 
                }) 
              } } />
            </FormGroup>
            
            <FormGroup>
              <Label for="rack">Rack</Label>
              <Select value={ this.state.selectedRackOption }
                onChange={ this.handleChangeRack }
                options={ this.state.rackOptions }
                searchable={ true } />
            </FormGroup>

            <FormGroup>
              <Label for="racku">Rack_U</Label>
              <Input type="number" onChange={e => {
                let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                instanceCopy.rack_u = e.target.value
                this.setState({
                  instance: instanceCopy 
                }) 
              } } />
            </FormGroup>
            
            <FormGroup>
              <Label for="owner">Owner</Label>
              <Select value={ this.state.selectedOwnerOption }
                onChange={ this.handleChangeOwner }
                options={ this.state.ownerOptions }
                searchable={ true } />
            </FormGroup>

            <FormGroup>
              <Label for="comment">Comment</Label>
              <Input type="text" onChange={e => {
                let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                instanceCopy.comment = e.target.value
                this.setState({
                  instance: instanceCopy 
                }) 
              } } />
            </FormGroup>
            
            <Input type="submit" value="Submit" />
          </Form>
          </Col>
        </Row>
      </Container>
      
    )
  }
}

export default CreateInstanceForm
