import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class CreateModelForm extends Component {

  constructor() {
    super();
    this.state = {
      model: {
        'vendor': null,
        'model_number': null,
        'height': null,
        'display_color': null,
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
      console.log(error.response);
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
      alert('Creation was not successful.\n' + JSON.stringify(error.response.data));
    });
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
      <form onSubmit={this.handleSubmit}>
        <h3>Create model form!!</h3>
        <p>Vendor</p> 
        <Creatable value={ this.state.selectedVendorOption }
          onChange={ this.handleChangeVendor }
          options={ this.state.vendorOptions }
          isOptionUnique={this.isOptionUnique}
          searchable={ true } />

        <p>Model number</p> 
        <input type="text" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.model_number = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <p>Height</p>
        <input type="number" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.height = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <p>Display color</p> 
        <input type="text" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.display_color = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <p>Ethernet ports</p> 
        <input type="number" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.ethernet_ports = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <p>Power ports</p>
        <input type="number" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.power_ports = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <p>CPU</p>
        <input type="text" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.cpu = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <p>Memory</p>
        <input type="number" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.memory = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <p>Storage</p>
        <input type="text" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.storage = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />
        
        <p>Comment</p>
        <input type="text" onChange={e => {
          let modelCopy = JSON.parse(JSON.stringify(this.state.model))
          modelCopy.comment = e.target.value
          this.setState({
            model: modelCopy 
          }) 
        } } />

        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default CreateModelForm
