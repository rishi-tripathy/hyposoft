import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import {
  Typography, Paper, IconButton, Tooltip, Container, Grid
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import AllConnectedAssetsView from './AllConnectedAssetsView'
import PowerManagement from './PowerManagement'
import AssetNetworkGraph from './AssetNetworkGraph'

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

  render() {
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
                <InstanceCard is_admin={this.props.is_admin}
                  asset={[this.state.asset]} />
              </Paper>
            </Grid>
            <Grid item alignContent='center' xs={12} />
            <Grid item alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              {/* <Typography variant="h6">
                Model for this Asset
              </Typography>
              {model ? (
                <div>
                  <Link to={'/models/' + model.id}>
                    <Tooltip title='View Model Details'>
                      <IconButton size="sm">
                        <PageviewIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </div>
              ) : <p></p>} */}
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

export default DetailedInstance
