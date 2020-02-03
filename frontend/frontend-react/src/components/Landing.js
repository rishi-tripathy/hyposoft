import React, { Component } from 'react'
import TestAPI from './TestAPI'
import AddUserModal from './AddUserModal'


const headerStyle = {
  width: 100 + '%',
  padding: 0, 
  backgroundColor: 'lightblue',
}

export class Landing extends Component {

  handleLogout() {
    window.location = "/accounts/logout/";
    console.log(window.location);
  }


  render() {
    return (
      <div>
        <div style={headerStyle}>
          a header
          <div id="LogoutButton">
            <button onClick={this.handleLogout}>Log Out</button>
          </div>
        </div>
        
       </div>
    )
  }
}

export default Landing