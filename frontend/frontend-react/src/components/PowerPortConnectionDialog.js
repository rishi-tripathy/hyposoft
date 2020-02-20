import React, { Component } from 'react'

import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid, FormGroup, FormControlLabel, Checkbox,
  List, ListItem, Radio, RadioGroup,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"

export class PowerPortConnectionDialog extends Component {

  constructor() {
    super();
    this.state = {
      powerPortConfiguration: [
        {
          pduPortNumber: 2,
          leftOrRight: 'left',
        },
        {
          pduPortNumber: 3,
          leftOrRight: 'right',
        },
        {
          pduPortNumber: 5,
          leftOrRight: 'left',
        }
      ],


      open: false,
      configured: false,
    }
  }

  componentDidMount() {
    this.setDefaultPowerPortConfiguration();
    // const powerPorts = 
    // let listOfSelections = [];
    // for (let i = 0; i < powerPorts; i++) {
    //   listOfSelections.push({
    //     pduSlot: null,
    //     left: false,
    //     right: false,
    //   })
    // }
    // let selectionArrayCopy = Object.assign({}, powerPortSelection.selection);
    // selectionArrayCopy = listOfSelections;
    // setPowerPortSelection({
    //   selection: selectionArrayCopy
    // });
  }

  setDefaultPowerPortConfiguration() {
    const arr = [
      {
        pduPortNumber: 2,
        leftOrRight: 'left',
      },
      {
        pduPortNumber: 3,
        leftOrRight: 'right',
      },
      {
        pduPortNumber: 5,
        leftOrRight: 'left',
      }
    ]
    this.setState({ powerPortConfiguration: arr })
  }



  handleClickOpen = () => {
    //setPowerPortSelection()
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setDefaultPowerPortConfiguration();
    this.setState({ open: false, configured: false })
  };

  handleSubmit = () => {
    this.setState({ open: false, configured: true })
  }

  handleLeftRightChange = (indexOfChange, e) => {
    let tmpConfig = Object.assign({}, this.state.powerPortConfiguration);
    tmpConfig[indexOfChange].leftOrRight = e.target.value;
    this.setState({ powerPortConfiguration: tmpConfig });
  }

  showPPFields = () => {
    let fieldList = [];
    for (let i = 0; i < this.props.numberOfPowerPorts; i++) {
      //console.log(powerPortSelection)
      fieldList.push(
        <div>
          <ListItem>
            <Grid item xs={6}>
              <TextField label='PDU Port Number' type="number" value={this.state.powerPortConfiguration[i].pduPortNumber} fullWidth onChange={e => {
                let cpy = Object.assign({}, this.state.powerPortConfiguration);
                cpy[i].pduPortNumber = e.target.value;
                this.setState({ powerPortConfiguration: cpy });
              }} />
            </Grid>
            <Grid item xs={6}>
              <FormGroup row>
                <RadioGroup
                  value={this.state.powerPortConfiguration[i].leftOrRight}
                  row
                  onChange={(e) => this.handleLeftRightChange(i, e)}>
                  <FormControlLabel
                    value='left'
                    control={<Radio />}
                    label="Left" />
                  <FormControlLabel
                    value='right'
                    control={<Radio />}
                    label="Right" />
                </RadioGroup>
              </FormGroup>
            </Grid>
          </ListItem>
        </div>
      )
    }
    return fieldList;
  }



  render() {

    console.log(this.props.selectedRack);
    console.log(this.state.powerPortConfiguration);


    let configuredMessage = (this.state.configured)
      ? <p>Configured.</p>
      : <p>Not configured.</p>


    return (
      <div>
        <Grid item alignContent='center' xs={12}>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Setup Power Connections
          </Button>
          {configuredMessage}
        </Grid>

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Connect Network Port</DialogTitle>
          <DialogContent>
            <DialogContentText>
              For each Power Port, select a PDU port number and connect left/right ports.
            </DialogContentText>
            <List style={{ maxHeight: 200, overflow: 'auto' }}>
              {this.showPPFields()}
            </List>
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

export default PowerPortConnectionDialog
