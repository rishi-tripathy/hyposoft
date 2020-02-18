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
      selectedDatacenterIDOption: null,
      selectedRackIDOption: null,
      selectedAssetIDOption: null,
      selectedNetworkPortIDOption: null,
    }
  }

  componentDidMount() {
    this.loadDatacenters();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedDatacenterIDOption) {
      if (prevState.racks != this.state.racks) {
        this.loadRacks();
      }
    }

    if (this.state.selectedRackIDOption) {
      if (prevState.assets != this.state.assets) {
        this.loadAssets();
      }
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

  // handleClickOpen = () => {
  //   setOpen(true);
  // };

  // handleClose = () => {
  //   // reset all selections
  //   this.setState({
  //     selectedDatacenterOption: null,
  //     selectedRackOption: null,
  //     selectedAssetOption: null,
  //     selectedNetworkPortOption: null,
  //   })
  //   setOpen(false);
  // };

  // handleSubmit = () => {
  //   setOpen(false);
  // }

  // handleChangeDatacenter = (event, dc) => {
  //   this.setState({
  //     selectedDatacenterOption: dc,
  //   })
  // };

  // handleChangeRack = (event, r) => {
  //   this.setState({
  //     selectedRackOption: r,
  //   })
  // };

  // handleChangeAsset = (event, ass) => {
  //   this.setState({
  //     selectedAssetOption: ass,
  //   })
  // };

  // handleChangeNetworkPort = (event, np) => {
  //   this.setState({
  //     selectedNetworkPortOption: np,
  //   })
  // }

  // createSelectionBoxes = () => {
  //   let selections = [];
  //   selections.push(<Autocomplete
  //     autoComplete
  //     autoHighlight
  //     autoSelect
  //     id="dc-select"
  //     options={datacenters}
  //     //getOptionLabel={option => option.label}
  //     onChange={handleChangeDatacenter}
  //     value={selectedDatacenterOption}
  //     renderInput={params => (
  //       <TextField {...params} label="Datacenter" fullWidth />
  //     )}
  //   />);


  //   if (selectedDatacenterOption) {
  //     selections.push(
  //       <Autocomplete
  //         autoComplete
  //         autoHighlight
  //         autoSelect
  //         id="rack-select"
  //         options={racks}
  //         //getOptionLabel={option => option.label}
  //         onChange={handleChangeRack}
  //         value={selectedRackOption}
  //         renderInput={params => (
  //           <TextField {...params} label="Rack" fullWidth />
  //         )}
  //       />
  //     );
  //   }

  //   if (selectedDatacenterOption && selectedRackOption) {
  //     selections.push(
  //       <Autocomplete
  //         autoComplete
  //         autoHighlight
  //         autoSelect
  //         id="asset-select"
  //         options={assets}
  //         //getOptionLabel={option => option.label}
  //         onChange={handleChangeAsset}
  //         value={selectedAssetOption}
  //         renderInput={params => (
  //           <TextField {...params} label="Asset" fullWidth />
  //         )}
  //       />
  //     )
  //   }

  //   if (selectedDatacenterOption && selectedRackOption && selectedAssetOption) {
  //     selections.push(
  //       <Autocomplete
  //         autoComplete
  //         autoHighlight
  //         autoSelect
  //         id="np-select"
  //         options={nps}
  //         //getOptionLabel={option => option.label}
  //         onChange={handleChangeNetworkPort}
  //         value={selectedNetworkPortOption}
  //         renderInput={params => (
  //           <TextField {...params} label="Network Port" fullWidth />
  //         )}
  //       />
  //     )
  //   }

  //   return selections;
  // }

  render() {
    return (<div></div>)
    // let configuredMessage = (selectedDatacenterOption && selectedRackOption && selectedNetworkPortOption && selectedAssetOption)
    //   ? <p>Configured: {selectedDatacenterOption} {selectedRackOption} {selectedNetworkPortOption} {selectedAssetOption}</p>
    //   : <p>Not configured.</p>

    // let selections = createSelectionBoxes();


    // return (
    //   <div>
    //     <Grid item alignContent='center' xs={12}>
    //       <Button variant="outlined" color="primary" onClick={handleClickOpen}>
    //         Config
    //     </Button>
    //       {configuredMessage}
    //     </Grid>

    //     <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    //       <DialogTitle id="form-dialog-title">Connect Network Port</DialogTitle>
    //       <DialogContent>
    //         <DialogContentText>
    //           Select a Network Port from a specific Rack in a Datacenter to connect to.
    //       </DialogContentText>
    //         {selections}
    //       </DialogContent>

    //       <DialogActions>
    //         <Button onClick={handleClose} color="primary">
    //           Cancel
    //       </Button>
    //         <Button onClick={handleSubmit} color="primary">
    //           Confirm
    //       </Button>
    //       </DialogActions>
    //     </Dialog>
    //   </div>
    // )
  }
}

export default NetworkPortConnectionDialog
