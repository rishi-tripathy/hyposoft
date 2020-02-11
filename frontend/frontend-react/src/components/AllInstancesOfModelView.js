import React, {Component} from 'react'
import axios from 'axios'
import {Button, Table} from '@material-ui/core'
import { Link } from 'react-router-dom'

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

  loadInstances = () => {
    if (this.props.modelID) {
      let dst = '/api/models/'.concat(this.props.modelID).concat('/instances/');
      console.log(dst)
      axios.get(dst).then(res => {
        this.setState({
          instances: res.data.results
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load instances. Re-login..\n' + JSON.stringify(error.response.data, null, 2));
        });
    }
  }

  componentDidMount() {
    this.loadInstances();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modelID !== this.props.modelID) {
      this.loadInstances();
    }
  }

  renderTableHeader() {
    let header = ['hostname', 'rack', 'rack u'];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    //if (this.state.instances == null) return;
    return this.state.instances.map((instance) => {
      const {id, model, hostname, rack, owner, rack_u} = instance //destructuring
      return (
        <tr key={id}>
          <td>{hostname}</td>
          <td>{rack ? rack.rack_number : null}</td>
          <td>{rack_u}</td>
          <td>
            <Link to={'/assets/' + id}>
              <Button color="info">More details</Button>
            </Link>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        {/* <h3>Instances of this Model</h3> */}
        <Table striped hover>
          <tbody>
          <tr>{this.renderTableHeader()}</tr>
          {this.renderTableData()}
          </tbody>
        </Table>

      </div>
    )
  }
}

export default AllInstancesOfModelView
