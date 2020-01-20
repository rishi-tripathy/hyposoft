import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/TableView.css'

export class RackTable extends Component {

  renderTableHeader() {
    let header = Object.keys(this.props.models[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.models.map((model, index) => {
      
       return (
          <tr key={id}>
             <td>{id}</td>
          </tr>
       )
    })
   }
 
  render() {
    return (
      <div>
         <h1 id="title">Racks</h1>
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

export default RackTable