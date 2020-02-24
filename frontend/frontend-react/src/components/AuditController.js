import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {AppBar, Grid, Container, Button, Toolbar, IconButton, Typography} from "@material-ui/core";
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
      console.log('audit controller did mount')
    this.getLogs();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   var delay = 50;
  //   console.log('in update')
  //   if(prevState.logs !== this.state.logs){
  //       setTimeout(() => {
  //           this.getLogs();
  //       }, delay);
  //   }
  // }

getLogs = () => {
    // let dst = '/api/datacenters/?show_all=true'; //want all
    let dst = '/api/log/';
    console.log("QUERY")
    console.log(dst)
    axios.get(dst).then(res => {
      console.log('getlogs promise')
      this.setState({
        logs: res.data.results,
      });
    })
      // .catch(function (error) {
      //   // TODO: handle error
      //   alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      // });
  }

  render() {
      console.log(this.state.logs)
    return(
        <Container maxwidth="xl">
            <Grid container className="themed-container" spacing={2}>
            <Grid item="flex-start" alignContent='center' xs={12}/>
            <Grid item justify="flex-start" alignContent='center' xs={10}>
                <Typography variant="h3">
                 Audit Log
                </Typography>
            </Grid>
            <Grid item xs={12}>
                { this.state.logs ? <AuditLog log={this.state.logs}/> : <p></p>}
            </Grid>
          </Grid>
        </Container>
    );
  }
}

  export default AuditContoller