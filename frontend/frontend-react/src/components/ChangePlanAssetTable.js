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

export class ChangePlanAssetTable extends Component {

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
      let dst = '/api/cp/'.concat(id).concat('/');
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
            Assets Modified by this Change Plan
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
      {id: 'newOrNa', label: 'New or Existing Asset?'},
      {id: 'hostname', label: 'Hostname'},
      {id: 'description', label: 'Description'},
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
    console.log(this.props.assets)
    if (this.props.assets.length == 0) return (
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={12}>No entries</TableCell>
      </TableRow>
    )
    return this.props.assets.map((asset, index) => {
      const {id, hostname, id_ref, description} = asset //destructuring
      var exists = "Yes";
      if(id_ref === null){
        exists = "No";
      }
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{exists}</TableCell>
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="center">{description}</TableCell>
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


ChangePlanAssetTable.contextType = DatacenterContext;

export default ChangePlanAssetTable;
