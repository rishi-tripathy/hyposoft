import React, { Component } from 'react'
import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"
import axios from 'axios'
import { configure } from '@testing-library/react';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class NetworkPortConnectionDialog extends Component {

  constructor() {
    super();
    this.state = {

      assets: [],
      networkPorts: [],

      selectedAssetOption: null,
      selectedNetworkPortOption: null,

      datacenterID: null,

      open: false,
      configured: false,
    }
  }

  componentDidMount() {
    this.setState({ datacenterID: this.props.dcID })
    //this.loadAssets();
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.dcID !== prevProps.dcID) {
      this.setState({ datacenterID: this.props.dcID })
    }

    if (this.state.datacenterID !== prevState.datacenterID && this.state.datacenterID) {
      this.loadAssets();
    }

    if (this.state.selectedAssetOption != prevState.selectedAssetOption) {
      if (this.state.selectedAssetOption) {
        this.loadNetworkPorts();
      }
      else {
        this.setState({ networkPorts: [], selectedNetworkPortOption: null });
      }
    }

    if (prevProps.connectedPortID !== this.props.connectedPortID && this.props.connectedPortID) {
      this.setState({ configured: true })
      this.props.sendNetworkPortConnectionID(this.props.indexOfThisNPConfig, this.props.connectedPortID)
    }
  }

  loadAssets = () => {
    let dst = '/api/assets/?datacenter=' + this.state.datacenterID + '&show_all=true';
    console.log(dst)
    axios.get(dst).then(res => {
      console.log(res)
      this.setState({
        assets: res.data,
      });
    })
      .catch(function (error) {
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadNetworkPorts = () => {
    let dst = '/api/assets/' + this.state.selectedAssetOption.id + '/';
    axios.get(dst).then(res => {
      this.setState({
        networkPorts: res.data.network_ports,
      });
    })
      .catch(function (error) {
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.props.sendNetworkPortConnectionID(this.props.indexOfThisNPConfig, null);
    // reset all selections and close
    this.setState({
      datacenterID: null,
      selectedAssetOption: null,
      selectedNetworkPortOption: null,
      open: false,
      configured: false,
    })
  };

  handleSubmit = () => {
    this.props.sendNetworkPortConnectionID(this.props.indexOfThisNPConfig, this.state.selectedNetworkPortOption.id);
    this.setState({ open: false })
  }

  handleChangeAsset = (event, ass) => {
    this.setState({
      selectedAssetOption: ass,
    })
  };

  handleChangeNetworkPort = (event, np) => {
    this.setState({
      selectedNetworkPortOption: np,
    })
  }

  createSelectionBoxes = () => {
    let selections = [];
    selections.push(
      <Autocomplete
        autoComplete
        autoHighlight
        autoSelect
        id="asset-select"
        options={this.state.assets}
        getOptionLabel={option => option.hostname}
        onChange={this.handleChangeAsset}
        value={this.state.selectedAssetOption}
        renderInput={params => (
          <TextField {...params} label="Asset" fullWidth />
        )}
      />
    );

    if (this.state.datacenterID && this.state.selectedAssetOption) {
      selections.push(
        <Autocomplete
          autoComplete
          autoHighlight
          autoSelect
          id="np-select"
          options={this.state.networkPorts}
          getOptionLabel={option => option.name}
          onChange={this.handleChangeNetworkPort}
          value={this.state.selectedNetworkPortOption}
          renderInput={params => (
            <TextField {...params} label="Network Port" fullWidth />
          )}
        />
      )
    }


    // if (this.state.selectedDatacenterOption) {
    //   selections.push(
    //     <Autocomplete
    //       autoComplete
    //       autoHighlight
    //       autoSelect
    //       id="rack-select"
    //       options={this.state.racks}
    //       getOptionLabel={option => option.rack_number}
    //       onChange={this.handleChangeRack}
    //       value={this.state.selectedRackOption}
    //       renderInput={params => (
    //         <TextField {...params} label="Rack" fullWidth />
    //       )}
    //     />
    //   );
    // }

    // if (this.state.selectedDatacenterOption && this.state.selectedRackOption) {
    //   selections.push(
    //     <Autocomplete
    //       autoComplete
    //       autoHighlight
    //       autoSelect
    //       id="asset-select"
    //       options={this.state.assets}
    //       getOptionLabel={option => option.hostname}
    //       onChange={this.handleChangeAsset}
    //       value={this.state.selectedAssetOption}
    //       renderInput={params => (
    //         <TextField {...params} label="Asset" fullWidth />
    //       )}
    //     />
    //   )
    // }

    // if (this.state.selectedDatacenterOption && this.state.selectedRackOption && this.state.selectedAssetOption) {
    //   selections.push(
    //     <Autocomplete
    //       autoComplete
    //       autoHighlight
    //       autoSelect
    //       id="np-select"
    //       options={this.state.networkPorts}
    //       getOptionLabel={option => option.name}
    //       onChange={this.handleChangeNetworkPort}
    //       value={this.state.selectedNetworkPortOption}
    //       renderInput={params => (
    //         <TextField {...params} label="Network Port" fullWidth />
    //       )}
    //     />
    //   )
    // }
    return selections;
  }

  render() {
    console.log(this.props)
    console.log(this.state)
    // console.log(this.state.selectedAssetOption)
    // console.log(this.state.selectedNetworkPortOption)

    let configuredMessage;

    if (this.state.selectedNetworkPortOption && this.state.selectedAssetOption) {
      configuredMessage = <p>Configured. Asset: {this.state.selectedAssetOption.hostname} Port: {this.state.selectedNetworkPortOption.name}</p>
    }
    else if (this.props.connectedPortID && this.state.configured) {
      configuredMessage = <p>Configured. Asset: {this.props.connectedAssetHostname} Port: {this.props.connectedPortName}</p>
    }
    // if (this.state.selectedNetworkPortOption && this.state.selectedAssetOption) {
    //   configuredMessage = <p>Configured. Asset: {this.state.selectedAssetOption.hostname} Port: {this.state.selectedNetworkPortOption.name}</p>
    // }
    else {
      // configuredMessage = ((this.state.selectedNetworkPortOption && this.state.selectedAssetOption))
      //   ? <p>Configured. Asset: {this.state.selectedAssetOption.hostname} Port: {this.state.selectedNetworkPortOption.name}</p>
      //   : <p>Not configured.</p>
      configuredMessage = <p>Not configured.</p>
    }

    let selections = this.createSelectionBoxes();

    return (
      <div>
        <Grid item alignContent='center' xs={12}>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Config
          </Button>
          {configuredMessage}
        </Grid>

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Connect Network Port</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select a Network Port from a specific Rack in a Datacenter to connect to.
          </DialogContentText>
            {selections}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Confirm
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default NetworkPortConnectionDialog
