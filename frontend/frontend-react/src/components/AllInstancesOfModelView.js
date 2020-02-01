import React, { Component } from 'react'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class AllInstancesOfModelView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      instances: [{}]
    }
  }

  showDetailedInstance = (id) => {
    this.props.sendShowDetailedInstance(true);
    this.props.sendInstanceID(id);
  }

  componentDidMount() {
    let dst = '/api/models/'.concat(this.props.modelID).concat('/instances/');
    axios.get(dst).then(res => {
      this.setState({
        instances: res.data.results
      });
    });
  }

  renderTableHeader() {
    let header = ['id', 'hostname', 'rack', 'rack_u'];
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.state.instances.map((instance) => {
      const { id, model, hostname, rack, owner, rack_u } = instance //destructuring
      return (
        <tr key={id}>
          <td>{id}</td>
          <td>{hostname}</td>
          <td>{rack ? rack.rack_number : null}</td>
          <td>{rack_u}</td>
          <td><button onClick={ () => this.showDetailedInstance(id) }>More details</button></td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <h3>Instances of this Model</h3>
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

export default AllInstancesOfModelView
