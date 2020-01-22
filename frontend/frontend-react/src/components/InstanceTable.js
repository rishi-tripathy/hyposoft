import React, { Component } from 'react'
import '../stylesheets/TableView.css'
import axios from 'axios'

export class InstanceTable extends Component {

  renderTableHeader() {
    let header = Object.keys(this.props.instances[0])
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.instances.map((instance) => {
        const { id, model, hostname } = instance //destructuring
        
        return (
          <tr key={id}>
              <td>{id}</td>
              <td>{model}</td>
              <td>{hostname}</td>
              <td><button onClick={console.log(id)}>See details</button></td>
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
