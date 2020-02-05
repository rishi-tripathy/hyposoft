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

  handleLogout() {
    window.location = "/accounts/logout/";
    console.log(window.location);
  }


  render() {
    return (
      <div id='hideOnPrint'>
        <Navbar color="light" light expand="md">
          <Nav>
            <NavbarBrand href="/">Hyposoft</NavbarBrand>
          </Nav>
          
          <NavbarText><Button onClick={this.handleLogout}>Log Out</Button></NavbarText> {'     '}
          <NavbarText> Powered by Django Unchained </NavbarText>
        </Navbar>
       </div>
    )
  }
}

export default Landing