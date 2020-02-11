import React, {Component} from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import DetailedModelFromInstance from './DetailedModelFromInstance'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedInstance extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      instance:
        {}
    }
  }

  loadInstance = () => {
    if (this.props.match.params.id) {
      let dst = '/api/instances/'.concat(this.props.match.params.id).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          instance: res.data
        });
      })
        .catch(function (error) {
          // TODO: handle error
          console.log(error.response)
          alert('Cannot load instances. Re-login.\n' + JSON.stringify(error.response, null, 2));
        });
    }
  }

  componentDidMount() {
    this.loadInstance();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadInstance();
    }

  }

  renderTableHeader() {
    let header = ['model vendor', 'model number', 'hostname', 'rack', 'rack u', 'owner_username', 'comment'];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return [this.state.instance].map((instance) => {
      const { id, model, hostname, rack, owner, rack_u, comment } = instance //destructuring

      return (
        <tr key={id}>
          <td>{model ? model.vendor : null}</td>
          <td>{model ? model.model_number : null}</td>
          <td>{hostname}</td>
          <td>{rack ? rack.rack_number : null}</td>
          <td>{rack_u}</td>
          <td>{owner ? owner.username : null}</td>
          <td>{comment}</td>
        </tr>
      )
    })
  }

  render() {
    const {id, model, hostname, rack, rack_u, owner, comment} = this.state.instance;
    return (
      <div>
        <Table hover striped>
          <tbody>
            <tr>{this.renderTableHeader()}</tr>
            {this.renderTableData()}
          </tbody>
        </Table>

        <div>
          {model ? (
            <div>
              <Link to={'/models/' + model.id}>
                <Tooltip title='View Details'>
                  {/* onClick={() => this.showDetailedModel(id)} */}
                  <IconButton size="sm" >
                    <PageviewIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          ) : <p></p>}
        </div>
      </div>
    )
  }
}

export default DetailedInstance
