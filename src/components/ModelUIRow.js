import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/ModelCardView.css'

export class ModelUIRow extends Component {
  render() {
    return (
      <div>
        <div className="card">
          <div className="container">
            <tr>
              <td>{this.props.model.vendor}</td>
              <td>{this.props.model.modelNumber} </td>
              <td>{this.props.model.height}</td>
              <td>{this.props.model.displayColor}</td>
              <td>{this.props.model.ethernetPorts}</td>
              <td>{this.props.model.powerPorts}</td>
              <td>{this.props.model.cpu}</td>
              <td>{this.props.model.memory} GB</td>
              <td>{this.props.model.storage}</td>
              <td>{this.props.model.comment}</td>
            </tr>
            
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
ModelUIRow.propTypes = {
  model: PropTypes.object.isRequired
}

export default ModelUIRow
