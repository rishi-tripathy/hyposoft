import React, { Component } from 'react'
import InstanceTable from './InstanceTable'

export class InstanceController extends Component {

  constructor() {
    super();
    
    // created two dummy models
    this.state = {
      instances: [
        {
          id: 1,
          model: 'R710',
          hostName: 'server9',
          rack: 'B12',
          rackU: 5,
          owner: 'Michael',
          comment: 'Reserved for Palaemon project'
        },
        {
          id: 2,
          model: 'R711',
          hostName: 'server10',
          rack: 'T12',
          rackU: 2,
          owner: 'Christina',
          comment: 'Reserved for Palaemon project'
        }
      ]
    }
  }


  render() {
    return <InstanceTable instances={this.state.instances} />
  }
}

export default InstanceController
