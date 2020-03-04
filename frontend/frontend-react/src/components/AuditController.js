import React, {Component} from 'react'
import '../stylesheets/Printing.css'
import {
  AppBar,
  Grid,
  Container,
  Button,
  Toolbar,
  IconButton,
  Typography,
  ButtonGroup,
  FormControlLabel, Switch
} from "@material-ui/core";
import {NavLink} from 'react-router-dom'
import {Autocomplete} from "@material-ui/lab"
import DatacenterNavbar from './DatacenterNavbar'
import axios, {post} from 'axios'
import AuditLog from './AuditLog'
import CircularProgress from '@material-ui/core/CircularProgress';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AuditController extends Component {

  constructor() {
    super();
    this.state = {
      logs: null,
      prevPage: null,
      nextPage: null,
      showingAll: null,
      filterQuery: "",
      loading: true,
    };
  }

  componentDidMount() {
    console.log('audit controller did mount')
    this.getLogs();
  }

  getLogs = () => {
    // let dst = '/api/datacenters/?show_all=true'; //want all
    let dst = '/api/log/log/?' + this.state.filterQuery ;
    console.log("QUERY")
    console.log(dst)
    axios.get(dst).then(res => {
      console.log('getlogs promise')
      this.setState({
        logs: res.data.results,
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
        alert("Cannot load. Re-login.\n" + JSON.stringify(error.response, null, 2));
      });
  }

  paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({
        logs: res.data.results,
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
        logs: res.data.results,
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
      this.getLogs()
    ) : (this.getAllLogs())
    this.setState(prevState => ({
      showingAll: !prevState.showingAll
    }));
  }

  getAllLogs = () => {
    this.setState({
      loading: true,
    })
    let filter = this.state.filterQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + '&';
    }

    let dst = '/api/log/log/?' + filter + 'show_all=true';

    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      this.setState({
        logs: res.data,
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
        console.log(error.response.data)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  getFilterQuery = (fq) => {
    this.setState({
      filterQuery: fq
    });
  }


  componentDidUpdate(prevProps, prevState) {
    var delay = 50;
    // console.log('in update')
     // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery) {
      setTimeout(() => {
        this.getLogs();
      }, delay);
    }
  }


  render() {

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

    let showAll = <FormControlLabel labelPlacement="left"
                                    control={
                                      <Switch value={this.state.showingAll} onChange={() => this.toggleShowingAll()}/>
                                    }
                                    label={
                                      <Typography variant="subtitle1"> Show All</Typography>
                                    }
    />

    console.log(this.state.logs)
    return (
      <Container maxwidth="xl">
        <Grid container className="themed-container" spacing={2}>
          <Grid item="flex-start" alignContent='center' xs={10}/>
          <Grid item="flex-start" alignContent='flex-end' xs={2}>
            {showAll}
          </Grid>
          <Grid item justify="flex-start" alignContent='center' xs={9}>
            <Typography variant="h3">
              Audit Log
            </Typography>
          </Grid>
          <Grid item="flex-start" alignContent='flex-end' xs={3}>
            {paginateNavigation}
          </Grid>
          <Grid item xs={12}>
            
            {this.state.loading ?
              <center>
                <CircularProgress size={100}/>
              </center> 
            : 
              <AuditLog sendToTopLevel={this.getFilterQuery} log={this.state.logs}/>
            }
            
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default AuditController