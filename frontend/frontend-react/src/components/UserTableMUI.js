import React, { Component } from 'react'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";

export class UserTableMUI extends Component {

  renderTableHeader() {
    let headCells = [
      { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
      { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
      { id: 'firstname', numeric: false, disablePadding: false, label: 'First Name' },
      { id: 'lastnam', numeric: false, disablePadding: false, label: 'Last Name' },
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
    if (this.props.users.length == 0) return (
      <TableRow hover tabIndex={-1} >
        <TableCell align="center" colSpan={3} >No entries</TableCell>
      </TableRow>
    )
    return this.props.users.map((user) => {
      const { id, url, username, email, first_name, last_name } = user //destructuring
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
        </TableRow>
      )
    })
  }


  render() {
    return (
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
    )
  }
}

export default UserTableMUI
