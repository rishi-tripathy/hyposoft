import React, { Component } from 'react'
import TestAPI from './TestAPI'
import AddUserModal from './AddUserModal'
import '../stylesheets/Printing.css'
import { Button, ButtonGroup, Navbar, NavbarBrand, NavbarText, Nav } from 'reactstrap';



const headerStyle = {
  width: 100 + '%',
  padding: 0, 
  backgroundColor: 'lightblue',
}

export class Landing extends Component {

  handleLogout = () => {
    // this.props.loggingOut(false); 
    window.location = "/accounts/logout/";
  }


  render() {
    return (
      <div id='hideOnPrint'>
        <Navbar color="light" light expand="md">
          <Nav>
            <NavbarBrand href="/">Hyposoft</NavbarBrand>
          </Nav>
          
          <NavbarText><Button onClick={this.handleLogout}>Log Out</Button></NavbarText>
          
        </Navbar>
       </div>
    )
  }
}

export default Landing