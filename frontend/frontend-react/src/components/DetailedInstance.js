import React, {Component} from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import DetailedModelFromInstance from './DetailedModelFromInstance'
import {
  UncontrolledCollapse,
  Button,
  Table,
  FormGroup,
  Input,
  Form,
  ButtonGroup,
  Container,
  Card,
  Row,
  Col
} from 'reactstrap';

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
    if (this.props.instanceID) {
      let dst = '/api/instances/'.concat(this.props.instanceID).concat('/');
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
    if (prevProps.instanceID !== this.props.instanceID) {
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
      const {id, model, hostname, rack, owner, rack_u, comment} = instance //destructuring

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
        <Button onClick={() => this.props.sendShowTable(true)}>Back</Button>
        <br></br>
        <Table hover striped>
          <tbody>
          <tr>{this.renderTableHeader()}</tr>
          {this.renderTableData()}
          </tbody>
        </Table>

        <div>
          <Button color="primary" id="toggler" style={{marginBottom: '1rem'}}> See Model Details </Button>
          <UncontrolledCollapse toggler="#toggler">
            <DetailedModelFromInstance modelURL={model ? model.url : null}/>
          </UncontrolledCollapse>{' '}
        </div>


        {/* <InstanceCard inst={ this.state.instance } /> */}
      </div>
    )
  }
}

export default DetailedInstance
