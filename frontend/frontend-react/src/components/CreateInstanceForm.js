import React, { Component } from 'react'
import axios from 'axios'
import { Autocomplete } from "@material-ui/lab"
import {
  Container, Button, Grid, TextField,
  Typography, IconButton, Tooltip, List,
  ListSubheader, ListItem, ListItemText, Paper,
  Divider,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Redirect, Link } from 'react-router-dom'
import CancelIcon from '@material-ui/icons/Cancel';
import NetworkPortConnectionDialog from './NetworkPortConnectionDialog';
import PowerPortConnectionDialog from './PowerPortConnectionDialog';


axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class CreateInstanceForm extends Component {

  constructor() {
    super();
    this.state = {
      asset: {
        model: null,
        hostname: null,
        rack: null,
        rack_u: null,
        owner: null,
        comment: null,
        asset_number: null,
        network_ports: []
        // {
        // 	"mac":"yerp", //optional
        // 	"name":"yup",
        // 	"connection": { //optional
        // 		"network_port_id": 1
        // 	  }
        // }
      },
      modelOptions: [],
      selectedModelOption: null,

      datacenterOptions: [],
      selectedDatacenterOption: null,

      rackOptions: [],
      selectedRackOption: null,

      ownerOptions: [],
      selectedOwnerOption: null,

      numberOfNetworkPortsForCurrentAsset: null,
      networkPortNamesForCurrentAsset: [],

      macAddresses: [],
      networkPortConnectionIDs: [],

      


      //dummy
      powerPorts: 3,
      ppConnection: [],

      leftFreePDUs: [],
      rightFreePDUs: [],

      leftCurrentlySelectedPDUs: [],
      rightCurrentlySelectedPDUs: [],

    }
  }

  loadNetworkPortInfoForCurrentlySelectedModel = () => {
    let modelURL = this.state.selectedModelOption.value
    console.log(modelURL)
    axios.get(modelURL).then(res => {
      this.setState({
        numberOfNetworkPortsForCurrentAsset: res.data.network_ports_num,
        networkPortNamesForCurrentAsset: res.data.network_ports,
      });
    })
      .catch(function (error) {
        console.log(error.response)
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  getNetworkPortConnectionID = (index, npID) => {
    //console.log()
    let a = this.state.networkPortConnectionIDs.slice(); //creates the clone of the state
    a[index] = npID;
    this.setState({ networkPortConnectionIDs: a });
  }

  getPowerPortConenctionInfo = (pduPortNumber, isLeft, isRight) => {

  }

  loadLeftFreePDUs = () => {
    this.setState({
      leftFreePDUs: [1, 2, 3, 4, 6, 7]
    })
  }

  loadRightFreePDUs = () => {
    this.setState({
      rightFreePDUs: [2, 3, 5, 6, 7]
    })
  }

  loadModels = () => {
    // MODEL
    const dst = '/api/assets/model_names/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].vendor + ' ' + res.data[i].model_number });
      }
      this.setState({ modelOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadRacks = () => {
    console.log(this.state.selectedDatacenterOption)
    // RACK
    const dst = '/api/datacenters/' + this.state.selectedDatacenterOption.id + '/racks/?show_all=true';
    console.log(dst);
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].rack_number, id: res.data[i].id });
      }
      this.setState({ rackOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load racks. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadOwners = () => {
    // OWNER
    const dst = '/api/users/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        myOptions.push({ value: res.data[i].url, label: res.data[i].username });
      }
      this.setState({ ownerOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadDatacenters = () => {
    const dst = '/api/datacenters/?show_all=true';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        //TODO: change value to URL
        myOptions.push({ value: res.data[i].url, label: res.data[i].abbreviation, id: res.data[i].id });
      }
      console.log(myOptions)
      this.setState({ datacenterOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  componentDidMount() {
    this.loadModels();
    this.loadDatacenters();

    this.loadOwners();




    // L and R free PDUs
    // this.loadLeftFreePDUs();
    // this.loadRightFreePDUs();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedModelOption != this.state.selectedModelOption) {
      if (this.state.selectedModelOption) {
        this.loadNetworkPortInfoForCurrentlySelectedModel();
      }
      else {
        this.setState({ networkPortNamesForCurrentAsset: [], numberOfNetworkPortsForCurrentAsset: null });
      }
    }

    if (this.state.selectedDatacenterOption != prevState.selectedDatacenterOption) {
      if (this.state.selectedDatacenterOption) {
        this.loadRacks();
      }
      else {
        this.setState({ rackOptions: [], selectedRackOption: null });
      }
    }
  }

  removeEmpty = (obj) => {
    Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    return obj;
  };

  removeEmptyRecursive = (obj) => {
    Object.keys(obj).forEach(k =>
      (obj[k] && typeof obj[k] === 'object') && this.removeEmptyRecursive(obj[k]) ||
      (!obj[k] && obj[k] !== undefined) && delete obj[k]
    );
    return obj;
  };

  handleSubmit = (e) => {
    if (e) e.preventDefault();

    // TODO: refactor this
    let networkPortsBuilder = [];
    for (let i = 0; i < this.state.numberOfNetworkPortsForCurrentAsset; i++) {
      let currentMAC = this.state.macAddresses[i] ? this.state.macAddresses[i] : null;
      let currentNetworkPortID = this.state.networkPortConnectionIDs[i] ? this.state.networkPortConnectionIDs[i] : null;
      let currentNPName = this.state.networkPortNamesForCurrentAsset[i] ? this.state.networkPortNamesForCurrentAsset[i] : null;
      
      let obj = JSON.parse('{ "mac": ' + currentMAC + ', "name": "' + currentNPName + '", "connection": { "network_port_id": ' + currentNetworkPortID + ' } }')
      console.log(obj)
      networkPortsBuilder.push(this.removeEmptyRecursive(obj))
    }

    let stateCopy = Object.assign({}, this.state.asset);
    stateCopy.model = this.state.selectedModelOption ? this.state.selectedModelOption.value : null;
    stateCopy.datacenter = this.state.selectedDatacenterOption ? this.state.selectedDatacenterOption.value : null;
    stateCopy.rack = this.state.selectedRackOption ? this.state.selectedRackOption.value : null;
    stateCopy.owner = this.state.selectedOwnerOption ? this.state.selectedOwnerOption.value : null;
    stateCopy.network_ports = networkPortsBuilder
    let stateToSend = this.removeEmpty(stateCopy);

    console.log(JSON.stringify(stateToSend, null, 2))
    console.log(JSON.stringify(this.state, null, 2))

    //CHOKE THE POST CALL
    axios.post('/api/assets/', stateToSend)
      .then(function (response) {
        alert('Created successfully');
        window.location = '/assets'
      })
      .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  handleChangeModel = (event, selectedModelOption) => {
    //console.log(selectedModelOption)
    this.setState({ selectedModelOption });
  };

  handleChangeRack = (event, selectedRackOption) => {
    this.setState({ selectedRackOption });
  };

  handleChangeOwner = (event, selectedOwnerOption) => {
    this.setState({ selectedOwnerOption });
  };

  handleChangeDatacenter = (event, selectedDatacenterOption) => {
    this.setState({ selectedDatacenterOption });
  }

  openNetworkPortConfigAndMAC = () => {
    let fieldList = [];
    for (let i = 0; i < this.state.numberOfNetworkPortsForCurrentAsset; i++) {
      const num = i + 1;
      //const fieldLabel = 'Network Port ' + num;
      fieldList.push(
        <ListItem>
          <Grid item alignContent='center' xs={8}>
            <ListItemText primary={this.state.networkPortNamesForCurrentAsset[i]} />
            <TextField label='MAC Address'
              fullwidth
              type="text"
              // set its value
              value={this.state.macAddresses[i]}
              onChange={e => {
                let a = this.state.macAddresses.slice(); //creates the clone of the state
                a[i] = e.target.value;
                this.setState({ macAddresses: a });
              }} />
          </Grid>

          <Grid item alignContent='center' xs={4}>
            <NetworkPortConnectionDialog
              indexOfThisNPConfig={i}
              sendNetworkPortConnectionID={this.getNetworkPortConnectionID} />
          </Grid>
        </ListItem>
      )
      fieldList.push(
        <Divider />
      )
    }
    return fieldList;
  }


  render() {
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className='themed-container' spacing={2}>
            <Grid item alignContent='center' xs={12} />
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h3" gutterBottom>
                    Create Asset
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="instance-create-model-select"
                    options={this.state.modelOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeModel}
                    value={this.state.selectedModelOption}
                    renderInput={params => (
                      <TextField {...params} label="Model" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Hostname' type="text" fullWidth onChange={e => {
                    let instanceCopy = JSON.parse(JSON.stringify(this.state.asset))
                    instanceCopy.hostname = e.target.value
                    this.setState({
                      asset: instanceCopy
                    })
                  }} />
                </Grid>

                <Grid item xs={12}>
                  <p>new stuff below</p>
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="datacenter-select"
                    //options={this.state.modelOptions}
                    //getOptionLabel={option => option.label}
                    //onChange={this.handleChangeModel}
                    //value={this.state.selectedModelOption}
                    options={this.state.datacenterOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeDatacenter}
                    value={this.state.selectedDatacenterOption}
                    renderInput={params => (
                      <TextField {...params} label="Datacenter" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Asset Number' type="text" fullWidth onChange={e => {
                    // let instanceCopy = JSON.parse(JSON.stringify(this.state.instance))
                    // instanceCopy.hostname = e.target.value
                    // this.setState({
                    //   instance: instanceCopy
                    // })
                  }} />
                </Grid>

                <Grid item xs={6}>
                  <Paper>
                    <Typography variant="h6" gutterBottom>
                      Network Ports
                    </Typography>
                    <List style={{ maxHeight: 200, overflow: 'auto' }}>
                      {this.openNetworkPortConfigAndMAC()}
                    </List>
                  </Paper>

                </Grid>

                <Grid item xs={6}>
                  <Paper>
                    <Typography variant="h6" gutterBottom>
                      Power Ports
                    </Typography>
                    <PowerPortConnectionDialog
                      sendPowerPortConnectionInfo={this.getPowerPortConenctionInfo}
                      numberOfPowerPorts={this.state.powerPorts}
                      // leftFree={this.state.leftFreePDUs}
                      // rightFree={this.state.rightFreePDUs}
                      // selectedRack={this.selectedRackOption} 
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <p>new stuff above</p>
                </Grid>


                <Grid item xs={6}>
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="instance-create-rack-select"
                    options={this.state.rackOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeRack}
                    value={this.state.selectedRackOption}
                    renderInput={params => (
                      <TextField {...params} label="Rack" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  < TextField label="Rack U"
                    fullWidth
                    type="number"
                    onChange={e => {
                      let instanceCopy = JSON.parse(JSON.stringify(this.state.asset))
                      instanceCopy.rack_u = e.target.value
                      this.setState({
                        asset: instanceCopy
                      })
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    id="instance-owner-select"
                    autoComplete
                    autoHighlight
                    options={this.state.ownerOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeOwner}
                    value={this.state.selectedOwnerOption}
                    renderInput={params => (
                      <TextField {...params} label="Owner" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Comment"
                    fullWidth
                    multiline
                    rows="4"
                    type="text"
                    onChange={e => {
                      let instanceCopy = JSON.parse(JSON.stringify(this.state.asset))
                      instanceCopy.comment = e.target.value
                      this.setState({
                        asset: instanceCopy
                      })
                    }} />
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title='Submit'>
                    <Button variant="contained" type="submit" color="primary" endIcon={<AddCircleIcon />}
                      onClick={() => this.handleSubmit}>Create
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Link to={'/assets'}>
                    <Tooltip title='Cancel'>
                      <Button variant="outlined" type="submit" color="primary" endIcon={<CancelIcon />}>Cancel</Button>
                    </Tooltip>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default CreateInstanceForm
