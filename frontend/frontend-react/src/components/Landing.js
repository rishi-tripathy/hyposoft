import React, { Component } from 'react'
import TestAPI from './TestAPI'
import AddUserModal from './AddUserModal'


export class Landing extends Component {

  handleLogout() {
    window.location = "/accounts/logout/";
    console.log(window.location);
  }


  render() {
    return (
      <div>
        <h1>This is a dummy landing page!</h1>
        <AddUserModal />
        <div id="LogoutButton">
          <button onClick={this.handleLogout}>Log Out</button>
        </div>
       </div>
    )
  }
}

export default Landing