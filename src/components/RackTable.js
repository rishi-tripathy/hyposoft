import React, { Component } from 'react'
import '../stylesheets/TableView.css'
import PropTypes from 'prop-types';

export class RackTable extends Component {
   renderTableNumbers() {
      return this.props.numbers.map((number, index) => (
         <tr key = {index}>
            <td> { number } </td>
            <td> blank </td>
            <td> { number } </td>
            </tr>
      ))
    }
    
      renderTableData() {
         return this.props.rackInstances.map((rackInstance, index) => {
           const {id, hostName, vendor, modelNumber } = rackInstance
            return (
                     <tr key = {id}>
                        <td>{modelNumber}{vendor} {hostName}</td>
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
                   {this.renderTableNumbers()}
                   {/* { this.renderTableData() } */}
                </tbody>
             </table>
          </div>
        )
      }
    }

// RackTable.propTypes = {
//    rackInstances: PropTypes.array.isRequired
// }

export default RackTable
    