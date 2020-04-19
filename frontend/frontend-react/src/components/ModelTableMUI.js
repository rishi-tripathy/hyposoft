import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import ModelFilters from './ModelFilters';
import '../stylesheets/TableView.css'
import axios, {post} from 'axios'
import {Link} from 'react-router-dom'
import DatacenterContext from './DatacenterContext'


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelTable extends Component {

  constructor() {
    super();

    this.state = {
      filtersOpen: false,
      dense: false,
      sortBy: 'vendor',
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
      sortingStates: ['asc', 'desc']
    }
  }



  showDeleteForm = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      let dst = '/api/models/'.concat(id).concat('/');
      axios.delete(dst)
        .then(function (response) {
          alert('Delete was successful');
        })
        .catch(function (error) {
          alert('Delete was not successful.\n' + JSON.stringify(error.response.data, null, 2));
        });
    }
    this.showRerender();
  }

  handleOpenFilters = () => {
    this.setState(prevState => ({
      filtersOpen: !prevState.filtersOpen
    }));
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

  showRerender = () => {
    this.props.sendRerender(true);
  }

  renderTableToolbar = () => {
    return (
      <Toolbar>
        {
          <Typography style={{flex: '1 1 20%'}} variant="h6" id="modelTableTitle">
            Models
          </Typography>
        }
        <Collapse in={this.state.filtersOpen}>
          <Paper>
            {
              <ModelFilters sendFilterQuery={this.props.filter_query}/>
            }
          </Paper>
        </Collapse>
        <Tooltip title="Filter list">
          <Button endIcon={<FilterListIcon/>} onClick={() => this.handleOpenFilters()} aria-label="filter instance list">
            
          </Button>
        </Tooltip>


      </Toolbar>
    );
  };

  renderTableHeader() {
    let headCells = [
      {id: 'mount_type', label: 'Mount Type'},
      {id: 'vendor', label: 'Vendor'},
      {id: 'model_number', label: 'Model Number'},
      {id: 'height', label: 'Height (U)'},
      {id: 'display_color', label: 'Display Color'},
      {id: 'network_ports_num', label: 'Network Ports'},
      {id: 'power_ports', label: 'Power Ports'},
      {id: 'cpu', label: 'CPU'},
      {id: 'memory', label: 'Memory (GB)'},
      {id: 'storage', label: 'Storage'},
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
    if (this.props.models.length == 0) return (
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={12}>No entries</TableCell>
      </TableRow>
    )
    return this.props.models.map((model, index) => {
      const {id, vendor, model_number, height, display_color} = model //destructuring
      const {network_ports, network_ports_num, power_ports, cpu, memory, storage, mount_type} = model //more destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{mount_type}</TableCell>
          <TableCell align="center">{vendor}</TableCell>
          <TableCell align="center">{model_number}</TableCell>
          <TableCell align="center">{mount_type === 'blade' ? 'N/A' : height}</TableCell>
          <TableCell align="right">
            <div style={{
              width: 12,
              height: 12,
              backgroundColor: '#' + display_color,
              left: 2,
              top: 2,
            }}></div>
            {display_color}</TableCell>
          <TableCell align="center">{ network_ports_num ? network_ports_num : null}</TableCell>
          <TableCell align="center">{power_ports}</TableCell>
          <TableCell align="center">{cpu}</TableCell>
          <TableCell align="center">{memory}</TableCell>
          <TableCell align="center">{storage}</TableCell>
          <div>
            <TableCell align="right">
              <Link to={'/models/' + id}>
                <Tooltip title='View Details'>
                  <IconButton size="sm">
                    <PageviewIcon/>
                  </IconButton>
                </Tooltip>
              </Link>
            </TableCell>
            {(this.context.is_admin || this.context.username === 'admin' || this.context.model_permission) ? (
              <TableCell align="right">
                <Link to={'/models/' + id + '/edit'}>
                  <Tooltip title='Edit'>
                    <IconButton size="sm">
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>
                </Link>
              </TableCell>) : <div></div>
            }
            {(this.context.is_admin || this.context.username === 'admin' || this.context.model_permission) ? (
              < TableCell align="right">
                < Tooltip title='Delete'>
                  <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                    <DeleteIcon/>
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


  render() {
    return (
      <div>
        <Paper>
          {this.renderTableToolbar()}
          <TableContainer>
            <Table
              size="small"
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
      </div>
    );
  }
}


ModelTable.propTypes = {
  models: PropTypes.array.isRequired
}

ModelTable.contextType = DatacenterContext;

export default ModelTable;
