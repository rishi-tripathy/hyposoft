import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar, IconButton, Typography} from "@material-ui/core";
import {NavLink} from 'react-router-dom'
import {Autocomplete} from "@material-ui/lab"
import DatacenterNavbar from './DatacenterNavbar'
import axios, {post} from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class NavBar extends Component{

  constructor() {
    super();

    this.state = {
      datacenter: [{}],
    };
  }

  getDatacenters = () => {
    // let dst = '/api/datacenters/?show_all=true'; //want all
    let dst = '/api/datacenters/?&';
    console.log("QUERY")
    console.log(dst)
    axios.get(dst).then(res => {
      this.setState({
        datacenters: res.data.results,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      })
  }

  componentDidMount() {
    this.getDatacenters();
 }
 
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
              <DatacenterNavbar datacenters={this.state.datacenters}/>
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

          </Tabs>
        </AppBar>
      </div>
    )
  }
}

export default NavBar
