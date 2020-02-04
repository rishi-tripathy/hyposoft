import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import DetailedModelFromInstance from './DetailedModelFromInstance'
import { UncontrolledCollapse, Button, ButtonGroup, Container, Card } from 'reactstrap';
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedInstance extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      instance: 
        {
        }
    }
  }

  loadInstance = () => {
    if (this.props.instanceID !== undefined) {
      let dst = '/api/instances/'.concat(this.props.instanceID).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          instance: res.data
        });
      })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response);
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

  render() {
    const { id, model, hostname, rack, rack_u, owner, comment } = this.state.instance;
    return (
      <div>
        <Button onClick={() => this.props.sendShowTable(true)} >Back</Button>
        <br></br>
        <div class="card">
          <div class="container">
            <h3>Detailed Instance</h3>
            <h4>ID: {id}</h4>
            <h4>Model Vendor: {model ? model.vendor : null}</h4>
            <p>Hostname: {hostname}</p> 
            <p>Rack Number: {rack ? rack.rack_number : null}</p> 
            <p>Rack_U: {rack_u}</p> 
            <p>Owner Username: {owner ? owner.username : null}</p> 
            <p>Comment: {comment}</p> 
            <div>
              <Button color="primary" id="toggler" style={{ marginBottom: '1rem' }}> See Model Details </Button>
              <UncontrolledCollapse toggler="#toggler">
                <DetailedModelFromInstance modelURL={model ? model.url : null}/>
              </UncontrolledCollapse>{' '}
            </div>
            
            {/* <DetailedModelModal modelURL={model ? model.url : null} /> */}
            {/* <button onClick={ this.showModel }>See Detailed Model</button> */}
          </div>
        </div>
        {/* <InstanceCard inst={ this.state.instance } /> */}
      </div>
    )
  }
}

export default DetailedInstance
