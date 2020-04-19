import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar, Grid,
  Typography, Paper, IconButton, Tooltip, TableSortLabel, Checkbox
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import InstanceFilters from './InstanceFilters';
import '../stylesheets/TableView.css'
import axios, { post } from 'axios'
import { Link, Redirect } from 'react-router-dom'
import DatacenterContext from './DatacenterContext';
import CircularProgress from '@material-ui/core/CircularProgress';


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class InstanceTableMUI extends Component {

  constructor() {
    super();

    this.state = {
      filtersOpen: false,
      dense: false,
      sortBy: 'model',
      sortType: 'asc',
      // sorting: {
      //   'vendor': 'none',
      //   'model_number': 'none',
      //   'height': 'none',
      //   'display_color': 'none',
      //   'ethernet_ports': 'none',
      //   'power_ports': 'none',
      //   'cpu': 'none',
      //   'memory': 'none',
      //   'storage': 'none'
      // },
      sortingStates: ['asc', 'desc'],

      // for checkboxes
      selected: [], // list of IDs
      allAssetIDs: [],
      assetIDsOnPage: [],

      //for AssetLabels.js, the labels table
      assetLabelTableGenerationData: [],
      redirectToAssetTagPage: false,
      is_offline: false,

      //spinner for decom
      loadingDecommission: false,
    }
  }

  loadAssetIDsOnPage = () => {
    //make list of asset ids that are on the page
    //let idsOnPage = Object.assign([], this.state.assetIDsOnPage)
    let idsOnPage = []
    for (let i = 0; i < this.props.assets.length; i++) {
      idsOnPage.push(this.props.assets[i].id)
    }
    this.setState({
      assetIDsOnPage: idsOnPage
    })
  }

  componentDidMount() {
    this.loadAssetIDsOnPage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.assetLabelTableGenerationData !== this.state.assetLabelTableGenerationData) {
      console.log('going to asset tags page')
      this.setState({ redirectToAssetTagPage: true })
    }

    if (prevProps.assets !== this.props.assets) {
      this.loadAssetIDsOnPage();
    }
  }

  showDecommissionedForm = (id, isBlade) => {
    if (window.confirm('Are you sure you want to decommission?')) {
      this.setState({
        loadingDecommission: true
      })

      if (isBlade) {
        console.log('decommissioning blade')
        let dst = '/api/blades/'.concat(id).concat('/?decommissioned=true');
        let self = this
        axios.delete(dst)
          .then(function (response) {
            alert('Decommission was successful');
            self.setState({
              loadingDecommission: false
            })
          })
          .catch(function (error) {
            alert('Decommission was not successful.\n' + JSON.stringify(error.response.data, null, 2));
            self.setState({
              loadingDecommission: false
            })
          });
      }
      else {
        console.log('decommissioning nonblade')
        let dst = '/api/assets/'.concat(id).concat('/?decommissioned=true');
        let self = this
        axios.delete(dst)
          .then(function (response) {
            alert('Decommission was successful');
            self.setState({
              loadingDecommission: false
            })
          })
          .catch(function (error) {
            alert('Decommission was not successful.\n' + JSON.stringify(error.response.data, null, 2));
            self.setState({
              loadingDecommission: false
            })
          });
      }
    }
    this.showRerender();
  }

  showDeleteForm = (id, isBlade) => {
    if (isBlade) {
      console.log('deleting blade')
      if (window.confirm('Are you sure you want to delete?')) {
        let dst = '/api/blades/'.concat(id).concat('/');
        axios.delete(dst)
          .then(function (response) {
            alert('Delete was successful');
          })
          .catch(function (error) {
            alert('Delete was not successful.\n' + JSON.stringify(error.response.data, null, 2));
          });
      }
    }
    else {
      console.log('deleting nonblade')
      if (window.confirm('Are you sure you want to delete?')) {
        let dst = '/api/assets/'.concat(id).concat('/');
        axios.delete(dst)
          .then(function (response) {
            alert('Delete was successful');
          })
          .catch(function (error) {
            alert('Delete was not successful.\n' + JSON.stringify(error.response.data, null, 2));
          });
      }
    }
    this.showRerender();
  }

  handleOpenFilters = () => {
    this.setState(prevState => ({
      filtersOpen: !prevState.filtersOpen
    }));
  }

  showRerender = () => {
    this.loadAssetIDsOnPage();
    this.props.sendRerender(true);
  }

  handleHeaderClickSort = (id) => {
    let sortByCopy = id
    this.setState({
      sortBy: sortByCopy
    })
    let sortTypeCopy = this.state.sortingStates[(this.state.sortingStates.indexOf(this.state.sortType) + 1) % 2];
    this.setState({
      sortType: sortTypeCopy
    })

    // Make Query
    let modifier = (sortTypeCopy === 'desc') ? '-' : ''
    let q = 'ordering=' + modifier + sortByCopy;
    // for (let i = 0; i < arr.length; i++) {
    //   q = q + arr[i].value + ',';
    // }
    // // take off the last &
    // q = q.slice(0, -1);
    this.props.sendSortQuery(q);
  };

  handleMakeAssetTags = () => {
    let arrayToSend = Object.assign([], this.state.selected)
    console.log(arrayToSend)

    // this.setState({
    //   assetLabelTableGenerationData: [
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     }
    //   ]
    // })

    var self = this
    let dst = '/api/assets/generate_barcodes/';
    axios.post(dst, arrayToSend).then(res => {
      console.log(res.data)

      self.setState({
        assetLabelTableGenerationData: res.data
      })

    })
      .catch(function (error) {
        alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
      });
  }

  renderTableToolbar = () => {
    return (
      <Toolbar>
        {
          this.state.selected.length === 0 ? (
            <Typography variant="h6" id="instanceTableTitle">
              Assets
            </Typography>
          ) : (
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Typography variant="subtitle1" >
                      {this.state.selected.length}
                    </Typography>
                  </Grid>

                  <Grid item xs={8}>
                    <Typography variant="subtitle1" >
                      selected
                  </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Tooltip title='Make Asset Tags'>
                      <IconButton size="sm" onClick={() => this.handleMakeAssetTags()}>
                        <LocalOfferIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </div>
            )
        }
        <Collapse in={this.state.filtersOpen}>
          <Paper>
            {
              <InstanceFilters sendFilterQuery={this.props.filter_query} />
            }
          </Paper>
        </Collapse>
        <Tooltip title="Filter list">
          <Button endIcon={<FilterListIcon />} onClick={() => this.handleOpenFilters()} aria-label="filter instance list">

          </Button>
        </Tooltip>
      </Toolbar>
    );
  };

  renderTableHeader() {
    //These now come from sorting fields
    let headCells = [
      { id: 'rack_number', label: 'Rack' },
      { id: 'rack_u', label: 'Rack U' },
      { id: 'location', label: 'Location' },
      { id: 'slot_number', label: 'Slot No.' },
      { id: 'vendor', label: 'Vendor' },
      { id: 'model_number', label: 'Model Number' },
      { id: 'override', label: 'Model Upgraded?' },
      { id: 'hostname', label: 'Hostname' },
      { id: 'datacenter', label: 'DC/Offline Site' },
      { id: 'owner', label: 'Owner' },
      // { id: 'np', label: 'Network Ports' },
      // { id: 'pp', label: 'Power Ports' },
      { id: 'asset_number', label: 'Asset no.' },
      { id: 'actions', label: 'Actions' },

    ];

    if(this.context.is_offline){
      headCells = [
        { id: 'location', label: 'Location' },
      { id: 'slot_number', label: 'Slot No.' },
        { id: 'model__vendor', label: 'Vendor' },
        { id: 'model_number', label: 'Model Number' },
      { id: 'override', label: 'Model Upgraded?' },
        { id: 'hostname', label: 'Hostname' },
        { id: 'datacenter', label: 'Offline Storage Site' },
        { id: 'owner', label: 'Owner' },
        // { id: 'np', label: 'Network Ports' },
        // { id: 'pp', label: 'Power Ports' },
        { id: 'asset_number', label: 'Asset no.' },
      ];
    }

    return headCells.map(headCell => (
      headCell.id === 'actions' ?
        <TableCell
          key={headCell.id}
          align={'center'}
          padding={'default'}
          rowSpan={4}
        >
          <TableSortLabel
            active={this.state.sortBy === headCell.id}
            hideSortIcon={!(this.state.sortBy === headCell.id)}
            direction={this.state.sortBy === headCell.id ? this.state.sortType : false}
          // onClick={() => this.handleHeaderClickSort(headCell.id)}
          >
            {headCell.label.toUpperCase()}
          </TableSortLabel>
        </TableCell>
        :
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
    else if(this.context.is_offline){
      return this.props.assets.map((asset) => {
        //console.log(asset)
      let id, model, hostname, rack, owner, rack_u, datacenter, asset_number, location, slot_number,  ovr_memory, ovr_cpu, ovr_color, ovr_storage

      console.log(asset)
        if (asset.bladeserver) {
          ({ id, model, hostname, rack, owner, location, slot_number, datacenter, asset_number,  ovr_memory, ovr_cpu, ovr_color, ovr_storage } = asset.bladeserver)
        }
        else {
          ({ id, model, hostname, rack, owner, rack_u, datacenter, asset_number,  ovr_memory, ovr_cpu, ovr_color, ovr_storage } = asset.asset)
        }
  
  
        return (
          <TableRow
            hover
            tabIndex={-1}
            key={id}
          >
            <TableCell padding="checkbox">
              <Checkbox
                checked={this.state.selected.includes(id)}
                onChange={(e) => this.onSelectCheckboxClick(id, e)}
                inputProps={{ 'aria-labelledby': id }}
              />
            </TableCell>
            <TableCell align="center">{location ? location.hostname : null}</TableCell>
          <TableCell align="center">{slot_number}</TableCell>
            <TableCell align="center">{model ? model.vendor : null}</TableCell>
            <TableCell align="center">{model ? model.model_number : null}</TableCell>
            <TableCell align="center">{(ovr_memory || ovr_cpu || ovr_color || ovr_storage) ? <CheckIcon /> : null}</TableCell>
            <TableCell align="center">{hostname}</TableCell>
            <TableCell align="center">{datacenter ? datacenter.abbreviation : null}</TableCell>
            <TableCell align="center">{owner ? owner.username : null}</TableCell>
            {/* <TableCell align="center">{network_ports ? network_ports.length : null}</TableCell>
            <TableCell align="center">{power_ports ? power_ports.length : null}</TableCell> */}
            <TableCell align="center">{asset_number}</TableCell>
            <div>
            {/* <TableCell align="right">
                <Link to={'/assets/' + id+ '/offline'}>
                <Tooltip title='View Details'>
                  <IconButton size="sm">
                    <PageviewIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              </TableCell> */}
            <TableCell align="right" >
              <Link to={{
                pathname: '/assets/' + id+ '/offline',
                state: {
                  isBlade: model.mount_type === 'blade'
                }
              }}>
                <Tooltip title='View Details'>
                  <IconButton size="sm">
                    <PageviewIcon />
                  </IconButton>
                </Tooltip>
              </Link>

            </TableCell>

            {
              (
                this.context.is_admin
                || this.context.username === 'admin'
                || this.context.asset_permission.includes(datacenter.id)
              ) ? (
                  <TableCell align="right">
                    <Link to={{
                      pathname: '/assets/' + id + '/edit',
                      state: {
                        isBlade: model.mount_type === 'blade'
                      }
                    }}>
                      <Tooltip title='Edit'>
                        <IconButton size="sm">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Link>

                  </TableCell>) : <div></div>
            }
            {
              (
                this.context.is_admin
                || this.context.username === 'admin'
                || this.context.asset_permission.includes(datacenter.id)
              ) ? (
                  < TableCell align="right">
                    < Tooltip title='Decommission'>
                      <IconButton size="sm" onClick={() => this.showDecommissionedForm(id, model.mount_type === 'blade')}>
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>

                  </TableCell>
                ) : <div></div>
            }
            {
              (
                this.context.is_admin
                || this.context.username === 'admin'
                || this.context.asset_permission.includes(datacenter.id)
              ) ? (
                  < TableCell align="right">
                    < Tooltip title='Delete'>
                      <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                  </TableCell>
                ) : <div></div>
            }

          </div>
          </TableRow>
        )
      })
    }
    else {
  
      return this.props.assets.map((asset) => {
      //console.log(asset)

      let id, model, hostname, rack, owner, rack_u, datacenter, asset_number, location, slot_number,  ovr_memory, ovr_cpu, ovr_color, ovr_storage


      if (asset.bladeserver) {
        ({ id, model, hostname, rack, owner, location, slot_number, datacenter, asset_number,  ovr_memory, ovr_cpu, ovr_color, ovr_storage } = asset.bladeserver)
      }
      else {
        ({ id, model, hostname, rack, owner, rack_u, datacenter, asset_number,  ovr_memory, ovr_cpu, ovr_color, ovr_storage } = asset.asset)
      }


      // const { id, model, hostname, rack, owner, rack_u, datacenter, asset_number } = asset //destructuring

      
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={this.state.selected.includes(id)}
              onChange={(e) => this.onSelectCheckboxClick(id, e)}
              inputProps={{ 'aria-labelledby': id }}
              size={'small'}
            />
          </TableCell>
          <TableCell align="center">{rack ? rack.rack_number : null}</TableCell>
          <TableCell align="center">{rack_u}</TableCell>
          <TableCell align="center">{location ? location.hostname : null}</TableCell>
          <TableCell align="center">{slot_number}</TableCell>
          <TableCell align="center">{model ? model.vendor : null}</TableCell>
          <TableCell align="center">{model ? model.model_number : null}</TableCell>
          <TableCell align="center">{(ovr_memory || ovr_cpu || ovr_color || ovr_storage) ? <CheckIcon /> : null}</TableCell>
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="center">{datacenter ? datacenter.abbreviation : null}</TableCell>
          <TableCell align="center">{owner ? owner.username : null}</TableCell>
          {/* <TableCell align="center">{network_ports ? network_ports.length : null}</TableCell>
          <TableCell align="center">{power_ports ? power_ports.length : null}</TableCell> */}
          <TableCell align="center">{asset_number}</TableCell>
          <div>
            <TableCell align="right" >
              <Link to={{
                pathname: '/assets/' + id,
                state: {
                  isBlade: model.mount_type === 'blade'
                }
              }}>
                <Tooltip title='View Details'>
                  <IconButton size="sm">
                    <PageviewIcon />
                  </IconButton>
                </Tooltip>
              </Link>

            </TableCell>

            {
              (
                this.context.is_admin
                || this.context.username === 'admin'
                || this.context.global_asset_permission
                || (asset.bladeserver ? (this.context.asset_permission.includes(location.datacenter.id)) : (this.context.asset_permission.includes(datacenter.id)))
              ) ? (
                  <TableCell align="right">
                    <Link to={{
                      pathname: '/assets/' + id + '/edit',
                      state: {
                        isBlade: model.mount_type === 'blade'
                      }
                    }}>
                      <Tooltip title='Edit'>
                        <IconButton size="sm">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Link>

                  </TableCell>) : <div></div>
            }
            {
              (
                this.context.is_admin
                || this.context.username === 'admin'
                || this.context.global_asset_permission
                || (asset.bladeserver ? (this.context.asset_permission.includes(location.datacenter.id)) : (this.context.asset_permission.includes(datacenter.id)))
              ) ? (
                  < TableCell align="right">
                    < Tooltip title='Decommission'>
                      <IconButton size="sm" onClick={() => this.showDecommissionedForm(id, model.mount_type === 'blade')}>
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>

                  </TableCell>
                ) : <div></div>
            }
            {
              (
                this.context.is_admin
                || this.context.username === 'admin'
                || this.context.global_asset_permission
                || (asset.bladeserver ? (this.context.asset_permission.includes(location.datacenter.id)) : (this.context.asset_permission.includes(datacenter.id)))
              ) ? (
                  < TableCell align="right">
                    < Tooltip title='Delete'>
                      <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                  </TableCell>
                ) : <div></div>
            }

          </div>
        </TableRow>
      )
      })
    }
  }

  onSelectAllCheckboxClick = () => {
    let firstArrayIncludesAllElementsOfSecond = (arr, target) => target.every(v => arr.includes(v));
    console.log('select all')
    if (firstArrayIncludesAllElementsOfSecond(this.state.selected, this.state.assetIDsOnPage) && this.state.selected.length != 0) {
      this.setState({ selected: [] })
    }
    else {
      let newSelected = Object.assign([], this.state.assetIDsOnPage)
      let allSelectedWithDuplicates = newSelected.concat(this.state.selected)
      let allSelected = allSelectedWithDuplicates.filter((item, pos) => allSelectedWithDuplicates.indexOf(item) === pos)
      this.setState({ selected: allSelected })
    }
    console.log(this.state.selected)
  }

  onSelectCheckboxClick = (id) => {
    console.log(this.state.selected)
    console.log('clicked on ' + id)

    let selectedArrayCopy = Object.assign([], this.state.selected)
    const idx = selectedArrayCopy.indexOf(id)
    if (idx > -1) {
      selectedArrayCopy.splice(idx, 1) //remove one element at index
    }
    else {
      selectedArrayCopy.push(id)
    }

    this.setState({
      selected: selectedArrayCopy
    })
  }

  render() {
    console.log(this.props.assets)
    console.log(this.state.assetIDsOnPage)
    console.log(this.state.selected)
    let firstArrayIncludesAllElementsOfSecond = (arr, target) => target.every(v => arr.includes(v));
    console.log(this.state.assetLabelTableGenerationData)
    if (this.state.redirectToAssetTagPage) {
      return <Redirect to={{
        pathname: '/assetlabels',
        state: { labelTable: this.state.assetLabelTableGenerationData }
      }} />;
    }
    return (
      <div>
        {
          this.state.loadingDecommission ? (
            <div>
              <center>
                <CircularProgress size={100} />
              </center>
            </div>
          ) : (
              <div>
                <Paper>
                  {this.renderTableToolbar()}
                  <TableContainer>
                    <Table
                      size="small"
                      aria-labelledby="instanceTableTitle"
                      aria-label="instanceTable"
                      padding={'none'}
                    >
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            //indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={firstArrayIncludesAllElementsOfSecond(this.state.selected, this.state.assetIDsOnPage) && this.state.selected.length != 0}
                            onChange={this.onSelectAllCheckboxClick}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                            size={'small'}
                          />
                        </TableCell>
                        {this.renderTableHeader()}
                      </TableRow>

                      <TableBody>
                        {this.renderTableData()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            )
        }
      </div>
    );
  }
}

InstanceTableMUI.contextType = DatacenterContext;

export default InstanceTableMUI;
