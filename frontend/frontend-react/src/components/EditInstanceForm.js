import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';
import {Button, Form, FormGroup, FormText, Input, Label, Container, Row, Col} from "reactstrap";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditInstanceForm extends Component {

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

  loadInstance = () => {
    let dst = '/api/instances/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
      let instanceCopy = JSON.parse(JSON.stringify(this.state.instance));
      instanceCopy.model = res.data.model;
      instanceCopy.hostname = res.data.hostname;
      instanceCopy.rack = res.data.rack;
      instanceCopy.rack_u = res.data.rack_u;
      instanceCopy.owner = res.data.owner;
      instanceCopy.comment = res.data.comment;
      this.setState({
        instance: instanceCopy,
      }) 
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  loadModels = () => {
    // MODEL
    let dst = '/api/instances/model_names/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      this.setState({ 
        modelOptions: myOptions,
        selectedModelOption: { value: this.state.instance.model.url, label: this.state.instance.model.vendor + ' ' + this.state.instance.model.model_number } 
      });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  loadRacks = () => {
    // RACK
    let dst = '/api/racks/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].rack_number });
      }
      this.setState({ 
        rackOptions: myOptions, 
        selectedRackOption: { value: this.state.instance.rack.url, label: this.state.instance.rack.rack_number },
      });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  loadOwners = () => {
    // OWNER
    let dst = '/api/users/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].username });
      }
      this.setState({ 
        ownerOptions: myOptions,
        selectedOwnerOption: { value: this.state.instance.owner ? this.state.instance.owner.url : null, label: this.state.instance.owner ? this.state.instance.owner.username : null}, 
      });
    })
    .catch(function (error) {
      // TODO: handle error
      //alert('Cannot load. Re-login.\n' + JSON.stringify(error.response, null, 2));
    });
  }

  componentDidMount() {
    const delay = 50;
    this.loadInstance();

    setTimeout(() => {
      this.loadModels();
      this.loadRacks();
      this.loadOwners();
    }, delay); 

    
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

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/instances/'.concat(this.props.editID).concat('/');

    let stateCopy = Object.assign({}, this.state.instance);

    stateCopy.model = this.state.selectedModelOption ? this.state.selectedModelOption.value : null;
    stateCopy.rack = this.state.selectedRackOption ? this.state.selectedRackOption.value : null;
    stateCopy.owner = this.state.selectedOwnerOption ? this.state.selectedOwnerOption.value : null;

    let stateToSend = this.removeEmpty(stateCopy);
    console.log(stateToSend)
    
    axios.put(dst, stateToSend)
    .then(function (response) {
      alert('Edit was successful');
    })
    .catch(function (error) {
      alert('Edit was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    });
    this.props.sendShowTable(true);
  }

  render() {
    return (
  <div>
    <Button onClick={() => this.props.sendShowTable(true)} >Back</Button>{' '}
      <Container>
        <Row>
          <Col xs="6">
            <Form onSubmit={this.handleSubmit}>
              <h3>Edit Instance Form</h3>

              <FormGroup>
                <Label for="model">Model</Label>
                <Select value={ this.state.selectedModelOption }
                  onChange={ this.handleChangeModel }
                  options={ this.state.modelOptions }
                  searchable={ true } />
              </FormGroup>

              <FormGroup>
                <Label for="hostname">Hostname</Label>
                <Input type="text" 
                  value={this.state.instance.hostname}
                  onChange={e => {
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
                <Label for="rackU">Rack_U</Label>
                <Input type="number" 
                  value={this.state.instance.rack_u}
                  onChange={e => {
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
                <Input type="text" 
                  value={this.state.instance.comment}
                  onChange={e => {
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
  </div>
    )
  }
}

export default EditInstanceForm
