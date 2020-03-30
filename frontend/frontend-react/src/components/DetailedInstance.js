import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import {
  Typography, Paper, IconButton, 
  Tooltip, Container, Grid,
  Table, TableRow, TableCell, TableContainer,
  TableBody,
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import AllConnectedAssetsView from './AllConnectedAssetsView'
import PowerManagement from './PowerManagement'
import AssetNetworkGraph from './AssetNetworkGraph'
import DatacenterContext from './DatacenterContext';


axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedInstance extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      asset: {},
      connectedAssets: [],
    }
  }

  loadInstance = () => {
    if (this.props.match.params.id) {
      let dst = '/api/assets/'.concat(this.props.match.params.id).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          asset: res.data
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load assets. Re-login.\n' + JSON.stringify(error.response, null, 2));
        });
    }
  }

  getConnectedAssets = () => {
    let tmpConnections = []
    let npArray = this.state.asset.network_ports;
    console.log(npArray)
    for (let i = 0; i < npArray.length; i++) {
      if (npArray[i].connection) {
        let obj = npArray[i].connection.asset;
        obj.my_name = npArray[i].name;
        obj.name = npArray[i].connection.name;
        tmpConnections.push(obj)
      }
    }
    this.setState({ connectedAssets: tmpConnections })
    // return tmpConnections;
  }

  componentDidMount() {
    this.loadInstance();
    //this.getConnectedAssets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadInstance();
      // if (this.state.asset) {
      //   this.getConnectedAssets();
      // }
    }

    if (prevState.asset !== this.state.asset) {
      this.getConnectedAssets();
    }

  }

  renderPPConnectionTableData = () => {
    if (this.state.asset && this.state.asset.power_ports) {
      return this.state.asset.power_ports.map((pp) => {
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

  renderPPConnectionTableHeader() {
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

  render() {
    console.log(this.context)
    const regex = /[a-e][0-1]?[0-9]$/
    const { id, model, hostname, rack, rack_u, owner, comment } = this.state.asset;
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Detailed Asset View
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <InstanceCard asset={[this.state.asset]} />
              </Paper>
            </Grid>
            <Grid item alignContent='center' xs={12} />
            <Grid item alignContent='center' xs={12} />



            <Grid item xs={6}>
              <Typography variant="h4" gutterBottom>
                Connected Power Ports
              </Typography>

              <TableContainer>
                <Table
                  size="small"
                  aria-labelledby="instanceTableTitle"
                  aria-label="instanceTable"
                >
                  <TableRow>{this.renderPPConnectionTableHeader()}</TableRow>

                  <TableBody>
                    {this.renderPPConnectionTableData()}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={6}>

            </Grid>


            <Grid item xs={6}>
              <Typography variant="h4" gutterBottom>
                Connected Assets
              </Typography>
              <AllConnectedAssetsView connectedAssets={this.state.connectedAssets} />
            </Grid>
            <Grid item xs={6}>
              {
                this.state.asset.datacenter
                  && this.state.asset.rack
                  //&& (this.state.asset.owner && (this.context.username === this.state.asset.owner) || this.context.username === 'admin' || !this.state.asset.owner)
                  && (this.context.is_admin || this.context.username === 'admin' || this.context.power_permission || (this.context.username === this.state.asset.owner)  )
                  && this.state.asset.datacenter.abbreviation.toLowerCase() === 'rtp1'
                  && regex.test(this.state.asset.rack.rack_number.toLowerCase())

                  ?
                  (<div>
                    <Typography variant="h4" gutterBottom>
                      Power Management
                  </Typography>
                    <PowerManagement assetID={this.props.match.params.id} />
                  </div>)
                  :
                  <p></p>
              }

            </Grid>

            <Grid item xs={6}>
              <Typography variant="h4" gutterBottom>
                Asset Network Graph
              </Typography>
              <AssetNetworkGraph assetID={this.props.match.params.id} />
            </Grid>

            <Grid item xs={6}>

            </Grid>


          </Grid>
        </Container>
      </div>
    )
  }
}

DetailedInstance.contextType = DatacenterContext;

export default DetailedInstance
