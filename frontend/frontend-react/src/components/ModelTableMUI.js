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
    this.showEditForm = this.showEditForm.bind(this);
    this.showEditForm = this.showEditForm.bind(this);
  }


  showDetailedModel = (id) => {
    //this.props.sendShowTable(false);
    this.props.sendShowDetailedModel(true);
    this.props.sendModelID(id);
  }

  showEditForm = (id) => {
    this.props.sendShowEdit(true);
    this.props.sendEditID(id);
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

  showRerender = () => {
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


  renderTableToolbar = () => {
    return (
      <Toolbar>
        {
          <Typography style={{flex: '1 1 100%'}} variant="h6" id="modelTableTitle">
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
          <IconButton onClick={() => this.handleOpenFilters()} aria-label="filter list">
            <FilterListIcon/>
          </IconButton>
        </Tooltip>


      </Toolbar>
    );
  };

  renderTableHeader() {
    let headCells = [
      {id: 'vendor', label: 'Vendor'},
      {id: 'model_number', label: 'Model Number'},
      {id: 'height', label: 'Height (U)'},
      {id: 'display_color', label: 'Display Color'},
      {id: 'ethernet_ports', label: 'Ethernet Ports'},
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

    let header = ['vendor', 'model number', 'height',
      'display color', 'ethernet ports', 'power ports', 'cpu', 'memory', 'storage'];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.models.map((model, index) => {
      const {id, vendor, model_number, height, display_color} = model //destructuring
      const {ethernet_ports, power_ports, cpu, memory, storage, comment} = model //more destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{vendor}</TableCell>
          <TableCell align="center">{model_number}</TableCell>
          <TableCell align="right">{height}</TableCell>
          <TableCell align="right">
            <div style={{
              width: 12,
              height: 12,
              backgroundColor: '#' + display_color,
              left: 5,
              top: 5,
            }}></div>
            {display_color}</TableCell>
          <TableCell align="right">{ethernet_ports}</TableCell>
          <TableCell align="right">{power_ports}</TableCell>
          <TableCell align="center">{cpu}</TableCell>
          <TableCell align="right">{memory}</TableCell>
          <TableCell align="center">{storage}</TableCell>
          {this.props.is_admin ? (
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

                <TableCell align="right">
                  <Tooltip title='Edit'>
                    <IconButton size="sm" onClick={() => this.showEditForm(id)}>
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title='Delete'>
                    <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                      <DeleteIcon/>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </div>
            ) :
            (<p></p>)}
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

export default ModelTable;
