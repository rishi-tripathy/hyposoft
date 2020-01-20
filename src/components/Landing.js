import React, { Component } from 'react'
import ModelController from './ModelController'
import InstanceController from './InstanceController'


export class Landing extends Component {
  render() {
    return (
      <div>
        <h1>This is a dummy landing page!</h1>
        <br></br>
        <RackView />
        <br></br>
        <ModelController />
        <br></br>
        <InstanceController />
      </div>
    )
  }
}

export default Landing
