import React, { Component } from 'react'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom'
import DatacenterContext from './DatacenterContext';

export class UserTableMUI extends Component {

  constructor() {
    super();

    this.state = {
      redirect: false,
    };
  }


  showDeleteForm = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      let dst = '/api/users/'.concat(id).concat('/');
      console.log(dst)
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
  }


  renderTableHeader() {
    console.log(this.props.users)
    let headCells = [
      { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
      { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
      { id: 'firstname', numeric: false, disablePadding: false, label: 'First Name' },
      { id: 'lastname', numeric: false, disablePadding: false, label: 'Last Name' },
      { id: 'privilege', numeric: false, disablePadding: false, label: 'Admin Status' },
    ];
    return headCells.map(headCell => (
      <TableCell
        key={headCell.id}
        align={'center'}
        padding={'default'}
      // sortDirection={orderBy === headCell.id ? order : false}
      >
        {headCell.label.toUpperCase()}
      </TableCell>
    ))
  }

  renderTableData() {
    console.log(this.context.is_admin)
    if (this.props.users.length == 0) return (
      <TableRow hover tabIndex={-1} >
        <TableCell align="center" colSpan={3} >No entries</TableCell>
      </TableRow>
    )
    return this.props.users.map((user) => {
      const { id, url, username, email, first_name, last_name, is_admin } = user //destructuring

      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{username}</TableCell>
          <TableCell align="center">{email}</TableCell>
          <TableCell align="center">{first_name}</TableCell>
          <TableCell align="center">{last_name}</TableCell>
          <TableCell align="center">{is_admin}</TableCell>
          {this.context.is_admin ? (
              <TableCell align="right">
                <Link to={'/users/' + id + '/edit'}>
                  <Tooltip title='Edit'>
                    <IconButton size="sm">
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>
                </Link>
              </TableCell>) : <p></p>
            }
            {this.context.is_admin ? (
              < TableCell align="right">
                < Tooltip title='Delete'>
                  <IconButton size="sm" onClick={() => this.showDeleteForm(id)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
              </TableCell>
            ) : <p></p>
            }
        </TableRow>
      )
    })
  }


  render() {
    return (
      <TableContainer>
      {this.state.redirect && <Redirect to={{path: '/users'}} />}
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
    )
  }
}

UserTableMUI.contextType = DatacenterContext;

export default UserTableMUI
