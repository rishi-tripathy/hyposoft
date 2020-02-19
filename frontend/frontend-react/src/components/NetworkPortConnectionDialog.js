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
      this.loadRacks();
    }
    if (this.state.selectedRackOption != prevState.selectedRackOption) {
      this.loadAssets();
    }
    if (this.state.selectedAssetOption != prevState.selectedAssetOption) {
      this.loadNetworkPorts();
    }
  }

  loadDatacenters = () => {
    // TODO: will replace this with a one globally selected
    this.setState({
      datacenters: [
        {
          id: 1,
          name: 'rtp1'
        },
        {
          id: 2,
          name: 'rtp2'
        }
      ]
    })
    // let dst = '/api/datacenters/';
    // axios.get(dst).then(res => {
    //   this.setState({
    //     datacenters: res.data.results,
    //   });
    // })
    //   .catch(function (error) {
    //     console.log(error.response)
    //     alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    //   });
  }

  loadRacks = () => {

    this.setState({
      racks: [
        {
          id: 1,
          rack_number: 'A12'
        },
        {
          id: 2,
          rack_number: 'B12'
        }
      ]
    })
  }

  loadAssets = () => {
    this.setState({
      assets: [
        {
          id: 1,
          hostname: 'some name blah'
        }
      ]
    })
  }

  loadNetworkPorts = () => {
    this.setState({
      networkPorts: [
        {
          id: 1,
          name: 'np1'
        },
        {
          id: 2,
          name: 'np2'
        },
        {
          id: 3,
          name: 'np3'
        }
      ]
    })
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
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
    console.log(this.state)
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
