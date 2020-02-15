import React from 'react'
import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid, FormGroup, FormControlLabel, Checkbox
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"



export default function PowerPortConnectionDialog() {

  const [open, setOpen] = React.useState(false);
  // const [selectedDatacenterOption, setDatacenterOption] = React.useState(null);
  // const [selectedRackOption, setRackOption] = React.useState(null);
  // const [selectedNetworkPortOption, setNetworkPortOption] = React.useState(null);

  const handleClickOpen = () => {
    // setDatacenterOption(selectedDatacenterOption);
    // setRackOption(selectedRackOption);
    // setNetworkPortOption(selectedNetworkPortOption);
    setOpen(true);
  };

  const handleClose = () => {
    // setDatacenterOption(null);
    // setRackOption(null);
    // setNetworkPortOption(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
  }

  // let selections = () => {

  // }


  return (
    <div>
      <Grid item alignContent='center' xs={12}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Setup Power Connections
        </Button>
        {/* {configuredMessage} */}
      </Grid>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Connect Network Port</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For each Power Port, select a PDU port number and connect left/right ports.
          </DialogContentText>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField label='PDU Port Number' type="text" fullWidth onChange={e => {
                // let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                // instanceCopy.hostname = e.target.value
                // this.setState({
                //   instance: instanceCopy
                // })
              }} />
            </Grid>
            <Grid item xs={6}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={state.checkedB}
                      // onChange={handleChange('checkedB')}
                      value="checkedB"
                      color="primary"
                    />
                  }
                  label="Left"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={state.checkedB}
                      // onChange={handleChange('checkedB')}
                      value="checkedB"
                      color="primary"
                    />
                  }
                  label="Right"
                />
              </FormGroup>
            </Grid>
          </Grid>





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
