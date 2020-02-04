import React, { Component } from 'react'

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
        <form onSubmit={this.handleSubmit}>
          <h4>Model Filters</h4>
          
          <p>Vendor</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.vendor = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Model Number</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.model_number = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Height</p>
          <input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.height = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Display Color</p>
          {/* <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.display_color = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } /> */}

          <input type="color" 
            // value={'#' + this.state.model.display_color} 
            onChange={e => { 
              let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
              identifiersCopy.display_color = e.target.value.replace('#', '');
              this.setState({
                identifiers: identifiersCopy 
              }) 
            }} />

          <p>Ethernet Ports</p>
          <input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.ethernet_ports = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Power Ports</p>
          <input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.power_ports = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>CPU</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.cpu = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Memory</p>
          <input type="number" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.memory = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <p>Storage</p>
          <input type="text" onChange={e => {
            let identifiersCopy = JSON.parse(JSON.stringify(this.state.identifiers))
            identifiersCopy.storage = e.target.value
            this.setState({
              identifiers: identifiersCopy 
            }) 
          } } />

          <input type="submit" value="Apply Filters" />
        </form>
      </div>
    )
  }
}

export default ModelFilters
