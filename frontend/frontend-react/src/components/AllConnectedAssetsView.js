import React, { Component } from 'react'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'


export class AllConnectedAssetsView extends Component {


  renderTableHeader() {
    let headCells = [
      { id: 'my_name', label: 'Local Network Port' },
      { id: 'hostname', label: 'Remote Hostname' },
      { id: 'name', label: 'Remote Network Port' },
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
    if (this.props.connectedAssets.length == 0) return (
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={6}>No entries</TableCell>
      </TableRow>
    )

    return this.props.connectedAssets.map((asset) => {
      const { id, hostname, name, my_name } = asset //destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{my_name}</TableCell>
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="center">{name}</TableCell>

          <TableCell align="right">
            <Link to={'/assets/' + id}>
              <Tooltip title='View Details'>
                <IconButton size="sm">
                  <PageviewIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </TableCell>
        </TableRow>
      )
    })
  }


  render() {
    console.log(this.props.connectedAssets)
    return (
      <div>
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
      </div>
    )
  }
}

export default AllConnectedAssetsView
