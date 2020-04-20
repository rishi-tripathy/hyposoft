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
import DatacenterContext from './DatacenterContext';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ChangeNewAssetForm extends Component {

  constructor() {
    super();
    this.state = {

      //CP stuff
      cp_nps: [],
      assetId: null, 

      asset: {
        id: null, //cp id
        id_ref: null, //new asset
        cp: null,
        model: null,
        hostname: null,
        datacenter: null,
        rack: null,
        rack_u: null,
        owner: null,
        comment: null,
        asset_number: null,
        network_ports: [],
        power_ports: [],
      },

      modelOptions: [],
      selectedModelOption: null,

      datacenterOptions: [],
      selectedDatacenterOption: null,

      rackOptions: [],
      selectedRackOption: null,

      ownerOptions: [],
      selectedOwnerOption: null,

      //NP stuff
      numberOfNetworkPortsForCurrentAsset: null,
      networkPortNamesForCurrentAsset: [],
      macAddresses: [],
      networkPortConnectionIDs: [],

      //PP stuff
      numberOfPowerPorts: null,
      leftFreePDUSlots: [],
      rightFreePDUSlots: [],
      defaultPPConfigurations: [],
      leftPPName: null,
      rightPPName: null,
      ppConnections: [],

      redirect: false,
      currentMountType: '',
    }
  }

  loadCurrentModelMountType = () => {
    const dst = '/api/models/' + this.state.selectedModelOption.id + '/';
    axios.get(dst).then(res => {
      this.setState({ currentMountType: res.data.mount_type });
    })
      .catch(function (error) {
        alert('Could not load model. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadAssetNumber = () => {
    const dst = '/api/assets/asset_number/';
    axios.get(dst).then(res => {
      let assetCopy = Object.assign({}, this.state.asset);
      assetCopy.asset_number = res.data.asset_number
      this.setState({ asset: assetCopy });
    })
      .catch(function (error) {
        alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadNetworkPortInfoForCurrentlySelectedModel = () => {
    let modelURL = this.state.selectedModelOption.value
    axios.get(modelURL).then(res => {
      this.setState({
        numberOfNetworkPortsForCurrentAsset: res.data.network_ports_num,
        networkPortNamesForCurrentAsset: res.data.network_ports,
      });
    })
      .catch(function (error) {
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  getNetworkPortConnectionID = (index, npID) => {
    let a = this.state.networkPortConnectionIDs.slice(); //creates the clone of the state
    a[index] = npID;
    this.setState({ networkPortConnectionIDs: a });
  }

  getPowerPortConnectionInfo = (ppArray) => {
    let a = ppArray;
    this.setState({ ppConnections: a });
  }

  loadModels = () => {
    // MODEL
    const dst = '/api/assets/model_names/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i])
        myOptions.push({ value: res.data[i].url, label: res.data[i].vendor + ' ' + res.data[i].model_number, id: res.data[i].id, mountType: res.data[i].mount_type });
      }
      this.setState({ modelOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadRacks = () => {
    // RACK
    console.log(this.state.selectedDatacenterOption)
    const dst = '/api/datacenters/' + this.state.selectedDatacenterOption.id + '/racks/?show_all=true';
    console.log(dst)
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
      this.setState({ datacenterOptions: myOptions });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadNumberOfPowerPortsForModel = () => {
    const dst = '/api/models/' + this.state.selectedModelOption.id + '/';
    axios.get(dst).then(res => {
      this.setState({ numberOfPowerPorts: res.data.power_ports });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadLeftAndRightPDUNames = () => {
    const dst = '/api/racks/' + this.state.selectedRackOption.id + '/';
    axios.get(dst).then(res => {
      this.setState({ leftPPName: res.data.pdu_l.name });
      this.setState({ rightPPName: res.data.pdu_r.name });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  loadFreePDUsAndSetDefaultConfigurations = () => {
    const dst = '/api/racks/' + this.state.selectedRackOption.id + '/get_open_pdu_slots/';
    axios.get(dst).then(res => {
      this.setState({ leftFreePDUSlots: res.data.pdu_slots.left });
      this.setState({ rightFreePDUSlots: res.data.pdu_slots.right });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });

    console.log(this.state.leftFreePDUSlots)
    console.log(this.state.rightFreePDUSlots)
  }

  componentDidMount() {
    this.loadAssetNumber();
    this.loadModels();
    this.loadDatacenters();
    this.loadOwners();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedModelOption !== this.state.selectedModelOption) {
      if (this.state.selectedModelOption) {
        this.loadNetworkPortInfoForCurrentlySelectedModel();
        this.loadNumberOfPowerPortsForModel();
        this.loadCurrentModelMountType();
      }
      else {
        this.setState({ networkPortNamesForCurrentAsset: [], numberOfNetworkPortsForCurrentAsset: null });
      }
    }

    if (prevState.selectedDatacenterOption !== this.state.selectedDatacenterOption) {
      if (this.state.selectedDatacenterOption) {
        // console.log(this.state.selectedDatacenterOption)
        if(this.state.selectedDatacenterOption.is_offline){
          this.setState({
            is_offline: true,
          })
        // this.loadLocations();
        }
        else {
          this.setState({
            is_offline: false,
          })
          this.loadRacks();
          // this.loadLocations();
        }
      }
      else {
        this.setState({ rackOptions: [], selectedRackOption: null });
        this.setState({ locationOptions: [], selectedLocationOption: null });
      }
    }

    if (this.state.selectedRackOption !== prevState.selectedRackOption) {
      if (this.state.selectedRackOption) {
        this.loadLeftAndRightPDUNames();
        this.loadFreePDUsAndSetDefaultConfigurations();
      }
    }

    if (this.state.selectedLocationOption !== prevState.selectedLocationOption) {
      if (this.state.selectedLocationOption) {
        this.loadSlotNumbers();
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

    let networkPortsBuilder = [];
    for (let i = 0; i < this.state.numberOfNetworkPortsForCurrentAsset; i++) {
      let obj = {}
      let connectionObj = {}

      connectionObj.network_port_id = this.state.networkPortConnectionIDs[i];
      obj.mac = this.state.macAddresses[i];
      obj.name = this.state.networkPortNamesForCurrentAsset[i];

      if (Object.entries(connectionObj).length > 0 && connectionObj.constructor === Object) {
        obj.connection = connectionObj;
      }

      console.log(obj)
      networkPortsBuilder.push(this.removeEmptyRecursive(obj))
    }

    let tmpPP = []
    for (let i = 0; i < this.state.ppConnections.length; i++) {
      let currentObj = this.removeEmptyRecursive(this.state.ppConnections[i]);
      if (Object.entries(currentObj).length > 0 && currentObj.constructor === Object) {
        tmpPP.push(currentObj)
      }
    }

    let stateCopy = Object.assign({}, this.state.asset);
    stateCopy.model = this.state.selectedModelOption ? this.state.selectedModelOption.id : null;
    stateCopy.datacenter = this.state.selectedDatacenterOption ? this.state.selectedDatacenterOption.id : null;
    stateCopy.rack = this.state.selectedRackOption ? this.state.selectedRackOption.id : null;
    console.log(this.state.selectedOwnerOption)
    stateCopy.owner = this.state.selectedOwnerOption ? this.state.selectedOwnerOption.id : null;
    console.log(stateCopy.owner);
    stateCopy.network_ports = networkPortsBuilder
    stateCopy.power_ports = tmpPP
    stateCopy.cp = this.props.match.params.id;
    stateCopy.id = this.props.match.params.id;

    let stateToSend = this.removeEmpty(stateCopy);

    stateToSend.id_ref = null;
    console.log(stateToSend)

    console.log(JSON.stringify(stateToSend, null, 2))
    //console.log(JSON.stringify(this.state, null, 2))

    axios.post('/api/cpAsset/', stateToSend)
      .then(function (response) {
        alert('Created successfully');
        //this.postNP();
        // this.postPP();
      })
      .catch(function (error) {
        alert('Creation was not successful.\n' + JSON.stringify(error.response.data, null, 2));
      });

      this.getCPId();
  }

  getCPId = () => {
    let dst = '/api/cp/'.concat(this.props.match.params.id).concat('/')

    //looking up what the asset CP id is from the cpAsset list and hostname 
    axios.get(dst).then(res => {
      console.log(res.data)

      res.data.assets_cp.map((a, index) => {
        console.log(a.hostname)
        if(a.hostname === this.state.asset.hostname){
          //match found
          this.setState({
            assetId: a.id,
          });
        }
      })
    })
    .catch(function (error) {
      console.log('Error: ' + error.response.data)
    })

    var self = this;
    self.setState({
      redirect: true,
    })
  }

  // postNP = () => {
  //   console.log('posting NP')
  //   let dst = '/api/cpnp/'.concat().concat('/');
  //   axios.post(dst, stateToSend)

  // }

  handleChangeModel = (event, selectedModelOption) => {
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
    console.log(selectedDatacenterOption)
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
              dcID={this.state.selectedDatacenterOption ? this.state.selectedDatacenterOption.id : null}
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
    console.log(this.state)

    let rack_select = 
      <Autocomplete
        autoComplete
        autoHighlight
        autoSelect
        id="instance-create-rack-select"
        options={this.state.rackOptions}
        getOptionLabel={option => option.label}
        onChange={this.handleChangeRack}
        value={this.state.selectedRackOption}
        disabled={this.state.selectedDatacenterOption === null || this.state.currentMountType=="blade"}
        renderInput={params => (
          <TextField {...params} label="Rack" fullWidth />
        )}
    />;

    let rackU_select = 
      < TextField label="Rack U"
        fullWidth
        type="number"
        disabled={this.state.selectedDatacenterOption === null || this.state.currentMountType=="blade"}
        onChange={e => {
          let instanceCopy = JSON.parse(JSON.stringify(this.state.asset))
          instanceCopy.rack_u = e.target.value
          this.setState({
            asset: instanceCopy
          })
      }} />;

      let np_select = 
        <Paper>
          <Typography variant="h6" gutterBottom>
            Network Ports
          </Typography>
          <List style={{ maxHeight: 200, overflow: 'auto' }}>
            {this.openNetworkPortConfigAndMAC()}
          </List>
      </Paper>;

      let pp_select = 
        <Paper>
          <Typography variant="h6" gutterBottom>
            Power Ports
          </Typography>
          <PowerPortConnectionDialog
            sendPowerPortConnectionInfo={this.getPowerPortConnectionInfo}
            numberOfPowerPorts={this.state.numberOfPowerPorts}
            rackID={this.state.selectedRackOption ? this.state.selectedRackOption.id : null}
            leftPPName={this.state.leftPPName}
            rightPPName={this.state.rightPPName}
            leftFree={this.state.leftFreePDUSlots}
            rightFree={this.state.rightFreePDUSlots}
            isDisabled={this.state.selectedRackOption === null || this.state.selectedModelOption === null}
            currentPowerPortConfiguration={null}
          />
        </Paper>;

        let options2 = this.context.datacenterOptions;
        // console.log(options2)
        options2 = options2.slice(1);
        let options = options2.map((option) => {
          let firstLetter = option.is_offline;
          // console.log(firstLetter);
            return {
              firstLetter: /true/.test(firstLetter) ? "Offline Sites" : "Datacenters",
              ...option
            };
        })

        let groupedModelOptions = this.state.modelOptions;
        // console.log(groupedModelOptions)
        groupedModelOptions.map(modelOption => {
          let mounts = modelOption.mountType.toString();
          // console.log(mounts);
            return {
              mounts: /[0-9]/.test(mounts) ? "dumbshit" : modelOption.mountType.toString(),
              ...modelOption
            };
          })


    // console.log(this.state.currentMountType)
    // console.log(this.state.locationOptions)

    return (
      <div>
        {this.state.redirect && <Redirect to={{ pathname: '/changeplans/'.concat(this.props.match.params.id) }} />}
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
                    getOptionDisabled={(modelOption) => modelOption.mountType==='blade'}
                    options={groupedModelOptions/*.sort((a, b) => -b.mounts.localeCompare(a.mounts))*/}
                    groupBy={modelOption => modelOption.mounts}
                    getOptionLabel={modelOption => modelOption.label}
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

                <Grid item xs={6} />

                <Grid item xs={6}>
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="datacenter-select"

                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={option => option.firstLetter}
                    getOptionLabel={option => option.abbreviation}
                    onChange={this.handleChangeDatacenter}
                    defaultValue={this.context.datacenter}
                    value={this.state.selectedDatacenterOption}
                    renderInput={params => (
                      <TextField {...params} label="DC/Offline Site" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label='Asset Number'
                    type="text"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={this.state.asset.asset_number} onChange={e => {
                      let instanceCopy = JSON.parse(JSON.stringify(this.state.asset))
                      instanceCopy.asset_number = e.target.value
                      this.setState({
                        asset: instanceCopy
                      })
                    }} />
                </Grid>



                <Grid item xs={6}>
                  {this.state.is_offline ? <p></p> : rack_select}
                </Grid>
                <Grid item xs={6}>
                  {this.state.is_offline ? <p></p> : rackU_select}
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="instance-create-location-select"
                    options={this.state.locationOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeLocation}
                    value={this.state.selectedLocationOption}
                    disabled={this.state.selectedDatacenterOption === null || this.state.currentMountType != 'blade'}
                    renderInput={params => (
                      <TextField {...params} label="Location" fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  {/* < TextField label="Chassis Slot"
                    fullWidth
                    type="number"
                    disabled={this.state.currentMountType != 'blade'}
                    onChange={e => {
                      let instanceCopy = JSON.parse(JSON.stringify(this.state.asset))
                      instanceCopy.slot_number = e.target.value
                      this.setState({
                        asset: instanceCopy
                      })
                    }} /> */}
                  <Autocomplete
                    autoComplete
                    autoHighlight
                    autoSelect
                    id="instance-create-slot-select"
                    options={this.state.slotNumberOptions}
                    getOptionLabel={option => option.label}
                    onChange={this.handleChangeSlotNumber}
                    value={this.state.selectedSlotNumberOption}
                    disabled={this.state.selectedDatacenterOption === null || this.state.selectedLocationOption == null || this.state.currentMountType != 'blade'}
                    renderInput={params => (
                      <TextField {...params} label="Chassis slot number" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  {this.state.is_offline ? <p></p> : np_select}
                </Grid>

                <Grid item xs={6}>
                  {this.state.is_offline ? <p></p> : pp_select}
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

                {/* {/*add model upgrades in below if you have time  */}
                {/* <Grid item xs={6}>
                <Paper>
                  {this.renderTableToolbar()}
                  <TableContainer>
                    <Table
                      size="small"
                      aria-labelledby="modelTableTitle"
                      aria-label="enhanced table"
                    >
                      <TableRow>{this.renderTableHeader()}</TableRow>

                      <TableBody textAlign='center' >
                        {this.renderCheckRow()}
                        {this.renderTableData()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                </Grid> */}
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

ChangeNewAssetForm.contextType = DatacenterContext;

export default ChangeNewAssetForm
