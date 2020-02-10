import React, { Component } from 'react'
import TestAPI from './TestAPI'
import AddUserModal from './AddUserModal'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar,  IconButton, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu'



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
         <AppBar title="Django Unchained" position='sticky'>

           <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              Django Unchained
            </Typography>
            <Button color="inherit">Log Out</Button>
          </Toolbar>

           <Tabs centered onChange>
            <Tab label= 'Racks' />
            <Tab label= 'Models' />
            <Tab label= 'Instances' />
            <Tab label= 'Users' />
            <Tab label= 'Statistics' />
          </Tabs>
        </AppBar>
      </div>
    )
  }
}
    {/*<Navbar color="light" light expand="md">*/}
        {/*  <Nav>*/}
        {/*    <NavbarBrand href="/">Hyposoft</NavbarBrand>*/}
        {/*  </Nav>*/}
        {/*  <NavbarText><Button onClick={this.handleLogout}>Log Out</Button></NavbarText> {'     '}*/}
        {/*  <NavbarText> Powered by Django Unchained </NavbarText>*/}
        {/*</Navbar>*/}
export default Landing