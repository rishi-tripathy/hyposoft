import React, { Component } from 'react'
import DetailedModelModal from './DetailedModelModal';

export class InstanceCard extends Component {
  showModel = (e) => {
    const { model } = this.props.inst;
    console.log(model.url)
  }

<<<<<<< HEAD
  componentDidMount() {

  }

=======
>>>>>>> 03e3a9c43312cf02201cfac700ba54be32741cc6
  render() {
    const { id, model, hostname, rack, rack_u, owner, comment } = this.props.inst;
    return (
      <div class="card">
        <div class="container">
          <h3>Detailed Instance</h3>
          <h4>ID: {id}</h4>
<<<<<<< HEAD
          <h4>Model Vendor: {model ? model.vendor : null}</h4>
          <p>Hostname: {hostname}</p> 
          <p>Rack Number: {rack ? rack.rack_number : null}</p> 
          <p>Rack_U: {rack_u}</p> 
          <p>Owner Username: {owner ? owner.username : null}</p> 
          <p>Comment: {comment}</p> 
          <DetailedModelModal modelURL={model ? model.url : null} />
=======
          <h4>Model Vendor: {model.vendor}</h4>
          <p>Hostname: {hostname}</p> 
          <p>Rack Number: {rack.rack_number}</p> 
          <p>Rack_U: {rack_u}</p> 
          <p>Owner Username: {owner ? owner.username : null}</p> 
          <p>Comment: {comment}</p> 
          <DetailedModelModal modelURL={model.url} />
>>>>>>> 03e3a9c43312cf02201cfac700ba54be32741cc6
          {/* <button onClick={ this.showModel }>See Detailed Model</button> */}
        </div>
      </div>
    )
  }
}

export default InstanceCard
