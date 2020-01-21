import React, { Component } from 'react'
import '../stylesheets/TableView.css'

export class InstanceTable extends Component {

  renderTableHeader() {
    let header = Object.keys(this.props.instances[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.instances.map((instance, index) => {
       const { id, model, hostName, rack, rackU, owner, comment } = instance //destructuring
       
       return (
          <tr key={id}>
             <td>{id}</td>
             <td>{model}</td>
             <td>{hostName}</td>
             <td>{rack}</td>
             <td>{rackU}</td>
             <td>{owner}</td>
             <td>{comment}</td>
          </tr>
       )
    })
   }

  render() {
    return (
      <div>
        <h1 id="title">Instances</h1>
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

export default InstanceTable
