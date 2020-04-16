import React, { Component } from 'react'
import {
  Grid, Button, Container, Paper,
  ButtonGroup, Switch, FormControlLabel,
  Typography, Tooltip, IconButton, CircularProgress
} from "@material-ui/core"
import axios from 'axios'
import DecommissionedTable from './DecommissionedTable'

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
      filterQuery: '',
      rerender: false,
    }
  }

  componentDidMount() {
    this.getDecommissionedAssets();
  }

  componentDidUpdate(prevProps, prevState) {
    const delay = 50;
    // // When showing table again, rerender
    // if (prevState.showTableView === false && this.state.showTableView === true) {
    //   setTimeout(() => {
    //     this.getInstances();
    //   }, delay);
    // }

    // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery) {
      setTimeout(() => {
        this.getDecommissionedAssets();
      }, delay);
    }
  }

  getDecommissionedAssets = () => {
    let dst = '/api/decommissioned/?' + this.state.filterQuery
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

  getAllDecommissionedAssets = () => {
    let dst = '/api/decommissioned/?show_all=true'
    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      this.setState({
        decommissionedAssets: res.data,
        prevPage: null,
        nextPage: null,
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

  paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({
        decommissionedAssets: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  paginatePrev = () => {
    axios.get(this.state.prevPage).then(res => {
      this.setState({
        decommissionedAssets: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  toggleShowingAll = () => {
    this.state.showingAll ? (
      this.getDecommissionedAssets()
    ) : (this.getAllDecommissionedAssets())
    this.setState(prevState => ({
      showingAll: !prevState.showingAll
    }));
  }

  getFilterQuery = (q) => {
    this.setState({ filterQuery: q });
  }

  render() {
    console.log(JSON.stringify(this.state.decommissionedAssets, null, 2))
    let content = <DecommissionedTable
      assets={this.state.decommissionedAssets}
      filter_query={this.getFilterQuery}
    // sendSortQuery={this.getSortQuery}
    // sendRerender={this.getRerender}
    />;


    let showAll = <p></p>;
    if (this.state.prevPage != null || this.state.nextPage != null || this.state.showingAll) {
      showAll = <FormControlLabel labelPlacement="left"
        control={
          <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()} />
        }
        label={
          <Typography variant="subtitle1"> Show All</Typography>
        }
      />
    }

    let paginateNavigation = <p></p>;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation =

        <ButtonGroup>
          <Button color="primary" disabled onClick={this.paginatePrev}>prev page
          </Button>{"  "}<Button color="primary" onClick={this.paginateNext}>next page</Button>
        </ButtonGroup>
    } else if (this.state.prevPage != null && this.state.nextPage == null) {
      paginateNavigation =
        <ButtonGroup>
          <Button color="primary" onClick={this.paginatePrev}>prev page
          </Button>{"  "}<Button color="primary" disabled onClick={this.paginateNext}>next page</Button>
        </ButtonGroup>
    } else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation =
        <ButtonGroup>
          <Button color="primary" onClick={this.paginatePrev}>prev page
          </Button>{"  "}<Button color="primary" onClick={this.paginateNext}>next page</Button>
        </ButtonGroup>
    }


    return (
      <div>
        <Container maxwidth="xl">
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
              {this.state.loading ? <center><CircularProgress size={100} /></center> : content}
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default DecommissionedController
