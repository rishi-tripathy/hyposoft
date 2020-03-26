import React, { Component } from 'react'
import {
  IconButton, Table, TableCell,
  TableRow, TableBody, TableSortLabel,
  Container, Grid, Typography, TableContainer,
  Tooltip, Paper
} from "@material-ui/core";
import axios from 'axios'
import DecommissionedAssetCard from './DecommissionedAssetCard';
import AllConnectedAssetsView from './AllConnectedAssetsView'
import AssetNetworkGraph from './AssetNetworkGraph'
import DecommissionedAssetNetworkGraph from './DecommissionedAssetNetworkGraph';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DetailedDecommissionedAsset extends Component {

  constructor() {
    super();
    this.state = {
      decommissionedAsset: null,
      connectedAssets: [],
    }
  }

  getConnectedAssets = () => {
    if (! this.state.decommissionedAsset) {
      return;
    }
    let tmpConnections = []
    let npArray = this.state.decommissionedAsset.asset_state.network_ports;
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

  loadDecommissionedAsset = () => {
    if (this.props.match.params.id) {
      let dst = '/api/decommissioned/'.concat(this.props.match.params.id).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          decommissionedAsset: res.data
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load decommissioned assets. Re-login.\n' + JSON.stringify(error.response, null, 2));
        });
    }
  }

  componentDidMount() {
    this.loadDecommissionedAsset();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.decommissionedAsset !== this.state.decommissionedAsset) {
      this.getConnectedAssets();
    }
  }

  renderPPConnectionTableData = () => {
    if (this.state.decommissionedAsset && this.state.decommissionedAsset.asset_state.power_ports) {
      return this.state.decommissionedAsset.asset_state.power_ports.map((pp) => {
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
    console.log(JSON.stringify(this.state.decommissionedAsset, null, 2))
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Decommissioned Asset View
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>
                Decommissioned by {this.state.decommissionedAsset ? this.state.decommissionedAsset.username : null} at {this.state.decommissionedAsset ? this.state.decommissionedAsset.timestamp : null}
              </Typography>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={12}>
              <Paper>
                <DecommissionedAssetCard asset={[this.state.decommissionedAsset]} />
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
              <Typography variant="h4" gutterBottom>
                Asset Network Graph
              </Typography>
              {/* <AssetNetworkGraph assetID={this.state.decommissionedAsset ? this.state.decommissionedAsset.asset_state.id : null} /> */}
              {/* <AssetNetworkGraph assetID={this.props.match.params.id} /> */}
              <DecommissionedAssetNetworkGraph asset={this.state.decommissionedAsset ? this.state.decommissionedAsset : null} />
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default DetailedDecommissionedAsset
