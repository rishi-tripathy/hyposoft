import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import Select from 'react-select';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class EditModelForm extends Component {

  constructor(props) {
    super(props);
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

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dst = '/api/models/'.concat(this.props.editID).concat('/');

    let stateCopy = Object.assign({}, this.state.model);
    let stateToSend = this.removeEmpty(stateCopy);
    console.log(stateToSend)
    
    axios.patch(dst, stateToSend)
    .then(function (response) {
      alert('Edit was successful');
    })
    .catch(function (error) {
      alert('Edit was not successful.\n' + JSON.stringify(error.response.data));
    });
  }

  componentDidMount() {
    let dst = '/api/models/'.concat(this.props.editID).concat('/');
    axios.get(dst).then(res => {
      console.log(res);
      
      let modelCopy = JSON.parse(JSON.stringify(this.state.model));
      modelCopy.vendor = res.data.vendor;
      modelCopy.model_number = res.data.model_number;
      modelCopy.display_color = res.data.display_color;
      modelCopy.ethernet_ports = res.data.ethernet_ports;
      modelCopy.power_ports = res.data.power_ports;
      modelCopy.cpu = res.data.cpu;
      modelCopy.memory = res.data.memory;
      modelCopy.storage = res.data.storage;
      modelCopy.comment = res.data.comment;
      this.setState({
        model: modelCopy,
      }) 
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });

    // VENDOR
    dst = '/api/models/vendors/';
    axios.get(dst).then(res => {
      let myOptions = []; 
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].vendor, label: res.data[i].vendor });
      }
      console.log(res.data)
      this.setState({ 
        vendorOptions: myOptions, 
        selectedVendorOption: { value: this.state.model.vendor, label: this.state.model.vendor } 
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  handleChangeVendor = selectedVendorOption => {
    this.setState({ selectedVendorOption });
    console.log(selectedVendorOption)
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Edit Model Form</h3>
        <p>Vendor</p> 
        <Select value={ this.state.selectedVendorOption }
          onChange={ this.handleChangeVendor }
          options={ this.state.vendorOptions }
          searchable={ true } />
        
        
        <p>Model number</p> 
        <input type="text" 
          value={this.state.model.model_number}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.model_number = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />

        <p>Height</p>
        <input type="number" 
          value={this.state.model.height}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.height = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />

        <p>Display color</p>
        <input type="text" 
          value={this.state.model.display_color}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.display_color = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />
        
        <p>Ethernet ports</p> 
        <input type="number" 
          value={this.state.model.ethernet_ports}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.ethernet_ports = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />

        <p>Power ports</p> 
        <input type="number" 
          value={this.state.model.power_ports}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.power_ports = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />

        <p>CPU</p> 
        <input type="text" 
          value={this.state.model.cpu}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.cpu = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />
        
        <p>Memory</p> 
        <input type="number" 
          value={this.state.model.memory}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.memory = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />

        <p>Storage</p>
        <input type="text" 
          value={this.state.model.storage}
          onChange={e => {
            let modelCopy = JSON.parse(JSON.stringify(this.state.model))
            modelCopy.storage = e.target.value
            this.setState({
              model: modelCopy 
            }) 
        } } />

        <p>Comment</p>
        <input type="text" 
          value={this.state.model.comment}
          onChange={e => {
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

EditModelForm.propTypes = {
  editID: PropTypes.object.isRequired
}

export default EditModelForm
