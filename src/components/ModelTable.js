import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/TableView.css'

export class ModelTable extends Component {

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
         <h1 id="title">Models</h1>
         <table id="entries">
            <tbody>
               <tr>{this.renderTableHeader()}</tr>
               { this.renderTableData() }
            </tbody>
         </table>
      </div>
   )
  }
}

ModelTable.propTypes = {
  models: PropTypes.array.isRequired
}

export default ModelTable
