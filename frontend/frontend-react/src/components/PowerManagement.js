import React, { Component } from 'react'
import axios from 'axios'
import {
  Collapse, Table, TableBody,
  Button, TableCell, TableContainer,
  TableRow, Toolbar,
  Typography, Paper, IconButton,
  Tooltip, TableSortLabel, Container,
  Grid, TextField
} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class PowerManagement extends Component {

  constructor() {
    super();
    this.state = {
      status: null,
      isLoading: false,
    }
  }

  handleStatusUpdate = () => {
    this.setState({ isLoading: true })
    const dst = '/api/assets/' + this.props.assetID + '/get_pp_status/';
    axios.get(dst).then(res => {
      let statusArray = res.data.statuses
      let out;
      if (statusArray.indexOf('ON') > -1) {
        out = 'ON'
      }
      else {
        out = 'OFF'
      }

      this.setState({
        status: out,
        isLoading: false
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load statuses.\n' + JSON.stringify(error.response, null, 2));
        this.setState({ isLoading: false })
      });
  }

  handleOnToggle = () => {
    this.setState({ isLoading: true })
    const dst = '/api/assets/' + this.props.assetID + '/update_pp_state/';
    const onState = {}
    onState.status = 'ON'
    axios.post(dst, onState)
      .then(function (response) {
        alert('Toggle was successful.\n' + JSON.stringify(response.data, null, 2));
        this.setState({ isLoading: false })
      })
      .catch(function (error) {
        alert('Toggle was not successful (on).\n' + JSON.stringify(error.response, null, 2));
        //this.setState({ isLoading: false })
      });
    this.setState({ isLoading: false })
  }

  handleOffToggle = () => {
    this.setState({ isLoading: true })
    const dst = '/api/assets/' + this.props.assetID + '/update_pp_state/';
    const offState = {}
    offState.status = 'OFF'
    axios.post(dst, offState)
      .then(function (response) {
        alert('Toggle was successful.\n' + JSON.stringify(response.data, null, 2));
        this.setState({ isLoading: false })
      })
      .catch(function (error) {
        alert('Toggle was not successful (off).\n' + JSON.stringify(error.response, null, 2));
        //this.setState({ isLoading: false })
      });
    this.setState({ isLoading: false })
  }

  handleCycleToggle = () => {
    this.setState({ isLoading: true })
    const offState = {}
    offState.status = 'OFF'
    const onState = {}
    onState.status = 'ON'
    const dst = '/api/assets/' + this.props.assetID + '/update_pp_state/';
    axios.post(dst, offState)
      .then((res) => {
        // do something with Google res
        const delay = 2000;
        setTimeout(() => {
          return axios.post(dst, onState);
        }, delay);
      })
      .then((res) => {
        // do something with Apple res
        alert('Toggle was successful.\n' + JSON.stringify(res.data, null, 2));
        this.setState({ isLoading: false })
      })
      .catch((err) => {
        // handle err
        alert('Toggle was un-successful.\n' + JSON.stringify(err.response, null, 2));
        //this.setState({ isLoading: false })
      });
    this.setState({ isLoading: false })
  }

  render() {
    return (
      <div>
        <Paper>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label='PDU Status'
                type="text"
                fullWidth
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={this.state.status}
                onChange={e => {
                  // let modelCopy = JSON.parse(JSON.stringify(this.state.model))
                  // modelCopy.height = e.target.value
                  // this.setState({
                  //   model: modelCopy
                  // })
                }} />{' '}
            </Grid>

            <Grid item xs={6}>
              <Button variant="outlined" color="primary" onClick={this.handleStatusUpdate}>
                Refresh Status
            </Button>
            </Grid>

            <Grid item xs={6}>
              <Button color="primary" onClick={this.handleOnToggle}>
                ON
            </Button>{'  '}
              <Button color="primary" onClick={this.handleOffToggle}>
                OFF
            </Button>{'  '}
              <Button color="primary" onClick={this.handleCycleToggle}>
                CYCLE
            </Button>{'  '}
            </Grid>

            <Grid item xs={6}>
              {
                this.state.isLoading ? (
                  <CircularProgress />
                ) : <p></p>
              }
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

export default PowerManagement
