import React, { Component } from 'react'
import '../stylesheets/TableView.css'
import axios from 'axios'

export class InstanceTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      model : '/api/users/',
      rack : '/api/users/',
      rack_u : '/api/users/'
    }
  }

  componentDidMount() {
    axios.get(this.state.model).then(res => {
      const b = res.data.results;
      console.log(b);
      this.setState({ instances: b });
    });
  }

  renderTableHeader() {
    let header = Object.keys(this.props.instances[0])
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.instances.map((instance, index) => {
        // TODO: add id
        const { model, hostname, rack, rack_u, owner, comment } = instance //destructuring
        
        return (
          // TODO: use id
          <tr key={rack_u}>
              <td>{model}</td>
              <td>{hostname}</td>
              <td>{rack}</td>
              <td>{rack_u}</td>
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
