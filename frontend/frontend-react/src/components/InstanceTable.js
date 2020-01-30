import React, { Component } from 'react'
import '../stylesheets/TableView.css'
import axios from 'axios'


export class InstanceTable extends Component {

  constructor() {
    super();
    this.passUP = this.passUp.bind(this);
  }

  passUp = (id) => {
    this.props.sendShowTable(false);
    this.props.sendInstanceID(id);
  }

  renderTableHeader() {
    let header = ['id', 'model_vendor', 'hostname', 'rack', 'rack_u', 'owner_username'];
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.instances.map((instance) => {
        const { id, model, hostname, rack, owner, rack_u } = instance //destructuring

        return (
          <tr key={id}>
              <td>{id}</td>
              <td>{model.vendor}</td>
              <td>{hostname}</td>
              <td>{rack.rack_number}</td>
              <td>{rack_u}</td>
              <td>{owner.username}</td>
              <td><button onClick={ () => this.passUp(id) }>More details</button></td>
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