import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar, IconButton, Typography} from "@material-ui/core";
import {NavLink} from 'react-router-dom'
import {Autocomplete} from "@material-ui/lab"
import DatacenterNavbar from './DatacenterNavbar'
import axios, {post} from 'axios'
import AuditLog from './AuditLog'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AuditContoller extends Component{

  constructor() {
    super();
    this.state = {
        logs: null,
    };
  }

  componentDidMount() {
    this.getLogs();
  }

getLogs = () => {
    // let dst = '/api/datacenters/?show_all=true'; //want all
    let dst = '/api/log/';
    console.log("QUERY")
    console.log(dst)
    setTimeout(() => {
    axios.get(dst).then(res => {
      this.setState({
        logs: res.data.results,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      });
  }, 50);
}

  render() {
      console.log(this.state.logs)
    return(
        <div>
            <AuditLog logs={this.state.logs}/>
        </div>
    );
  }
}

  export default AuditContoller