import React, { Component } from 'react'

export class InstanceCard extends Component {

  render() {
    console.log('getting this at instance card')
    console.log(this.props.inst)
    const { id, model, hostname, rack, rack_u, owner, comment } = this.props.inst;
    return (
      <div class="card">
        
        <div class="container">
          <h4><b>{id}</b></h4>
          {/* <h4>{model.vendor}</h4> */}
          <p>{hostname}</p> 
          {/* <p>{rack.rack_number}</p>  */}
          <p>{rack_u}</p> 
          {/* <p>{owner.username}</p>  */}
          <p>{comment}</p> 
        </div>
      </div>
    )
  }
}

export default InstanceCard
