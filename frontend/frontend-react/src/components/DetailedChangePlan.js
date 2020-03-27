import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import {
  Typography, Paper, IconButton, 
  Tooltip, Container, Grid,
  Table, TableRow, TableCell, TableContainer,
  TableBody,
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import AllConnectedAssetsView from './AllConnectedAssetsView'
import PowerManagement from './PowerManagement'
import AssetNetworkGraph from './AssetNetworkGraph'
import DatacenterContext from './DatacenterContext';


axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedChangePlan extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      changePlan: {},
    }
  }

  render() {
    console.log(this.context)
    const regex = /[a-e][0-1]?[0-9]$/
    const { id, name, status, objects } = this.state.changePlan;
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Detailed Change Plan: {name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <InstanceCard asset={[this.state.asset]} />
              </Paper>
            </Grid>
            <Grid item alignContent='center' xs={12} />
            <Grid item alignContent='center' xs={12} />

            <Grid item xs={6}>

            </Grid>
          </Grid>

        </Container>
      </div>
    )
  }
}

DetailedChangePlan.contextType = DatacenterContext;

export default DetailedChangePlan
