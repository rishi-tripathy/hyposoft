import React, {Component} from 'react'
import axios from 'axios'
import {Autocomplete} from "@material-ui/lab"
import {
  Button, Container, TextField,
  Grid, Input, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography,
  Tooltip, Paper, List,
  ListItem, Card, CardContent, Divider, ListItemText
} from "@material-ui/core";
import {Redirect, Link} from 'react-router-dom'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from '@material-ui/icons/Cancel';
import NetworkPortConnectionDialog from './NetworkPortConnectionDialog'
import AllConnectedAssetsView from './AllConnectedAssetsView'
import ChangePlanAssetCard from './ChangePlanAssetCard'
import PowerPortConnectionDialog from './PowerPortConnectionDialog'
import CircularProgress from '@material-ui/core/CircularProgress';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ChangeExistingAssetForm extends Component {
    
    constructor() {
        super();
        this.state = {

            //changeplan metadata
            changePlanId: 1,
            loading: true,

            //stuff for view
            assetLV: {},
            connectedAssetsLV: [],

            //stuff for editing
            assetChanged: {
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
            rackOptions: [],
            numberOfNetworkPortsForCurrentAsset: null,
            macAddresses: [],
            networkPortConnectionIDs: [],
            networkPortNamesForCurrentAsset: null,
            connectedNPs: null,
            numberOfPowerPorts: null,
            leftPPName: null,
            rightPPName: null,
            leftFreePDUSlots: null,
            rightFreePDUSlots: null,
            selectedRackOption: null,
            selectedModelOption: null,
            selectedDatacenterOption: null,
            datacenterOptions: [],
        }
    }

    componentDidMount() {
        const delay = 70;
        this.loadLVInstance(); //has to be first
        this.loadInstanceChanged();

        setTimeout(() => {
            this.initializeDCState();
         // this.loadModels();
          this.loadDatacenters();
         // this.loadOwners();
          this.getConnectedAssetsLV();
          this.loadRacks();
          this.loadMACAddresses();
          this.loadConnectedNPs();
        }, delay);

        setTimeout(() => {
          this.loadNetworkPortInfoForCurrentlySelectedModel();
          this.loadNumberOfPowerPortsForModel();
          this.loadLeftAndRightPDUNames();
          this.loadFreePDUsAndSetDefaultConfigurations();
        }, 320);

    }

      loadLVInstance = () => {
        // if (this.props.match.params.id) {
        //   let dst = '/api/assets/'.concat(this.props.match.params.id).concat('/');
        let dst = '/api/assets/13/' //change later
          axios.get(dst).then(res => {
            this.setState({
              assetLV: res.data,
              selectedModelOption: res.data.model,
            });
            console.log('got live view data')
            console.log(res.data.model)
          })
            .catch(function (error) {
              // TODO: handle error
              alert('Cannot load assets. Re-login.\n' + JSON.stringify(error.response, null, 2));
            });
        // }
      }

      loadMACAddresses = () => {
        let tmpMAC = []
        let NPs = this.state.assetChanged.network_ports
        for (let i = 0; i < this.state.numberOfNetworkPortsForCurrentAsset; i++) {
          tmpMAC.push(NPs[i].mac)
        }
        this.setState({
          macAddresses: tmpMAC,
        })
      }
    
      loadConnectedNPs = () => {
        let NPs = this.state.assetChanged.network_ports
        let tmpNPConnects = []
        for (let i = 0; i < this.state.numberOfNetworkPortsForCurrentAsset; i++) {
          if (NPs[i].connection) {
            tmpNPConnects[i] = {}
            tmpNPConnects[i].connectedPortID = NPs[i].connection.id;
            tmpNPConnects[i].connectedPortName = NPs[i].connection.name;
            tmpNPConnects[i].connectedAssetHostname = NPs[i].connection.assetChanged.hostname;
          }
          else {
            tmpNPConnects[i] = {}
            tmpNPConnects[i].connectedPortID = null
            tmpNPConnects[i].connectedPortName = null
            tmpNPConnects[i].connectedAssetHostname = null
          }
        }
        console.log(tmpNPConnects)
        this.setState({
          connectedNPs: tmpNPConnects
        })
      }

      getConnectedAssetsLV = () => {
        let tmpConnections = []
        let npArray = this.state.assetLV.network_ports;
        console.log(npArray)
        for (let i = 0; i < npArray.length; i++) {
          if (npArray[i].connection) {
            let obj = npArray[i].connection.asset;
            obj.my_name = npArray[i].name;
            obj.name = npArray[i].connection.name;
            tmpConnections.push(obj)
          }
        }
        this.setState({ connectedAssetsLV: tmpConnections })
        // return tmpConnections;
        console.log('got live view connected assets')
      }

      renderPPConnectionTableDataLV = () => {
        if (this.state.assetLV && this.state.assetLV.power_ports) {
          return this.state.assetLV.power_ports.map((pp) => {
            return (
              <TableRow
              hover
              tabIndex={-1}
              key={pp.id}
            >
              <TableCell align="center">{pp ? (pp.pdu ? pp.pdu.name : null) : null }</TableCell>
              <TableCell align="center">{pp ? pp.port_number : null} </TableCell>
              
            </TableRow>
            )
          })
        }
        else {
          return <div><p></p></div>
        }
      }
    
      renderPPConnectionTableHeaderLV() {
        let headCells = [
          { id: 'pdu_name', label: 'PDU Name' },
          { id: 'port_number', label: 'Port Number' }
        ];
        return headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={'default'}
    
          >
            {headCell.label.toUpperCase()}
          </TableCell>
        ))
    
      }
    

      loadInstanceChanged = () => {
        //let dst = '/api/assets/'.concat(this.props.match.params.id).concat('/');
        let dst = '/api/assets/13/' //change later
        axios.get(dst).then(res => {
          let instanceCopy = JSON.parse(JSON.stringify(this.state.assetChanged));
          instanceCopy.model = res.data.model;
          instanceCopy.hostname = res.data.hostname;
          instanceCopy.datacenter = res.data.datacenter;
          instanceCopy.rack = res.data.rack;
          instanceCopy.rack_u = res.data.rack_u;
          instanceCopy.owner = res.data.owner;
          instanceCopy.comment = res.data.comment;
          instanceCopy.asset_number = res.data.asset_number;
          instanceCopy.network_ports = res.data.network_ports;
          instanceCopy.power_ports = res.data.power_ports;
          this.setState({
            assetChanged: instanceCopy,
          });
          console.log(this.state.assetChanged)
        })
          .catch(function (error) {
            // TODO: handle error
            alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
          });
      }

      initializeDCState = () => {
          this.setState({
              selectedDatacenterOption: this.state.assetChanged.datacenter,
          })
          console.log(this.selectedDatacenterOption)
      }

      loadRacks = () => {
        // RACK
        console.log(this.state.selectedDatacenterOption) 
        const dst = '/api/datacenters/' + this.state.selectedDatacenterOption.id + '/racks/?show_all=true';
        console.log(dst)
        axios.get(dst).then(res => {
        console.log(res.data)
          let myOptions = [];
          for (let i = 0; i < res.data.length; i++) {
            myOptions.push({ value: res.data[i].url, label: res.data[i].rack_number, id: res.data[i].id });
          }
          this.setState({
            rackOptions: myOptions,
            selectedRackOption: { value: this.state.assetChanged.rack.url, label: this.state.assetChanged.rack.rack_number, id: this.state.assetChanged.rack.id },
          })
        })
          .catch(function (error) {
            // TODO: handle error
            alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
          });
      }

    getPowerPortConnectionInfo = (ppArray) => {
        let a = ppArray;
    
        // add id to each PP for PUT
        for (let i = 0; i < a.length; i++) {
          console.log(a[i])
          if (Object.entries(a[i]).length > 0 && a[i].constructor === Object) {
            if (! a[i]) {
              let obj = {}
              obj.id = this.state.assetChangedpower_ports[i].id
              a.push(obj)
            }
            else {
              a[i].id = this.state.assetChanged.power_ports[i].id
            }
          }
          console.log(a[i])
        }
    
        this.setState({ ppConnections: a });
      }
    
      loadNumberOfPowerPortsForModel = () => {
        const dst = '/api/models/' + this.state.selectedModelOption.id + '/';
        axios.get(dst).then(res => {
            console.log(res)
          this.setState({ numberOfPowerPorts: res.data.power_ports });
        })
          .catch(function (error) {
            // TODO: handle error
            alert('Could not load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
          });
      }

      loadNetworkPortInfoForCurrentlySelectedModel = () => {
        const dst = '/api/models/' + this.state.selectedModelOption.id + '/';
        axios.get(dst).then(res => {
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
    
      loadLeftAndRightPDUNames = () => {
        const dst = '/api/racks/' + this.state.selectedRackOption.id + '/';
        console.log(dst)
        axios.get(dst).then(res => {
          this.setState({ leftPPName: res.data.pdu_l.name });
          this.setState({ rightPPName: res.data.pdu_r.name });
        })
          .catch(function (error) {
            // TODO: handle error
            console.log(error.response)
            //alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
          });
      }
    
      loadFreePDUsAndSetDefaultConfigurations = () => {
        const dst = '/api/racks/' + this.state.selectedRackOption.id + '/get_open_pdu_slots/';
        console.log(dst)
        axios.get(dst).then(res => {
          this.setState({ leftFreePDUSlots: res.data.pdu_slots.left });
          this.setState({ rightFreePDUSlots: res.data.pdu_slots.right });
          this.setState({ loading: false });
        })
          .catch(function (error) {
            // TODO: handle error
            console.log(error.response)
            //alert('Could not load model names. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
          });
    
        // console.log(this.state.leftFreePDUSlots)
        // console.log(this.state.rightFreePDUSlots)
      }

      removeEmpty = (obj) => {
        Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
        return obj;
      };
    

    loadDatacenters = () => {
        const dst = '/api/datacenters/?show_all=true';
        axios.get(dst).then(res => {
          let myOptions = [];
          for (let i = 0; i < res.data.length; i++) {
            //TODO: change value to URL
            myOptions.push({ value: res.data[i].url, label: res.data[i].abbreviation, id: res.data[i].id });
          }
          this.setState({
            datacenterOptions: myOptions,
            selectedDatacenterOption: {
              value: this.state.assetChanged.datacenter ? this.state.assetChanged.datacenter.url : null,
              label: this.state.assetChanged.datacenter ? this.state.assetChanged.datacenter.abbreviation : null,
              id: this.state.assetChanged.datacenter ? this.state.assetChanged.datacenter.id : null,
            }
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert('Could not load owners. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
          });
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
                  InputLabelProps={{ shrink: true }}
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
                  connectedPortID={this.state.connectedNPs[i] ? this.state.connectedNPs[i].connectedPortID : null}
                  connectedPortName={this.state.connectedNPs[i] ? this.state.connectedNPs[i].connectedPortName : null}
                  connectedAssetHostname={this.state.connectedNPs[i] ? this.state.connectedNPs[i].connectedAssetHostname : null}
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

      handleChangeRack = (event, selectedRackOption) => {
        this.setState({ selectedRackOption });
      };

    render() {
        console.log(this.state)
        return(
            <div>
            {this.state.loading ?  
                <center>
                <CircularProgress size={100}/>
            </center> : 
            <div>
            <Container maxwidth="xl">
                <Grid container className="themed-container" spacing={2}>
                  <Grid item justify="flex-start" alignContent='center' xs={12}/>
                  <Grid item justify="flex-start" alignContent='center' xs={10}>
                    <Typography variant="h4" gutterBottom>
                        Changing an Existing Asset in Change Plan: {this.state.changePlanId}
                    </Typography>
                  </Grid>
                  <Grid item justify="flex-start" alignContent='center' xs={12} >
                    View the current state of the asset on the left. Make changes in your change plan on the right.
                </Grid>

                  {/* column 1 */}
                  <Grid item justify="flex-start" alignContent='center' xs={6}>
                    <Card>
                        <CardContent>
                            <Container maxwidth="xl">
                            <Grid container className="themed-container" spacing={1}>
                            <Grid item justify="flex-start" alignContent='center' xs={12}>
                                <Typography variant="h5" >
                                    Current Asset Details
                                </Typography>
                            </Grid>
                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Basic Details
                                </Typography>
                                <Paper>
                                    <ChangePlanAssetCard asset={[this.state.assetLV]} />
                                </Paper>
                            </Grid>

                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                            
                           <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Connected Power Ports
                            </Typography>

                            <TableContainer>
                                <Table
                                size="small"
                                aria-labelledby="instanceTableTitle"
                                aria-label="instanceTable"
                                >
                                <TableRow>{this.renderPPConnectionTableHeaderLV()}</TableRow>

                                <TableBody>
                                    {this.renderPPConnectionTableDataLV()}
                                </TableBody>
                                </Table>
                            </TableContainer>
                            </Grid>

                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                            <Grid item justify="flex-start" alignContent='center' xs={12} />

                        <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Connected Assets
                        </Typography>
                        <AllConnectedAssetsView connectedAssets={this.state.connectedAssetsLV} />
                        </Grid>
                        </Grid>
                        </Container>
                        </CardContent>
                    </Card>
                  </Grid>

                  {/* column 2 */}
                  <Grid item justify="flex-start" alignContent='center' xs={6}>
                    <Card>
                        <CardContent>
                            <Container maxwidth="xl">
                                <Grid container className="themed-container" spacing={1}>
                                    <Grid item justify="flex-start" alignContent='center' xs={12}>
                                        <Typography variant="h5" >
                                            Asset Changes
                                        </Typography>
                                    </Grid>

                                    <Grid item justify="flex-start" alignContent='center' xs={12} />
                                    <Grid item justify="flex-start" alignContent='center' xs={12} />

                                    <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Basic Details
                                    </Typography>
                                    <Grid item xs={6}>
                                        <TextField label='Hostname' type="text" fullWidth
                                            value={this.state.assetChanged.hostname}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={e => {
                                            let instanceCopy = JSON.parse(JSON.stringify(this.state.assetChanged))
                                            instanceCopy.hostname = e.target.value
                                            this.setState({
                                                assetChanged: instanceCopy
                                            })
                                            }} />
                                        </Grid>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            autoComplete
                                            autoHighlight
                                            autoSelect
                                            id="datacenter-select"
                                            options={this.state.datacenterOptions}
                                            getOptionLabel={option => option.label}
                                            onChange={this.handleChangeDatacenter}
                                            value={this.state.selectedDatacenterOption}
                                            defaultValue={this.state.assetChanged.datacenter.abbreviation}
                                            renderInput={params => (
                                            <TextField {...params} label="Datacenter" fullWidth />
                                            )}
                                        />
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
                                            defaultValue={this.state.assetChanged.rack.rack_number}
                                            value={this.state.selectedRackOption}
                                            disabled={this.state.selectedDatacenterOption === null}
                                            renderInput={params => (
                                            <TextField {...params} label="Rack" fullWidth />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        < TextField label="Rack U"
                                            fullWidth
                                            type="number"
                                            value={this.state.assetChanged.rack_u}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={e => {
                                            let instanceCopy = JSON.parse(JSON.stringify(this.state.asset))
                                            instanceCopy.rack_u = e.target.value
                                            this.setState({
                                                assetChanged: instanceCopy
                                            })
                                            }} />
                                    </Grid>
                                    
                                    </Grid>

                                    {/* connected PP */}
                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                            <Grid item justify="flex-start" alignContent='center' xs={12} />


                                    <Grid item xs={12}>
                                        <Paper>
                                            <Typography variant="h6" gutterBottom>
                                                Network Ports
                                            </Typography>
                                            <List style={{ maxHeight: 200, overflow: 'auto' }}>
                                                {this.openNetworkPortConfigAndMAC()}
                                            </List>
                                        </Paper>
                                    </Grid>

                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                            <Grid item justify="flex-start" alignContent='center' xs={12} />
                                    
                                    {/* connected assets */}
                                    <Grid item xs={12}>
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
                                            isDisabled={this.state.selectedRackOption === null}
                                            currentPowerPortConfiguration={this.state.assetChanged ? this.state.assetChanged.power_ports : null}
                                            />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Container>
                        </CardContent>
                    </Card>
                  </Grid>

                </Grid>
              </Container>
            </div>
        }
        </div>
        )
    }

}

export default ChangeExistingAssetForm