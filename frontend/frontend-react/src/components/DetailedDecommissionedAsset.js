import React, { Component } from 'react'
import {
  IconButton, Table, TableCell,
  TableRow, TableBody, TableSortLabel,
  Container, Grid, Typography, TableContainer,
  Tooltip, Paper
} from "@material-ui/core";
import axios from 'axios'
import DecommissionedAssetCard from './DecommissionedAssetCard';

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class DetailedDecommissionedAsset extends Component {

  constructor() {
    super();
    this.state = {
      decommissionedAsset: null,
    }
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
              {/* <AllConnectedAssetsView connectedAssets={this.state.connectedAssets} /> */}
            </Grid>
            <Grid item xs={6}>
              {
                // this.state.asset.datacenter
                //   && this.state.asset.rack
                //   && (this.state.asset.owner && (this.context.username === this.state.asset.owner) || this.context.username === 'admin' || !this.state.asset.owner)
                //   && this.state.asset.datacenter.abbreviation.toLowerCase() === 'rtp1'
                //   && regex.test(this.state.asset.rack.rack_number.toLowerCase())

                //   ?
                //(
                <div>
                  <Typography variant="h4" gutterBottom>
                    Power Management
                  </Typography>
                  {/* <PowerManagement assetID={this.props.match.params.id} /> */}
                </div>
                //)
                // :
                // <p></p>
              }

            </Grid>

            <Grid item xs={6}>
              <Typography variant="h4" gutterBottom>
                Asset Network Graph
              </Typography>
              {/* <AssetNetworkGraph assetID={this.props.match.params.id} /> */}
            </Grid>

            <Grid item xs={6}>

            </Grid>


          </Grid>
        </Container>
      </div>
    )
  }
}

export default DetailedDecommissionedAsset
