import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import ModelFilters from './ModelFilters';
import '../stylesheets/TableView.css'
import axios, {post} from 'axios'
import {Link} from 'react-router-dom'
import DatacenterContext from './DatacenterContext'


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ChangePlanTable extends Component {

  constructor() {
    super();

    this.state = {
      dense: false,
      sortBy: 'vendor',
      sortType: 'asc',
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

//   handleHeaderClickSort = (id) => {
//     let sortByCopy = id
//     this.setState({
//       sortBy: sortByCopy
//     })
//     let sortTypeCopy = this.state.sortingStates[(this.state.sortingStates.indexOf(this.state.sortType) + 1) % 2];
//     this.setState({
//       sortType: sortTypeCopy
//     })

//     // Make Query
//     let modifier = (sortTypeCopy === 'desc') ? '-' : ''
//     let q = 'ordering=' + modifier + sortByCopy;
//     // for (let i = 0; i < arr.length; i++) {
//     //   q = q + arr[i].value + ',';
//     // }
//     // // take off the last &
//     // q = q.slice(0, -1);
//     this.props.sendSortQuery(q);
//   };

  showRerender = () => {
    this.props.sendRerender(true);
  }

  renderTableToolbar = () => {
    return (
      <Toolbar>
        {
          <Typography style={{flex: '1 1 20%'}} variant="h6" id="modelTableTitle">
            Change Plans
          </Typography>
        }
        <Collapse in={this.state.filtersOpen}>
          <Paper>
            {
            //   <ModelFilters sendFilterQuery={this.props.filter_query}/>
            }
          </Paper>
        </Collapse>

      </Toolbar>
    );
  };

  renderTableHeader() {
    let headCells = [
      {id: 'name', label: 'CP Name'},
      {id: 'status', label: 'Status'},
      {id: 'actions', label: 'Actions', disablePadding: false,},
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
    console.log(this.props.changePlans)
    if (this.props.changePlans.length == 0) return (
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={12}>No entries</TableCell>
      </TableRow>
    )
    return this.props.changePlans.map((cp, index) => {
      const {id, name, status, actions} = cp //destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{name}</TableCell>
          <TableCell align="center">{status}</TableCell>
          <div>
            {this.context.is_admin ? (
              <TableCell align="center">
                <Link to={'/changeplans/1/'}>
                {/* UNCOMMENT BELOW POST FAKE DATA */}
                {/* <Link to={'/changeplans/' + id + '/'}> */}
                  <Tooltip title='View Details/Edit'>
                    <IconButton size="sm">
                      <SearchIcon/>
                    </IconButton>
                  </Tooltip>
                </Link>
              </TableCell>) : <p></p>
            }
            {this.context.is_admin ? (
              < TableCell align="center">
                < Tooltip title='Delete'>
                  <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
              </TableCell>
            ) : <p></p>
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


ChangePlanTable.contextType = DatacenterContext;

export default ChangePlanTable;
