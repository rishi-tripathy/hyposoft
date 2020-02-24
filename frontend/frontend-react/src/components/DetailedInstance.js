import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';
import {
  Typography, Paper, IconButton, Tooltip, Container, Grid
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import AllConnectedAssetsView from './AllConnectedAssetsView'

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
        tmpConnections.push(npArray[i].connection.asset)
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
              <Typography variant="h6">
                Model for this Asset
              </Typography>
              {model ? (
                <div>
                  <Link to={'/models/' + model.id}>
                    <Tooltip title='View Model Details'>
                      {/* onClick={() => this.showDetailedModel(id)} */}
                      <IconButton size="sm">
                        <PageviewIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </div>
              ) : <p></p>}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Connected Assets
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <AllConnectedAssetsView connectedAssets={this.state.connectedAssets} />
            </Grid>
            <Grid item xs={6}></Grid>


          </Grid>
        </Container>
      </div>
    )
  }
}

export default DetailedInstance
