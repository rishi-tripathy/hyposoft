import React, { Component } from 'react'
import {
  Collapse, Table, TableBody,
  Button, TableCell, TableContainer,
  TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip,
  TableSortLabel, Container, Grid,
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import axios from 'axios'
import ChassisCard from './ChassisCard';
import BladePowerManagement from './BladePowerManagement'

axios.defaults.xsrfHeaderName = "X-CSRFToken";


export class DetailedBladeView extends Component {

  constructor() {
    super();
    this.state = {
      currentBladeID: null,
      currentChassisID: null,
      bladesInCurrentChassis: [],
      currentChassis: null,
    }
  }

  componentDidMount() {

  }

  loadBladesInCurrentChassis = () => {
    let dst = '/api/assets/'.concat(this.state.currentChassisID).concat('/blades/');
    axios.get(dst).then(res => {
      this.setState({
        bladesInCurrentChassis: res.data
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load blades. Re-login.\n' + JSON.stringify(error.response, null, 2));
      });
  }

  loadChassisInfo = () => {
    let dst = '/api/assets/'.concat(this.state.currentChassisID).concat('/');
    axios.get(dst).then(res => {
      this.setState({
        currentChassis: res.data
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load blades. Re-login.\n' + JSON.stringify(error.response, null, 2));
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentChassisID !== this.state.currentChassisID) {
      this.loadBladesInCurrentChassis();
      this.loadChassisInfo();
    }

    if (prevProps.blade !== this.props.blade) {
      this.setState({
        currentChassisID: this.props.blade.location.id,
        currentBladeID: this.props.blade.id,
      })
    }
  }

  renderTableHeader() {
    let headCells = [
      { id: 'model', label: 'Vendor' },
      { id: 'model_number', label: 'Model Number' },
      { id: 'hostname', label: 'Hostname' },
      { id: 'slot_number', label: 'Slot Number' },
      { id: 'owner', label: 'Owner' },
      { id: 'asset_number', label: 'Asset Number' },
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

  renderTableData() {
    if (this.state.bladesInCurrentChassis.length == 0) return (
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={6}>No entries</TableCell>
      </TableRow>
    )

    return this.state.bladesInCurrentChassis.map((blade) => {
      const { id, model, hostname, slot_number, owner, asset_number } = blade //destructuring
      if (id === this.state.currentBladeID) {
        return (
          <TableRow
            hover
            tabIndex={-1}
            key={id}
            style={{ backgroundColor: "#7bed98" }}
          >
            <TableCell align="center">{model ? model.vendor : null}</TableCell>
            <TableCell align="center">{model ? model.model_number : null}</TableCell>
            <TableCell align="center">{hostname}</TableCell>
            <TableCell align="center">{slot_number}</TableCell>
            <TableCell align="center">{owner ? owner.username : null}</TableCell>
            <TableCell align="center">{asset_number}</TableCell>
          </TableRow>
        )
      }
      else {
        return (
          <TableRow
            hover
            tabIndex={-1}
            key={id}
          >
            <TableCell align="center">{model ? model.vendor : null}</TableCell>
            <TableCell align="center">{model ? model.model_number : null}</TableCell>
            <TableCell align="center">{hostname}</TableCell>
            <TableCell align="center">{slot_number}</TableCell>
            <TableCell align="center">{owner ? owner.username : null}</TableCell>
            <TableCell align="center">{asset_number}</TableCell>
          </TableRow>
        )
      }
    })
  }
  render() {
    //console.log(this.props)
    console.log(this.state)
    return (
      <div>
        <Container maxwidth="xl">
          <Grid container className="themed-container" spacing={2}>
            <Grid item justify="flex-start" alignContent='center' xs={12} />
            <Grid item justify="flex-start" alignContent='center' xs={10}>
              <Typography variant="h3">
                Detailed Asset View: Blade
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <TableContainer>
                  <Table
                    aria-labelledby="modelTableTitle"
                    aria-label="enhanced table"
                  >
                    <TableRow>{this.renderTableHeader()}</TableRow>

                    <TableBody>
                      {this.renderTableData()}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item alignContent='center' xs={12} />
            <Grid item alignContent='center' xs={12} />
            <Grid item xs={12}>
              <Typography variant="h4">
                Chassis
              </Typography>
              <Paper>
                <ChassisCard asset={[this.state.currentChassis]} />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              {
                this.state.currentChassis && this.state.currentChassis.model && this.state.currentChassis.model.vendor === 'BMI' ? (
                  <div>
                    <Typography variant="h4">Blade Power Management</Typography>
                    <BladePowerManagement assetID={this.state.currentBladeID} />
                  </div>

                ) : (
                  <div></div>
                )
              }

            </Grid>

          </Grid>
        </Container>
      </div>
    )
  }
}

export default DetailedBladeView
