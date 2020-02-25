import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Tabs, Tab, Button, Toolbar, IconButton, Typography} from "@material-ui/core";
import {NavLink} from 'react-router-dom'
import {Autocomplete} from "@material-ui/lab"
import AuditLogTable from './AuditLogTable'
import axios, {post} from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AuditLog extends Component{

  constructor() {
    super();
  }

  fixLogs = () => {
    // let log = this.getLogs();
    // console.log(this.props.log);
    console.log(this.props.log)
    let tempLogs = this.props.log;
    let objectLogs = [];
    let users = [];
    let dateTimes = [];

    for(var i in Object.keys(tempLogs)){
      console.log(i)
      console.log(tempLogs[i].objectlog);
      console.log(tempLogs[i].user);
      console.log(tempLogs[i].datetime);

      objectLogs.push(tempLogs[i].objectlog);
      users.push(tempLogs[i].user);
      dateTimes.push(tempLogs[i].datetime);
    }
    return (
    <AuditLogTable objectList={objectLogs}
      userList={users}
      dateTimeList={dateTimes}/>
    )
  }

  render() {
      return(
         this.fixLogs()
      );
  }
}

export default AuditLog
