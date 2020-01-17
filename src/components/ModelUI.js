import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/ModelCardView.css'

export class ModelUI extends Component {
  render() {
    return (
      <div>
        <div className="card">
          <div className="container">
            <h2>
              {this.props.model.vendor} {this.props.model.modelNumber} 
            </h2>
            <p>Height: {this.props.model.height}</p>
            <p>Color: {this.props.model.displayColor}</p>
            <p>Ethernet Ports: {this.props.model.ethernetPorts}</p>
            <p>Power Ports: {this.props.model.powerPorts}</p>
            <p>CPU: {this.props.model.cpu}</p>
            <p>Memory: {this.props.model.memory} GB</p>
            <p>Storage: {this.props.model.storage}</p>
            <p>Comments: {this.props.model.comment}</p>
          </div>
        </div>
        <br></br>
      </div>
      
    )
  }
}


// id: 1,
//           vendor: 'Dell',
//           modelNumber: 'R710',
//           height: 2,
//           displayColor: 'black',
//           ethernetPorts: 4,
//           powerPorts: 1,
//           cpu: 'Intel Xeon E5520 2.2Ghz',
//           memory: 4,
//           storage: '2x500GB SSD RAID1',
//           comment: 'retired offering, no new purchasing'

//ModelController is passing in 'todo'
ModelUI.propTypes = {
  model: PropTypes.object.isRequired
}

export default ModelUI
