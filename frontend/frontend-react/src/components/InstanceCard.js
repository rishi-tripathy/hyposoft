import React, { Component } from 'react'
import DetailedModelModal from './DetailedModelModal';
import DetailedModelFromInstance from './DetailedModelFromInstance';
import { UncontrolledCollapse, Button, Table, Container, Card, ButtonToolbar, Row, Col } from 'reactstrap';

export class InstanceCard extends Component {
  showModel = (e) => {
    const { model } = this.props.inst;
    console.log(model.url)
  }

  renderTableHeader() {
    let header = ['model vendor', 'model number', 'hostname', 'rack', 'rack u', 'owner username', 'comment'];
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.inst.map((instance) => {
        const { id, model, hostname, rack, owner, rack_u, comment } = instance //destructuring

        return (
          <tr key={id}>
            <td>{model ? model.vendor : null}</td>
            <td>{model ? model.model_number : null}</td>
            <td>{hostname}</td>
            <td>{rack ? rack.rack_number : null}</td>
            <td>{rack_u}</td>
            <td>{owner ? owner.username : null}</td>
            <td>{ comment }</td>
          </tr>
        )
    })
  }

  componentDidMount() {

  }
  render() {
    return (
      <div>
        {/* <h4>Instances of this Model</h4> */}
        <Table hover striped>
            <tbody>
               <tr>{this.renderTableHeader()}</tr>
               { this.renderTableData() }
            </tbody>
         </Table>
      </div>
    )
  }
}

export default InstanceCard
