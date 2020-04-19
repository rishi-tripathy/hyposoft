import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCardOffline';
import {
  Typography, Paper, IconButton, 
  Tooltip, Container, Grid,
  Table, TableRow, TableCell, TableContainer,
  TableBody,
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import DatacenterContext from './DatacenterContext';


axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedInstanceOffline extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      asset: {},
      connectedAssets: [],
    }
  }

  loadInstance = () => {
    if (this.props.match.params.id) {
      let dst = '/api/assets/'.concat(this.props.match.params.id).concat('/').concat('?offline=true');
      axios.get(dst).then(res => {
        this.setState({
          asset: res.data
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load assets. Re-login.\n' + JSON.stringify(error.response, null, 2));
        });
    }
  }


  componentDidMount() {
    this.loadInstance();
    //this.getConnectedAssets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadInstance();
      // if (this.state.asset) {
      //   this.getConnectedAssets();
      // }
    }

  }

  render() {
    console.log(this.context)
    const regex = /[a-e][0-1]?[0-9]$/
    const { id, model, hostname, owner, comment } = this.state.asset;
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Detailed Asset View
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <InstanceCard asset={[this.state.asset]} />
              </Paper>
            </Grid>
            <Grid item alignContent='center' xs={12} />
            <Grid item alignContent='center' xs={12} />

          </Grid>
        </Container>
      </div>
    )
  }
}

DetailedInstanceOffline.contextType = DatacenterContext;

export default DetailedInstanceOffline
