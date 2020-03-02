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
          port_number: '2',
          pdu: 'left',
        },
        {
          port_number: '3',
          pdu: 'left',
        },
        {
          port_number: '5',
          pdu: 'left',
        },
        {
          port_number: '3',
          pdu: 'left',
        },
        {
          port_number: '5',
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

  loadCurrentPPConfiguration = () => {
    let tmpConfig = []

    for (let i = 0; i < this.props.currentPowerPortConfiguration.length; i++) {
      let currentConfigObj = {}
      currentConfigObj.pdu = this.props.currentPowerPortConfiguration[i].pdu ? this.props.currentPowerPortConfiguration[i].pdu.name : null
      currentConfigObj.port_number = this.props.currentPowerPortConfiguration[i].port_number ? this.props.currentPowerPortConfiguration[i].port_number.toString() : null
      tmpConfig.push(currentConfigObj)
    }

    console.log(JSON.stringify(tmpConfig, null, 2))

    this.setState({ powerPortConfiguration: tmpConfig })

    let isConfigured = false;
    for (let i = 0; i < this.props.currentPowerPortConfiguration.length; i++) {
      if (this.props.currentPowerPortConfiguration[i].pdu 
        && this.props.currentPowerPortConfiguration[i].port_number) {
        isConfigured = true;
      }
    }

    this.setState({ configured: isConfigured })

    this.props.sendPowerPortConnectionInfo(tmpConfig);

  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.leftFree != this.props.leftFree
      || prevProps.rightFree != this.props.rightFree
      || prevProps.leftPPName != this.props.leftPPName
      || prevProps.rightPPName != this.props.rightPPName
      || prevProps.rackID != this.props.rackID )
      && this.props.currentPowerPortConfiguration == null) {
      this.setDefaultPowerPortConfiguration();
      if (this.props.rackID) {
        this.loadFreePowerPorts();
      }
    }

    if (this.props.currentPowerPortConfiguration !== prevProps.currentPowerPortConfiguration) {
      this.loadCurrentPPConfiguration();
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
            myOptions.push(res.data.pdu_slots.left[j].toString());
          }
        }
        else if (this.state.powerPortConfiguration[i].pdu == this.props.rightPPName){
          for (let j = 0; j < res.data.pdu_slots.right.length; j++) {
            myOptions.push(res.data.pdu_slots.right[j].toString());
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
        console.log(error.response)
        //alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response, null, 2));
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
        obj.port_number = this.props.leftFree[0].toString()
      }
      else if (i === 1) {
        let idx = this.props.rightFree.lastIndexOf(this.props.leftFree[0])
        if (idx >= 0) {
          obj.pdu = this.props.rightPPName
          obj.port_number = this.props.rightFree[idx].toString()
        }
        else {
          obj.pdu = this.props.rightPPName
          obj.port_number = this.props.rightFree[0].toString()
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
    //this.setDefaultPowerPortConfiguration();
    this.setState({ open: true })
  };

  handleClose = () => {
    this.props.sendPowerPortConnectionInfo([]);
    this.setState({ 
      open: false, 
      configured: false,
      pduOptionsPerEachPDU: [],
      selectedPDUOptionPerEachPDU: [], 
    })
  };

  handleSubmit = () => {

    let configCopy = Object.assign({}, this.state.powerPortConfiguration);
    let outArray = []
    for (let i = 0; i < this.props.numberOfPowerPorts; i++) {
      let str = configCopy[i].port_number
      configCopy[i].port_number = parseInt(str)
      outArray.push(configCopy[i])
    }
    this.props.sendPowerPortConnectionInfo(outArray);
    console.log(outArray)
    console.log(this.state.powerPortConfiguration)
    //this.props.sendPowerPortConnectionInfo(this.state.powerPortConfiguration);
    this.setState({ open: false, configured: true })
  }

  handleLeftRightChange = (indexOfChange, e) => {
    let tmpConfig = Object.assign([], this.state.powerPortConfiguration);
    tmpConfig[indexOfChange].pdu = e.target.value;
    this.setState({ powerPortConfiguration: tmpConfig });
  }

  handleChangePDUOption = (event, selectedOption, i) => {
    let tmpConfig = Object.assign([], this.state.powerPortConfiguration);
    tmpConfig[i].port_number = selectedOption;
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
              <FormGroup row>
                <RadioGroup
                  value={this.state.powerPortConfiguration[i] ? this.state.powerPortConfiguration[i].pdu : null}
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
                //label={this.state.selectedPDUOptionPerEachPDU[i] ? this.state.selectedPDUOptionPerEachPDU[i].label : null}
                options={this.state.pduOptionsPerEachPDU[i]}
                //getOptionLabel={option => option.label}
                onChange={(event, value) => this.handleChangePDUOption(event, value, i)}
                value={this.state.powerPortConfiguration[i] ? (this.state.powerPortConfiguration[i].port_number ? this.state.powerPortConfiguration[i].port_number.toString() : null) : null}
                renderInput={params => (
                  <TextField {...params} label="PDU Port Number" fullWidth />
                )}
              />
              {/* <TextField label='PDU Port Number' type="number" value={this.state.powerPortConfiguration[i].port_number} fullWidth onChange={e => {
                let cpy = Object.assign({}, this.state.powerPortConfiguration);
                cpy[i].port_number = e.target.value;
                this.setState({ powerPortConfiguration: cpy });
              }} /> */}
            </Grid>
          </ListItem>
        </div>
      )
    }
    return fieldList;
  }

  displayConfiguration = () => {
    let configList = []
    for (let k = 0; k < this.state.powerPortConfiguration.length; k++) {
      configList.push(
        <div>
          <ListItem>
            <p>Power Port #{k+1}  </p><br></br>
            <p>Connected PDU: {this.state.powerPortConfiguration[k].pdu}</p><br></br>
            <p>Connected Port Number: {this.state.powerPortConfiguration[k].port_number}</p>
          </ListItem>
        </div>
      )
    } 
    return configList;
  }



  render() {
    console.log(this.props);
    console.log(this.state);

    let configuredMessage = (this.state.configured)
      ? this.displayConfiguration()
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
          <DialogTitle id="form-dialog-title">Connect Power Port</DialogTitle>
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
