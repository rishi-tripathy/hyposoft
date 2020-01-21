import React, { Component } from 'react'
import InstanceTable from './InstanceTable'
import axios from 'axios'




export class InstanceController extends Component {

  constructor() {
    super();
    // add ID
    this.state = {
      instances: [
        {
          model: 'R710',
          hostname: 'server9',
          rack: 'B12',
          rack_u: 5,
          owner: 'Michael',
          comment: 'Reserved for Palaemon project'
        }
      ],
    }
  }

  getInstances() {
    axios.get('/api/instances/').then(res => {
      const b = res.data.results;
      console.log(b);
      this.setState({ instances: b });
    });
  }

  componentDidMount() {
    this.getInstances();
  }


  render() {
    return <InstanceTable instances={this.state.instances} />
  }
}

export default InstanceController
