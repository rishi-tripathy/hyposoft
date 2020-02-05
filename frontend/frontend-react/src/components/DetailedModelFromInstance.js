import React, { Component } from 'react'
import axios from 'axios'
import { UncontrolledCollapse, Button, Table, Input, Form, ButtonGroup, Container, Card, Row, Col } from 'reactstrap';
import ModelCard from './ModelCard';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DetailedModelFromInstance extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      model: 
        {
        }
    }
  }

  loadModel = () => {
    if (this.props.modelURL !== undefined) {
      // let dst = '/api/models/'.concat(this.props.modelID).concat('/');
      axios.get(this.props.modelURL).then(res => {
        this.setState({
          model: res.data
        });
      })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response, null, 2));
      });
    }
  }

  componentDidMount() {
    this.loadModel();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modelURL !== this.props.modelURL) {
      this.loadModel();
    }

  }

  renderTableHeader() {
		let header = ['vendor', 'model number', 'height',
		'display color', 'ethernet ports', 'power ports', 'cpu', 'memory', 'storage', 'comment'];
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return [this.state.model].map((model, index) => {
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
          {/* <Button onClick={() => this.props.sendShowTable(true)} >Back</Button> */}
          <br></br>
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

export default DetailedModelFromInstance
