import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar, IconButton, Typography} from "@material-ui/core";
import {NavLink} from 'react-router-dom'
import {Autocomplete} from "@material-ui/lab"
import DatacenterNavbar from './DatacenterNavbar'
import axios, {post} from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AuditLog extends Component{

  constructor() {
    super();
  }

  fixLogs = () => {
    console.log(this.props.logs);
    let tempLogs = this.props.logs;
    let objectLogs = [];
    let users = [];
    let dateTimes = [];

    for(var i in Object.keys()){
        console.log(i);
    }
  }

  render() {
    this.fixLogs();
      let content = 'sup';
      return(
          content
      );
  }
}

export default AuditLog
