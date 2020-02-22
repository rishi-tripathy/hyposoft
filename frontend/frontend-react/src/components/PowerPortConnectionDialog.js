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
          port_number: 2,
          pdu: 'left',
        },
        {
          port_number: 3,
          pdu: 'left',
        },
        {
          port_number: 5,
          pdu: 'left',
        },
        {
          port_number: 3,
          pdu: 'left',
        },
        {
          port_number: 5,
          pdu: 'left',
        },

      ],

      open: false,
      configured: false,
    }
  }

  componentDidMount() {
    //this.setDefaultPowerPortConfiguration();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.leftFree != this.props.leftFree
      || prevProps.rightFree != this.props.rightFree
      || prevProps.leftPPName != this.props.leftPPName
      || prevProps.rightPPName != this.props.rightPPName) {
      this.setDefaultPowerPortConfiguration();
    }
  }

  setDefaultPowerPortConfiguration() {

    let tmpConfig = []

    for (let i = 0; i < this.props.numberOfPowerPorts; i++) {
      let obj = {}
      if (i === 0) {
        obj.pdu = this.props.leftPPName
        obj.port_number = this.props.leftFree[0]
      }
      else if (i === 1) {
        obj.pdu = this.props.rightPPName
        obj.port_number = this.props.rightFree[0]
      }
      else {
        obj.pdu = ''
        obj.port_number = null
      }
      tmpConfig.push(obj)
    }

    // const arr = [
    //   {
    //     port_number: this.props.leftFree[0],
    //     pdu: '',
    //   },
    //   {
    //     port_number: 3,
    //     pdu: this.props.leftPPName,
    //   },
    //   {
    //     port_number: 5,
    //     pdu: this.props.leftPPName,
    //   },
    //   {
    //     port_number: 6,
    //     pdu: this.props.leftPPName,
    //   },
    //   {
    //     port_number: 8,
    //     pdu: this.props.leftPPName,
    //   }
    // ]
    this.setState({ powerPortConfiguration: tmpConfig })
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
    this.props.sendPowerPortConnectionInfo(this.state.powerPortConfiguration);
    this.setState({ open: false, configured: true })
  }

  handleLeftRightChange = (indexOfChange, e) => {
    let tmpConfig = Object.assign({}, this.state.powerPortConfiguration);
    tmpConfig[indexOfChange].pdu = e.target.value;
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
              <p>Power Port: {i + 1}</p>
              <TextField label='PDU Port Number' type="number" value={this.state.powerPortConfiguration[i].port_number} fullWidth onChange={e => {
                let cpy = Object.assign({}, this.state.powerPortConfiguration);
                cpy[i].port_number = e.target.value;
                this.setState({ powerPortConfiguration: cpy });
              }} />
            </Grid>
            <Grid item xs={6}>
              <FormGroup row>
                <RadioGroup
                  value={this.state.powerPortConfiguration[i].pdu}
                  row
                  onChange={(e) => this.handleLeftRightChange(i, e)}>
                  <FormControlLabel
                    value={this.props.leftPPName}
                    control={<Radio />}
                    label="Left" />
                  <FormControlLabel
                    value={this.props.rightPPName}
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

    console.log(this.props);
    console.log(this.state.powerPortConfiguration);


    let configuredMessage = (this.state.configured)
      ? <p>Configured.</p>
      : <p>Not configured.</p>


    return (
      <div>
        <Grid item alignContent='center' xs={12}>
          <Button variant="outlined" color="primary" disabled={this.props.isDisabled} onClick={this.handleClickOpen}>
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
