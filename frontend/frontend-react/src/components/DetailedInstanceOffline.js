import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCardOffline';
import {
  Typography, Paper, IconButton, 
  Tooltip, Container, Grid,
  Table, TableRow, TableCell, TableContainer,
  TableBody,
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import DatacenterContext from './DatacenterContext';
import AllInstalledBladesView from './AllInstalledBladesView';
import DetailedBladeView from './DetailedBladeView';


axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedInstanceOffline extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      asset: {},
      installedBlades: [],
      modelChanged: false,
    }
  }

  loadInstance = () => {
    if (this.props.match.params.id) {
      if (this.props.location.state != null && this.props.location.state.isBlade) {
        let dst = '/api/blades/'.concat(this.props.match.params.id).concat('/');
        axios.get(dst).then(res => {
          let mc = false;
          if(res.data.ovr_color || res.data.ovr_storage || res.data.ovr_cpu || res.data.ovr_memory){
            mc = true;
          }
          this.setState({
            asset: res.data,
            modelChanged: mc,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert('Cannot load assets. Re-login.\n' + JSON.stringify(error.response, null, 2));
          });
      }
      else {
        let dst = '/api/all_assets/'.concat(this.props.match.params.id).concat('/');
        axios.get(dst).then(res => {
          let mc = false;
          if(res.data.asset.ovr_color || res.data.asset.ovr_storage || res.data.asset.ovr_cpu || res.data.asset.ovr_memory){
            mc = true;
          }
          this.setState({
            asset: res.data.asset,
            is_offline: res.data.asset.datacenter.is_offline,
            modelChanged: mc,
          });
        })
          .catch(function (error) {
            // TODO: handle error
            alert('Cannot load assets. Re-login.\n' + JSON.stringify(error.response, null, 2));
          });
      }

    }
  }


  componentDidMount() {
    this.loadInstance();
    //this.getConnectedAssets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadInstance();
      // don't put shit in here; it won't reach

      // if (this.state.asset) {
      //   this.getConnectedAssets();
      // }
    }

    if (prevState.asset !== this.state.asset) {
      console.log(this.props.location.state)
      if ((this.props.location.state != null && this.props.location.state.isBlade) || this.state.is_offline) {

      }
      else {
        this.loadInstalledBlades();
      }
    }

  }

  loadInstalledBlades = () => {
    if (this.props.match.params.id) {
      // params.id is chassis id
      let dst = '/api/assets/'.concat(this.props.match.params.id).concat('/blades/');
      axios.get(dst).then(res => {
        this.setState({
          installedBlades: res.data
        });
      })
        .catch(function (error) {
          // TODO: handle error
          alert('Cannot load blades. Re-login.\n' + JSON.stringify(error.response, null, 2));
        });
    }
  }

  renderTableToolbar = () => {
    return (
          <Typography variant="h4" id="modelFieldsTableTitle">
            Model Changes for Asset
          </Typography>
    );
  };

  renderTableHeader() {
    let headCells = [
      {id: 'display_color', label: 'Color'},
      {id: 'cpu', label: 'CPU'},
      {id: 'memory', label: 'Memory'},
      {id: 'storage', label: 'Storage'},
    ];
    return headCells.map(headCell => (
      <TableCell
        align={'center'}
        padding={'default'}

      >
        {headCell.label.toUpperCase()}

      </TableCell>
    ))
  }

  renderTableData() {
   
    if(!this.state.modelChanged){
      return(
        <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={12}>No changes were made to the model.</TableCell>
      </TableRow>
      )
    }
    else{
      return (
        <TableRow
        hover
        tabIndex={-1}
      >
         <TableCell align="right">{ this.state.asset.ovr_color ? <div style={{
                width: 12,
                height: 10,
                backgroundColor: '#' + this.state.asset.ovr_color,
                left: 2,
                top: 2,
              }}></div> 
            : 'n/a'}</TableCell>
      <TableCell align="center">{this.state.asset.ovr_cpu ? this.state.asset.ovr_cpu : 'n/a'}</TableCell>
      <TableCell align="center">{this.state.asset.ovr_memory ? this.state.asset.ovr_memory : 'n/a'}</TableCell>
      <TableCell align="center">{this.state.asset.ovr_storage ? this.state.asset.ovr_storage : 'n/a'}</TableCell>
    </TableRow>
      )
    }
  }

  render() {
    if (this.props.location.state != null && this.props.location.state.isBlade) {
      return (
        <div>
          <DetailedBladeView blade={this.state.asset} />
          <Container maxwidth="xl">
          <Grid item xs={6}>
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
                        {this.renderTableData()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Container>
        </div>
      )
    }
    else {
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
              <Paper>
                  {this.renderTableToolbar()}
                  <TableContainer>
                    <Table
                      size="small"
                      aria-labelledby="modelTableTitle2"
                      aria-label="enhanced table2"
                    >
                      <TableRow>{this.renderTableHeader()}</TableRow>

                      <TableBody textAlign='center' >
                        {this.renderTableData()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                {
                  this.state.asset.model ? (
                    this.state.asset.model.mount_type === 'chassis' ? (
                      <div>
                        <Typography variant="h4" gutterBottom>Installed Blades</Typography>
                        <AllInstalledBladesView blades={this.state.installedBlades} />
                      </div>
                    )
                      : (<div></div>)
                  )
                    : (<div></div>)
                }
              </Grid>


            </Grid>
          </Container>
        </div>
      )
    }
  }
}

DetailedInstanceOffline.contextType = DatacenterContext;

export default DetailedInstanceOffline
