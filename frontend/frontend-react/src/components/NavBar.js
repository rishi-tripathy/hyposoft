import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar, IconButton, Typography} from "@material-ui/core";
import {NavLink} from 'react-router-dom'
import {Autocomplete} from "@material-ui/lab"
import DatacenterDropdownNavBar from './DatacenterDropdownNavBar'


export class NavBar extends Component{

  render() {

    return (
      <div id='hideOnPrint'>
        <AppBar title="Django Unchained"  position='sticky'>
          <Toolbar>
            {/* <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6">
              Django Unchained
            </Typography>
            <Button style={{marginLeft: 'auto'}}>
              <DatacenterDropdownNavBar />
            </Button>
            <Button color="inherit"  onClick={function () {
              window.location = "/accounts/logout/"
            }}>Log Out</Button>
            {/*TODO: {FACTOR OUT ABOVE LINE TO this.HandleLogout}  */}
          </Toolbar>

          <Tabs centered onChange>

          <Typography>
              <NavLink style={{color: 'white'}} activeStyle={{color: '#FF90AB'}} to='/datacenters'>
                <Tab label='Datacenters'/>
              </NavLink>
            </Typography>

            <Typography>
              <NavLink style={{color: 'white'}} activeStyle={{color: '#FF90AB'}} to='/racks'>
                <Tab label='Racks'/>
              </NavLink>
            </Typography>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#FF90AB'}} to='/models'>
              <Tab label='Models'/>
            </NavLink>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#FF90AB'}} to='/assets'>
              <Tab label='Instances'/>
            </NavLink>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/users'>
              <Tab label='Users'/>
            </NavLink>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/statistics'>
              <Tab label='Statistics'/>
            </NavLink>

          </Tabs>
        </AppBar>
      </div>
    )
  }
}

export default NavBar
