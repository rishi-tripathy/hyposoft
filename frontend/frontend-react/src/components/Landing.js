import React, { Component } from 'react'
import TestAPI from './TestAPI'
import AddUserModal from './AddUserModal'
import LogoutModal from './LogoutModal'


export class Landing extends Component {
  render() {
    return (
      <div>
        <h1>This is a dummy landing page!</h1>
        <AddUserModal />
        <LogoutModal />
       </div>
    )
  }
}

export default Landing