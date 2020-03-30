import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import AuditLogTable from './AuditLogTable'
import axios, {post} from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AuditLog extends Component {

  constructor() {
    super();
  }

  getToLogLevel = (fq) => {
      console.log(fq)
    this.props.sendToTopLevel(fq)
  }

  fixLogs = () => {
    // let log = this.getLogs();
    // console.log(this.props.log);
    console.log(this.props.log)
    let tempLogs = this.props.log;
    let objectLogs = [];
    let users = [];
    let dateTimes = [];

    for (var i in Object.keys(tempLogs)) {
      console.log(i)
      console.log(tempLogs[i].objectlog);
      console.log(tempLogs[i].user);
      console.log(tempLogs[i].datetime);

      objectLogs.push(tempLogs[i].objectlog);
      users.push(tempLogs[i].user);
      dateTimes.push(tempLogs[i].datetime);
    }
    return (
      <AuditLogTable
                    sendToLogLevel={this.getToLogLevel}
                     objectList={objectLogs}
                     userList={users}
                     dateTimeList={dateTimes}/>
    )
  }

  render() {
    return (
      this.fixLogs()
    );
  }
}

export default AuditLog
