import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';

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

  componentDidMount() {
    let dst = '/api/instances/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
      console.log(res);
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
      console.log(error.response);
    });

    // MODEL
    dst = '/api/instances/model_names/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      console.log(res.data)
      this.setState({ 
        modelOptions: myOptions,
        selectedModelOption: { value: this.state.instance.model.url, label: this.state.instance.model.vendor + ' ' + this.state.instance.model.model_number } 
      });
      console.log(this.state.modelOptions);
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
      this.setState({ 
        rackOptions: myOptions, 
        selectedRackOption: { value: this.state.instance.rack.url, label: this.state.instance.rack.rack_number },
      });
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
      this.setState({ 
        ownerOptions: myOptions,
        selectedOwnerOption: { value: this.state.instance.owner.url, label: this.state.instance.owner.username }, 
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  handleChangeModel = selectedModelOption => {
    this.setState({ selectedModelOption });
    console.log(selectedModelOption)
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
      alert('Edit was not successful.\n' + JSON.stringify(error.response.data));
    });
    this.props.sendShowTable(true);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Edit Instance Form</h3>
        <p>Model</p> 
        <Select value={ this.state.selectedModelOption }
          onChange={ this.handleChangeModel }
          options={ this.state.modelOptions }
          searchable={ true } />

        <p>Hostname</p>
        <input type="text" 
          value={this.state.instance.hostname}
          onChange={e => {
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
        <input type="number" 
          value={this.state.instance.rack_u}
          onChange={e => {
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
        <input type="text" 
          value={this.state.instance.comment}
          onChange={e => {
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

export default EditInstanceForm
