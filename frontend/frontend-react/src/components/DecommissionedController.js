import React, { Component } from 'react'
import {
  Grid, Button, Container, Paper,
  ButtonGroup, Switch, FormControlLabel,
  Typography, Tooltip, IconButton, CircularProgress
} from "@material-ui/core"
import axios from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DecommissionedController extends Component {

  constructor() {
    super();
    this.state = {
      decommissionedAssets: [],
      prevPage: null,
      nextPage: null,
      showingAll: false,
      loading: true,
    }
  }

  componentDidMount() {
    this.getDecommissionedAssets();
  }

  getDecommissionedAssets = () => {
    let dst;
    // datacenter stuff commented
    // if (this.state.datacenterID === -1 || this.state.datacenterID == null) {
    //   dst = '/api/assets/' + '?' + this.state.filterQuery + '&' + this.state.sortQuery;
    // }
    // else {
    //   dst = '/api/assets/' + '?' + 'datacenter=' + this.state.datacenterID + '&' + this.state.filterQuery + '&' + this.state.sortQuery;
    // }

    dst = '/api/decommissioned/'

    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      this.setState({
        decommissionedAssets: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
        loading: false,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        this.setState({
          loading: false,
        })
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  render() {
    //console.log(JSON.stringify(this.state.decommissionedAssets, null, 2))
    let content = <InstanceTableMUI
      assets={this.state.assets}
      // filter_query={this.getFilterQuery}
      // sendSortQuery={this.getSortQuery}
      // sendRerender={this.getRerender}
      />;


    let showAll = <p></p>;
    if (this.state.prevPage != null || this.state.nextPage != null) {
      showAll = <FormControlLabel labelPlacement="left"
        control={
          <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()} />
        }
        label={
          <Typography variant="subtitle1"> Show All</Typography>
        }
      />
    }
    return (
      <div>
        {/* <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item xs={12}>
              <Typography variant="h3">
                Decommissioned Table
              </Typography>
            </Grid>
            <Grid item justify="flex-end" alignContent="flex-end" xs={3}>
              {showAll}
            </Grid>
            <Grid item justify="flex-end" alignContent="flex-end" xs={3}>
              {paginateNavigation}
            </Grid>
            <Grid item xs={12}>
              {this.state.loading ? <center><CircularProgress size={100} /></center> : content};
            </Grid>
          </Grid>
        </Container> */}
      </div>
    )
  }
}

export default DecommissionedController
