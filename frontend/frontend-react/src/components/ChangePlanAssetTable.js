import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ModelFilters from './ModelFilters';
import '../stylesheets/TableView.css'
import axios, {post} from 'axios'
import {Link, Redirect} from 'react-router-dom'
import DatacenterContext from './DatacenterContext'


axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ChangePlanAssetTable extends Component {

  constructor() {
    super();

    this.state = {
      dense: false,
      sortBy: 'vendor',
      sortType: 'asc',
      sortingStates: ['asc', 'desc'],
      redirect: false,
    }
  }


  showDeleteForm = (id) => {
    if (window.confirm('Are you sure you want to delete the proposed changes to this action?')) {
      let dst = '/api/cpAsset/'.concat(id).concat('/');
      axios.delete(dst)
        .then(function (response) {
          alert('Delete was successful');
          this.setState({
            redirect: true,
          })
        })
        .catch(function (error) {
          alert('Delete was not successful.\n' + JSON.stringify(error.response.data, null, 2));
        });
    }
    this.showRerender();
  }

  renderTableToolbar = () => {
    return (
      <Toolbar>
        {
          <Typography style={{flex: '1 1 20%'}} variant="h6" id="modelTableTitle">
            Assets Modified
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
      const {id, hostname, id_ref, description, cp} = asset //destructuring

      console.log('cp:'+ cp)
      console.log('id:'+ id)

      var existBool = true;
      var exists = "Existing";
      if(id_ref === null){
        exists = "New";
        existBool = false;
      }
      console.log(existBool)
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{exists}</TableCell>
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="center">{description}</TableCell>
          <div>
            {existBool ? (
              <div>
              <TableCell align="right">
                <Link to={'/changeplans/' + cp + '/changeExistingAsset/' + id_ref + '/'+ id}>
                  <Tooltip title='Edit'>
                    <IconButton size="sm">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              </TableCell>
              < TableCell align="right">
                < Tooltip title='Delete'>
                  <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ TableCell>
            </div>
            )
            :
            (
              <div>
              <TableCell align="right">
                <Link to={'/changeplans/' + cp + '/assets/' + id + '/edit'}>
                  <Tooltip title='Edit'>
                    <IconButton size="sm">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              </TableCell>
              < TableCell align="right">
                < Tooltip title='Delete'>
                  <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ TableCell>
              </div>
            )}
          </div>
        </TableRow>
      )
    })
  }


  render() {
    return (
      <div>
        {this.state.redirect && <Redirect to={{ pathname: '/changeplans/'.concat(this.props.match.params.id) }} />}
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
