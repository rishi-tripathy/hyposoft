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

  getLogs = () => {
    // let dst = '/api/datacenters/?show_all=true'; //want all
    let dst = '/api/log/';
    console.log("QUERY")
    console.log(dst)
    axios.get(dst).then(res => {
        let ret = res.data.results;
        return ret;
    });
      // .catch(function (error) {
      //   // TODO: handle error
      //   alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      // });
  }

  fixLogs = () => {
    let log = this.getLogs();
    // console.log(this.props.log);
    console.log(log)
    let tempLogs = log;
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
