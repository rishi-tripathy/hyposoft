import React, { Component } from 'react'
import axios from 'axios'
import {
  Button, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle, Grid, FormGroup, FormControlLabel, Checkbox,
  List, ListItem, Radio, RadioGroup,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"

axios.defaults.xsrfHeaderName = "X-CSRFToken";

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

      pduOptionsPerEachPDU: [],
      selectedPDUOptionPerEachPDU: [],

      //leftRightSelected: false,
    }
  }

  componentDidMount() {
    //this.setDefaultPowerPortConfiguration();
    //this.loadFreePowerPorts
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.leftFree != this.props.leftFree
      || prevProps.rightFree != this.props.rightFree
      || prevProps.leftPPName != this.props.leftPPName
      || prevProps.rightPPName != this.props.rightPPName
      || prevProps.rackID != this.props.rackID ) {
      this.setDefaultPowerPortConfiguration();
      if (this.props.rackID) {
        this.loadFreePowerPorts();
      }
    }

    if (prevState.powerPortConfiguration != this.state.powerPortConfiguration) {
      console.log('get new powerports')
      if (this.props.rackID) {
        this.loadFreePowerPorts();
      }
    }

  }

  loadFreePowerPorts = () => {
    const dst = '/api/racks/' + this.props.rackID + '/get_open_pdu_slots/';
    console.log(dst)
    axios.get(dst).then(res => {
      let optionsPerPDU = []
      for (let i = 0; i < this.props.numberOfPowerPorts; i++) {
        let myOptions = [];
        if (this.state.powerPortConfiguration[i].pdu == this.props.leftPPName) {
          for (let j = 0; j < res.data.pdu_slots.left.length; j++) {
            myOptions.push({ value: res.data.pdu_slots.left[j], label: res.data.pdu_slots.left[j] });
          }
        }
        else if (this.state.powerPortConfiguration[i].pdu == this.props.rightPPName){
          for (let j = 0; j < res.data.pdu_slots.right.length; j++) {
            myOptions.push({ value: res.data.pdu_slots.right[j], label: res.data.pdu_slots.right[j] });
          }
        }
        console.log(myOptions)
        optionsPerPDU[i] = myOptions
      }
      console.log(optionsPerPDU)
      this.setState({ pduOptionsPerEachPDU: optionsPerPDU });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response, null, 2));
      });
  }


  setDefaultPowerPortConfiguration() {
    let tmpConfig = []

    for (let i = 0; i < this.props.numberOfPowerPorts; i++) {
      let obj = {}

      if (this.props.leftFree.length === 0 || this.props.rightFree.length === 0) {
        obj.pdu = ''
        obj.port_number = null
      }
      else if (i === 0) {
        obj.pdu = this.props.leftPPName
        obj.port_number = this.props.leftFree[0]
      }
      else if (i === 1) {
        let idx = this.props.rightFree.lastIndexOf(this.props.leftFree[0])
        if (idx >= 0) {
          obj.pdu = this.props.rightPPName
          obj.port_number = this.props.rightFree[idx]
        }
        else {
          obj.pdu = this.props.rightPPName
          obj.port_number = this.props.rightFree[0]
        }
      }
      else {
        obj.pdu = ''
        obj.port_number = null
      }

      tmpConfig.push(obj)
    }

    this.setState({ powerPortConfiguration: tmpConfig })
  }



  handleClickOpen = () => {
    //setPowerPortSelection()
    this.setDefaultPowerPortConfiguration();
    this.setState({ open: true })
  };

  handleClose = () => {
    this.props.sendPowerPortConnectionInfo(null);
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

  handleChangePDUOption = (event, selectedOption) => {
    console.log(selectedOption)
    //console.log(idx)
    //let tmpConfig = Object.assign({}, this.state.selectedPDUOptionPerEachPDU);
    // tmpConfig[idx] = e.target.value;
    // this.setState({ selectedPDUOptionPerEachPDU: tmpConfig });
  }

  showPPFields = () => {
    let fieldList = [];
    for (let i = 0; i < this.props.numberOfPowerPorts; i++) {
      //console.log(powerPortSelection)
      fieldList.push(
        <div>
          <ListItem>
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
            <Grid item xs={6}>
              <p>Power Port #{i + 1}</p>
              <Autocomplete
                autoComplete
                autoHighlight
                autoSelect
                //id="pp-free-select"
                options={this.state.pduOptionsPerEachPDU[i]}
                getOptionLabel={option => option.label}
                onChange={this.handleChangePDUOption}
                value={this.state.selectedPDUOptionPerEachPDU[i]}
                renderInput={params => (
                  <TextField {...params} label="PDU Port Number" fullWidth />
                )}
              />
              <TextField label='PDU Port Number' type="number" value={this.state.powerPortConfiguration[i].port_number} fullWidth onChange={e => {
                let cpy = Object.assign({}, this.state.powerPortConfiguration);
                cpy[i].port_number = e.target.value;
                this.setState({ powerPortConfiguration: cpy });
              }} />
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
