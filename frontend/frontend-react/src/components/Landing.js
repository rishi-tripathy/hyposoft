import React, { Component } from 'react'
import ModelController from './ModelController'
import InstanceController from './InstanceController'
import TestAPI from './TestAPI'
import AddUserModal from './AddUserModal'


export class Landing extends Component {
  render() {
    return (
      <div>
        <h1>This is a dummy landing page!</h1>
        <AddUserModal />
        <br></br>
        <ModelController />
        <br></br>
        {/* <TestAPI /> */}
        <InstanceController />
      </div>
    )
  }
}

export default Landing