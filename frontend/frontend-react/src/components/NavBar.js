import React from 'react'
import {AppBar, Tabs, Tab, Button, Toolbar,  IconButton, Typography } from "@material-ui/core";
import {Link} from 'react-router-dom'


export default function NavBar() {
  return (
    <div>
      <AppBar title="Django Unchained" position='sticky'>
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6">
            Django Unchained
              </Typography>
          <Button color="inherit">Log Out</Button>
        </Toolbar>

        <Tabs centered onChange>
          <Link to='/racks'>
            <Tab label='Racks' />
          </Link>
          
          <Link to='/models'>
            <Tab label='Models' />
          </Link>
          
          <Link to='/assets'>
            <Tab label='Instances' />
          </Link>
          
          <Link to='/users'>
            <Tab label='Users' />
          </Link>
          
          <Link to='/statistics'>
            <Tab label='Statistics' />
          </Link>
          
        </Tabs>
      </AppBar>
    </div>
  )
}
