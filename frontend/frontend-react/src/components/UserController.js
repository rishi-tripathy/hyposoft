import React, { Component } from 'react'
import AddUserModal from './AddUserModal'

export class UserController extends Component {
  render() {
    return (
      <div>
        <p>Users and shit</p>
        <AddUserModal />
      </div>
    )
  }
}

export default UserController
