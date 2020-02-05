import React, { Component } from 'react'
import { UncontrolledCollapse, Button, Table, Input, Form, ButtonGroup, Container, Card, Row, Col } from 'reactstrap';

export class ModelCard extends Component {

  renderTableHeader() {
		let header = ['vendor', 'model number', 'height',
		'display color', 'ethernet ports', 'power ports', 'cpu', 'memory', 'storage', 'comment'];
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.model.map((model, index) => {
       const { id, vendor, model_number, height, display_color } = model //destructuring
       const { ethernet_ports, power_ports, cpu, memory, storage, comment } = model //more destructuring
       return (
          <tr key={id}>
						<td>{vendor}</td>
						<td>{model_number}</td>
						<td>{height}</td>
						<td><div style={{
							width: 12,
							height: 12,
							backgroundColor: '#' + display_color,
							left: 5,
							top: 5,
							}}></div>{display_color}</td>
						<td>{ethernet_ports}</td>
						<td>{power_ports}</td>
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
        <div>
          <h2>Detailed Model</h2>
          <Table hover striped>
            <tbody>
               <tr>{this.renderTableHeader()}</tr>
               { this.renderTableData() }
            </tbody>
         </Table>
        </div>
      </div>
    )
  }
}

export default ModelCard
