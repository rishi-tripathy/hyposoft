import React, { Component } from 'react'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'
import FilterListIcon from '@material-ui/icons/FilterList';
import DecommissionedAssetFilters from './DecommissionedAssetFilters'


export class DecommissionedTable extends Component {

  constructor() {
    super();
    this.state = {
      filtersOpen: false,
      dense: false,
      sortBy: 'model',
      sortType: 'asc',
      sortingStates: ['asc', 'desc']
    }
  }

  handleOpenFilters = () => {
    this.setState(prevState => ({
      filtersOpen: !prevState.filtersOpen
    }));
  }

  showRerender = () => {
    this.props.sendRerender(true);
  }

  handleHeaderClickSort = (id) => {
    // let sortByCopy = id
    // this.setState({
    //   sortBy: sortByCopy
    // })
    // let sortTypeCopy = this.state.sortingStates[(this.state.sortingStates.indexOf(this.state.sortType) + 1) % 2];
    // this.setState({
    //   sortType: sortTypeCopy
    // })

    // // Make Query
    // let modifier = (sortTypeCopy === 'desc') ? '-' : ''
    // let q = 'ordering=' + modifier + sortByCopy;
    // // for (let i = 0; i < arr.length; i++) {
    // //   q = q + arr[i].value + ',';
    // // }
    // // // take off the last &
    // // q = q.slice(0, -1);
    // this.props.sendSortQuery(q);
  }

  renderTableToolbar = () => {
    return (
      <Toolbar>
        {
          <Typography style={{ flex: '1 1 20%' }} variant="h6" id="instanceTableTitle">
            Decommissioned Assets
          </Typography>
        }
        <Collapse in={this.state.filtersOpen}>
          <Paper>
            {
              <DecommissionedAssetFilters sendFilterQuery={this.props.filter_query} />
            }
          </Paper>
        </Collapse>
        <Tooltip title="Filter list">
          <Button endIcon={<FilterListIcon />} onClick={() => this.handleOpenFilters()} aria-label="filter instance list">
            
          </Button>
        </Tooltip>


      </Toolbar>
    );
  }

  renderTableHeader() {
    //These now come from sorting fields
    let headCells = [
      { id: 'timestamp', label: 'Timestamp' },
      { id: 'user', label: 'Decommissioned by' },
      { id: 'rack__rack_number', label: 'Rack' },
      { id: 'rack_u', label: 'Rack U' },
      { id: 'location', label: 'Location' },
      { id: 'slot_number', label: 'Slot No.' },
      { id: 'model__vendor', label: 'Vendor' },
      { id: 'model__model_number', label: 'Model Number' },
      { id: 'hostname', label: 'Hostname' },
      { id: 'datacenter', label: 'Datacenter' },
      { id: 'owner', label: 'Owner' },
      // { id: 'np', label: 'Network Ports' },
      // { id: 'pp', label: 'Power Ports' },
      { id: 'asset_number', label: 'Asset no.' },
    ];
    return headCells.map(headCell => (
      <TableCell
        key={headCell.id}
        align={'center'}
        padding={'default'}

      >
        <TableSortLabel
          active={this.state.sortBy === headCell.id}
          hideSortIcon={!(this.state.sortBy === headCell.id)}
          direction={this.state.sortBy === headCell.id ? this.state.sortType : false}
          onClick={() => this.handleHeaderClickSort(headCell.id)}
        >
          {headCell.label.toUpperCase()}
        </TableSortLabel>
      </TableCell>
    ))
  }

  renderTableData() {
    if (this.props.assets.length == 0) return (
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={12}>No entries</TableCell>
      </TableRow>
    )
    return this.props.assets.map((asset) => {
      //console.log(asset)
      const { id, asset_state, username, timestamp } = asset //destructuring
      //console.log(network_ports)

      let readableTime = new Date(timestamp);

      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{readableTime.toDateString()}</TableCell>
          <TableCell align="center">{username}</TableCell>
          <TableCell align="center">{asset_state.rack ? asset_state.rack.rack_number : null}</TableCell>
          <TableCell align="center">{asset_state.rack_u ? asset_state.rack_u : null}</TableCell>
          <TableCell align="center">{asset_state.location ? asset_state.location.hostname : null}</TableCell>
          <TableCell align="center">{asset_state.slot_number ? asset_state.slot_number : null}</TableCell>
          <TableCell align="center">{asset_state.model.vendor}</TableCell>
          <TableCell align="center">{asset_state.model.model_number}</TableCell>
          <TableCell align="center">{asset_state.hostname ? asset_state.hostname : null}</TableCell>
          <TableCell align="center">{asset_state.datacenter.abbreviation}</TableCell>
          <TableCell align="center">{asset_state.owner ? asset_state.owner.username : null}</TableCell>
          {/* <TableCell align="center">{network_ports ? network_ports.length : null}</TableCell>
          <TableCell align="center">{power_ports ? power_ports.length : null}</TableCell> */}
          <TableCell align="center">{asset_state.asset_number}</TableCell>
          <div>
            <TableCell align="right">
              <Link to={'/decommissioned/' + id}>
                <Tooltip title='View Details'>
                  <IconButton size="sm">
                    <PageviewIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </TableCell>
          </div>
        </TableRow>
      )
    })
  }

  render() {
    console.log(JSON.stringify(this.props.assets, null, 2))

    return (
      <div>
        <Paper>
          {this.renderTableToolbar()}
          <TableContainer>
            <Table
              size="small"
              aria-labelledby="instanceTableTitle"
              aria-label="instanceTable"
            >
              <TableRow>{this.renderTableHeader()}</TableRow>

              <TableBody>
                {this.renderTableData()}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    )
  }
}

export default DecommissionedTable
