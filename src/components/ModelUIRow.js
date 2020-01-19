import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/ModelCardView.css'

export class ModelUIRow extends Component {

  renderTableHeader() {
    let header = Object.keys(this.props.models[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.models.map((model, index) => {
       const { id, vendor, modelNumber, height, displayColor } = model //destructuring
       const { ethernetPorts, powerPorts, cpu, memory, storage, comment } = model //more destructuring
       return (
          <tr key={id}>
             <td>{id}</td>
             <td>{vendor}</td>
             <td>{modelNumber}</td>
             <td>{height}</td>
             <td>{displayColor}</td>
             <td>{ethernetPorts}</td>
             <td>{powerPorts}</td>
             <td>{cpu}</td>
             <td>{memory}</td>
             <td>{storage}</td>
             <td>{comment}</td>
          </tr>
       )
    })
 }

  render() {
    return (
      <div>
         <h1>React Dynamic Table</h1>
         <table>
            <tbody>
               <tr>{this.renderTableHeader()}</tr>
               { this.renderTableData() }
            </tbody>
         </table>
      </div>
   )
  //   return (
  //     <div>
  //       <div className="card">
  //         <div className="container">
  //           <tr>
  //             <td>{this.props.model.vendor}</td>
  //             <td>{this.props.model.modelNumber} </td>
  //             <td>{this.props.model.height}</td>
  //             <td>{this.props.model.displayColor}</td>
  //             <td>{this.props.model.ethernetPorts}</td>
  //             <td>{this.props.model.powerPorts}</td>
  //             <td>{this.props.model.cpu}</td>
  //             <td>{this.props.model.memory} GB</td>
  //             <td>{this.props.model.storage}</td>
  //             <td>{this.props.model.comment}</td>
  //           </tr>
            
  //         </div>
  //       </div>
  //       <br></br>
  //     </div>
      
  //   )
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

//ModelController is passing in 'model'
ModelUIRow.propTypes = {
  models: PropTypes.array.isRequired
}

export default ModelUIRow
