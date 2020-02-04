import React, { Component } from 'react'

export class ModelCard extends Component {
  render() {
    const { id, vendor, model_number, height, display_color, ethernet_ports, power_ports, cpu, memory, storage, comment } = this.props.model;
    return (
      <div class="card">
        <div class="container">
          <h3>Detailed Model</h3>
          <h4>ID: {id}</h4>
          <h4>Vendor: {vendor}</h4>
          <p>Model Number: {model_number}</p> 
          <p>Height: {height}</p> 
          <p>Display Color: {display_color} 
            <div style={{
							width: 12,
							height: 12,
							backgroundColor: '#' + display_color,
							left: 5,
							top: 5,
							}}>
            </div>
          </p> 
          <p>Ethernet Ports: {ethernet_ports}</p> 
          <p>Power Ports: {power_ports}</p> 
          <p>CPU: {cpu}</p> 
          <p>Memory: {memory}</p> 
          <p>Storage: {storage}</p> 
          <p>Comment: {comment}</p> 
          {/* <DetailedModelModal modelURL={model.url} /> */}
          {/* <button onClick={ this.showModel }>See Detailed Model</button> */}
        </div>
      </div>
    )
  }
}

export default ModelCard
