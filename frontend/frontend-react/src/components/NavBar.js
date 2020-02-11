import React from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar,  IconButton, Typography } from "@material-ui/core";
import {NavLink} from 'react-router-dom'



export default function NavBar() {
  return (
    <div id='hideOnPrint'>
      <AppBar title="Django Unchained" position='sticky'>
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6">
            Django Unchained
              </Typography>
          <Button color="inherit" onClick={ function(){
            window.location = "/accounts/logout/"} }>Log Out</Button>
          {/*{FACTOR OUT ABOVE LINE TO this.HandleLogout}*/}
        </Toolbar>

        <Tabs centered onChange>
          <Typography>
          <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/racks'>
            <Tab label='Racks' />
          </NavLink>
          </Typography>

          <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/models'>
            <Tab label='Models' />
          </NavLink>
          
          <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/assets'>
            <Tab label='Instances' />
          </NavLink>
          
          <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/users'>
            <Tab label='Users' />
          </NavLink>
          
          <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/statistics'>
            <Tab label='Statistics' />
          </NavLink>
          
        </Tabs>
      </AppBar>
    </div>
  )
}
