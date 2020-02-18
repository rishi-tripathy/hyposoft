import React from 'react'
import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"

const datacenters = ['dc1', 'dc2']
const racks = ['rack1', 'rack2', 'rack3']
const assets = ['ass1', 'ass2']
const nps = ['np1', 'np2', 'np3']

export default function NetworkPortConnectionDialog() {

  const [open, setOpen] = React.useState(false);
  const [selectedDatacenterOption, setDatacenterOption] = React.useState(null);
  const [selectedRackOption, setRackOption] = React.useState(null);
  const [selectedAssetOption, setAssetOption] = React.useState(null);
  const [selectedNetworkPortOption, setNetworkPortOption] = React.useState(null);

  const handleClickOpen = () => {
    setDatacenterOption(selectedDatacenterOption);
    setRackOption(selectedRackOption);
    setAssetOption(selectedAssetOption);
    setNetworkPortOption(selectedNetworkPortOption);
    setOpen(true);
  };

  const handleClose = () => {
    setDatacenterOption(null);
    setRackOption(null);
    setAssetOption(null);
    setNetworkPortOption(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
  }

  const handleChangeDatacenter = (event, dc) => {
    setDatacenterOption(dc)
  };

  const handleChangeRack = (event, r) => {
    setRackOption(r)
  };

  const handleChangeAsset = (event, ass) => {
    setAssetOption(ass)
  };

  const handleChangeNetworkPort = (event, np) => {
    setNetworkPortOption(np)
  }

  const createSelectionBoxes = () => {
    let selections = [];
    selections.push(<Autocomplete
      autoComplete
      autoHighlight
      autoSelect
      id="dc-select"
      options={datacenters}
      //getOptionLabel={option => option.label}
      onChange={handleChangeDatacenter}
      value={selectedDatacenterOption}
      renderInput={params => (
        <TextField {...params} label="Datacenter" fullWidth />
      )}
    />);


    if (selectedDatacenterOption) {
      selections.push(
        <Autocomplete
          autoComplete
          autoHighlight
          autoSelect
          id="rack-select"
          options={racks}
          //getOptionLabel={option => option.label}
          onChange={handleChangeRack}
          value={selectedRackOption}
          renderInput={params => (
            <TextField {...params} label="Rack" fullWidth />
          )}
        />
      );
    }

    if (selectedDatacenterOption && selectedRackOption) {
      selections.push(
        <Autocomplete
          autoComplete
          autoHighlight
          autoSelect
          id="asset-select"
          options={assets}
          //getOptionLabel={option => option.label}
          onChange={handleChangeAsset}
          value={selectedAssetOption}
          renderInput={params => (
            <TextField {...params} label="Asset" fullWidth />
          )}
        />
      )
    }

    if (selectedDatacenterOption && selectedRackOption && selectedAssetOption) {
      selections.push(
        <Autocomplete
          autoComplete
          autoHighlight
          autoSelect
          id="np-select"
          options={nps}
          //getOptionLabel={option => option.label}
          onChange={handleChangeNetworkPort}
          value={selectedNetworkPortOption}
          renderInput={params => (
            <TextField {...params} label="Network Port" fullWidth />
          )}
        />
      )
    }

    return selections;
  }

  console.log(selectedDatacenterOption)
  console.log(selectedRackOption)
  console.log(selectedNetworkPortOption)

  let configuredMessage = (selectedDatacenterOption && selectedRackOption && selectedNetworkPortOption && selectedAssetOption)
    ? <p>Configured: {selectedDatacenterOption} {selectedRackOption} {selectedNetworkPortOption} {selectedAssetOption}</p>
    : <p>Not configured.</p>


  let selections = createSelectionBoxes();

  return (
    <div>
      <Grid item alignContent='center' xs={12}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Config
        </Button>
        {configuredMessage}
      </Grid>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Connect Network Port</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a Network Port from a specific Rack in a Datacenter to connect to.
          </DialogContentText>
          {selections}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


      {/* <Grid item alignContent='center' xs={4}>
        
      </Grid> */}
    </div>
  )
}
