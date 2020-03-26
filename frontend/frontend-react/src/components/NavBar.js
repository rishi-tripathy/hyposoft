import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar, IconButton, Typography} from "@material-ui/core";
import {NavLink} from 'react-router-dom'
import {Autocomplete} from "@material-ui/lab"
import DatacenterNavbar from './DatacenterNavbar'
import axios, {post} from 'axios'
import DatacenterContext from './DatacenterContext'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class NavBar extends Component{

  constructor() {
    super();

    this.state = {
      datacenters: [{}],
    };
  }

  componentDidMount() {
    // console.log( this.context.datacenterOptions)
      this.setState({
        datacenters: this.context.datacenterOptions,
      })
    // console.log('set DCs')
 }
 
  render() {
    // console.log(this.state.datacenters)
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
              <DatacenterNavbar />
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
              <Tab label='Assets'/>
            </NavLink>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/users'>
              <Tab label='Users'/>
            </NavLink>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/statistics'>
              <Tab label='Statistics'/>
            </NavLink>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/log'>
              <Tab label='Audit Log'/>
            </NavLink>

            <NavLink style={{color: 'white'}} activeStyle={{color: '#dc004e'}} to='/changeplans'>
              <Tab label='Change Plans'/>
            </NavLink>

          </Tabs>
        </AppBar>
      </div>
    )
  }
}

NavBar.contextType = DatacenterContext;

export default NavBar
