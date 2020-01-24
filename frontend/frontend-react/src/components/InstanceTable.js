import React, { Component } from 'react'
import '../stylesheets/TableView.css'
import axios from 'axios'
import DetailedInstanceModal from './DetailedInstanceModal'

export class InstanceTable extends Component {

  constructor() {
    super();
    this.passUP = this.passUp.bind(this);
  }

  passUp= (id) => {
    this.props.sendShowTable(false);
    this.props.sendInstanceID(id);
  }

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
              { console.log('pass id' + id) } 
              <td><DetailedInstanceModal instanceID={id} /></td>
              <td><button onClick={ () => this.passUp(id) }>click</button></td>
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