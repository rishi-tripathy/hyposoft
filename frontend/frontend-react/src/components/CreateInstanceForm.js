import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';

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
      alert('Creation was not successful.\n' + JSON.stringify(error.response.data));
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
      console.log(error.response);
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
      console.log(error.response);
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
      console.log(error.response);
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
      <form onSubmit={this.handleSubmit}>
        <h3>Create Instance Form</h3>
        <p>Model</p> 
        <Select value={ this.state.selectedModelOption }
          onChange={ this.handleChangeModel }
          options={ this.state.modelOptions }
          searchable={ true } />
        
        <p>Hostname</p>
        <input type="text" onChange={e => {
          let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
          instanceCopy.hostname = e.target.value
          this.setState({
            instance: instanceCopy 
          }) 
        } } />
        
        <p>Rack</p>
        <Select value={ this.state.selectedRackOption }
          onChange={ this.handleChangeRack }
          options={ this.state.rackOptions }
          searchable={ true } />
        
        <p>Rack_U</p>
        <input type="number" onChange={e => {
            let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
            instanceCopy.rack_u = e.target.value
            this.setState({
              instance: instanceCopy 
            }) 
          } } />

        <p>Owner</p>
        <Select value={ this.state.selectedOwnerOption }
          onChange={ this.handleChangeOwner }
          options={ this.state.ownerOptions }
          searchable={ true } />
        
        <p>Comment</p> 
        <input type="text" onChange={e => {
          let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
          instanceCopy.comment = e.target.value
          this.setState({
            instance: instanceCopy 
          }) 
        } } />

        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default CreateInstanceForm
