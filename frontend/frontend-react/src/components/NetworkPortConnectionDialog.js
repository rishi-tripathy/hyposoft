import React, { Component } from 'react'
import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"
import axios from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class NetworkPortConnectionDialog extends Component {

  constructor() {
    super();
    this.state = {
      datacenters: [],
      racks: [],
      assets: [],
      networkPorts: [],
      selectedDatacenterOption: null,
      selectedRackOption: null,
      selectedAssetOption: null,
      selectedNetworkPortOption: null,

      open: false
    }
  }

  componentDidMount() {
    this.loadDatacenters();
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.selectedDatacenterOption != prevState.selectedDatacenterOption) {
      if (this.state.selectedDatacenterOption) {
        this.loadRacks();
      }
      else {
        this.setState({ racks: [], selectedRackOption: null });
      }
    }
    if (this.state.selectedRackOption != prevState.selectedRackOption) {
      if (this.state.selectedRackOption) {
        this.loadAssets();
      }
      else {
        this.setState({ assets: [], selectedAssetOption: null });
      }
    }
    if (this.state.selectedAssetOption != prevState.selectedAssetOption) {
      if (this.state.selectedAssetOption) {
        this.loadNetworkPorts();
      }
      else {
        this.setState({ networkPorts: [], selectedNetworkPortOption: null });
      }

    }
  }

  loadDatacenters = () => {
    let dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      this.setState({
        datacenters: res.data,
      });
    })
      .catch(function (error) {
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadRacks = () => {
    let dst = '/api/datacenters/' + this.state.selectedDatacenterOption.id + '/racks/?show_all=true';
    axios.get(dst).then(res => {
      this.setState({
        racks: res.data,
      });
    })
      .catch(function (error) {
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadAssets = () => {
    let dst = '/api/racks/' + this.state.selectedRackOption.id + '/assets/?show_all=true';
    axios.get(dst).then(res => {
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

    // axios.get('/api/assets/' + this.state.selectedAssetOption.id + '/')
    //   .then((response) => {
    //     return axios.get(response.data.model.url); // using response.data
    //   })
    //   .then((response) => {
    //     console.log('Response', response.data);
    //     this.setState({ networkPorts: response.data.network_ports })
    //   });
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.props.sendNetworkPortConnectionID(this.props.indexOfThisNPConfig, null);

    // reset all selections and close
    this.setState({
      selectedDatacenterOption: null,
      selectedRackOption: null,
      selectedAssetOption: null,
      selectedNetworkPortOption: null,
      open: false
    })
  };

  handleSubmit = () => {
    this.props.sendNetworkPortConnectionID(this.props.indexOfThisNPConfig, this.state.selectedNetworkPortOption.id);
    this.setState({ open: false })
  }

  handleChangeDatacenter = (event, dc) => {
    this.setState({
      selectedDatacenterOption: dc,
    })
  };

  handleChangeRack = (event, r) => {
    this.setState({
      selectedRackOption: r,
    })
  };

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
    selections.push(<Autocomplete
      autoComplete
      autoHighlight
      autoSelect
      id="dc-select"
      options={this.state.datacenters}
      getOptionLabel={option => option.name}
      onChange={this.handleChangeDatacenter}
      value={this.state.selectedDatacenterOption}
      renderInput={params => (
        <TextField {...params} label="Datacenter" fullWidth />
      )}
    />);


    if (this.state.selectedDatacenterOption) {
      selections.push(
        <Autocomplete
          autoComplete
          autoHighlight
          autoSelect
          id="rack-select"
          options={this.state.racks}
          getOptionLabel={option => option.rack_number}
          onChange={this.handleChangeRack}
          value={this.state.selectedRackOption}
          renderInput={params => (
            <TextField {...params} label="Rack" fullWidth />
          )}
        />
      );
    }

    if (this.state.selectedDatacenterOption && this.state.selectedRackOption) {
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
      )
    }

    if (this.state.selectedDatacenterOption && this.state.selectedRackOption && this.state.selectedAssetOption) {
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
    return selections;
  }

  render() {
    //console.log(this.props)
    //console.log(this.state)
    //return (<div></div>)
    let configuredMessage = (this.state.selectedDatacenterOption && this.state.selectedRackOption && this.state.selectedNetworkPortOption && this.state.selectedAssetOption)
      ? <p>Configured: {this.state.selectedNetworkPortOption.name}</p>
      : <p>Not configured.</p>

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
