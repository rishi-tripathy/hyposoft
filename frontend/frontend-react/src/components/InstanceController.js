import React, { Component } from 'react'
import InstanceTable from './InstanceTable'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class InstanceController extends Component {

  constructor() {
    super();
    this.state = {
      instances: [
        {
          id: 99,
          model: 'default',
          hostname: 'default',
          rack: 'B12',
          rack_u: 5,
          owner: 'Michael',
          comment: 'Reserved for Palaemon project'
        }
      ],
    }
  }

  getInstances() {
    let modelAPIDest, rackAPIDest, ownerAPIDest;

    axios.get('/api/instances/').then(res => {
      // list of instances
      const instanceList = res.data.results;

      // TODO: integrate
      console.log(instanceList);
      if (instanceList[0] == null) {
        console.log('instances[0] is null');
        return;
      }

      // this works for nested stuff
      // waiting for miles to update API
      // axios.get(modelAPIDest).then(r => {
      //   console.log(r);
      // })

      // this.setState({ instances: instanceList });
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });

  }

  componentDidMount() {
    this.getInstances();
  }


  render() {
    if (this.state.instances[0] == null) {
      return <p>No instances</p>
    } else {
      return <InstanceTable instances={this.state.instances} />
    }

  }
}

export default InstanceController