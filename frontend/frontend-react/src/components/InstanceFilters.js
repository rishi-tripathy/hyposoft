import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class InstanceFilters extends Component {
  
  constructor() {
    super();
    this.state = {
      modelOptions: [],
      selectedModelOption: null,

      rackOptions: [], 
      selectedRackOption: null,

      ownerOptions: [],
      selectedOwnerOption: null,

      identifiers: {
        modelID: '',
        modelNumber: '',
        modelVendor: '',
        hostname: '',
        rackID: '',
        rack_u: '',
        ownerID: '',
      }, 
      query: null,
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  mountModelNames = () => {
    // MODEL NAMES
    let dst = '/api/instances/model_names/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      //console.log(res.data)
      this.setState({ modelOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  mountRacks = () => {
    // RACK
    let dst = '/api/racks/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].rack_number });
      }
      //console.log(res.data)
      this.setState({ rackOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  mountOwners = () => {
    // OWNER
    let dst = '/api/users/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].id, label: res.data[i].username });
      }
      //console.log(res.data)
      this.setState({ ownerOptions: myOptions });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  componentDidMount() {
    this.mountModelNames();
    this.mountRacks();
    this.mountOwners();
  }
  
  handleChangeModel = selectedModelOption => {
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
    identifiersCopy.modelID = selectedModelOption.value
    this.setState({
      selectedModelOption, 
      identifiers: identifiersCopy,
    })
  };

  handleChangeRack = selectedRackOption => {
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
    identifiersCopy.rackID = selectedRackOption.value
    this.setState({
      selectedRackOption, 
      identifiers: identifiersCopy,
    })
  };

  handleChangeOwner = selectedOwnerOption => {
    let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
    identifiersCopy.ownerID = selectedOwnerOption.value
    this.setState({
      selectedOwnerOption, 
      identifiers: identifiersCopy,
    })
  };

  createQuery = () => {
    const { modelID, modelNumber, modelVendor, hostname, rackID, rack_u, ownerID } = this.state.identifiers;
    let q = '' + 
            'model=' + modelID + '&' +
            'model__model_number=' + modelNumber + '&' +
            'model__vendor=' + modelVendor + '&' +
            'hostname=' + hostname + '&' +
            'rack=' + rackID + '&' +
            'rack_u=' + rack_u + '&' +
            'owner=' + ownerID;
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
        <form onSubmit={this.handleSubmit}>
          <h4>Instance Filters</h4>
          <p>Model</p> 
          <Select value={ this.state.selectedModelOption }
            onChange={ this.handleChangeModel }
            options={ this.state.modelOptions }
            searchable={ true }
            clearable={ true } />
          
          <p>Model Number</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.modelNumber = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Model Vendor</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.modelVendor = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Hostname</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.hostname = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />
          
          <p>Rack</p>
          <Select value={ this.state.selectedRackOption }
            onChange={ this.handleChangeRack }
            options={ this.state.rackOptions }
            searchable={ true } />
          
          <p>Rack_U</p>
          <input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.rack_u = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Owner</p>
          <Select value={ this.state.selectedOwnerOption }
            onChange={ this.handleChangeOwner }
            options={ this.state.ownerOptions }
            searchable={ true } />
          
          
          {/* <p>Comment</p> 
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.comment = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } /> */}


          <input type="submit" value="Apply Filters" />
        </form>
      </div>
    )
  }
}

export default InstanceFilters
