import React, { Component } from 'react'

export class InstanceCard extends Component {

  render() {
    const { id, model, hostname, rack, rack_u, owner, comment } = this.props.inst;
    return (
      <div class="card">
        
        <div class="container">
          <h4><b>{id}</b></h4>
          <h4>{model}</h4>
          <p>{hostname}</p> 
          <p>{rack}</p> 
          <p>{rack_u}</p> 
          <p>{owner}</p> 
          <p>{comment}</p> 
        </div>
      </div>
    )
  }
}

export default InstanceCard
