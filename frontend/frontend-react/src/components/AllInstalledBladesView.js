import React, { Component } from 'react'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import { Link } from 'react-router-dom'

export class AllInstalledBladesView extends Component {

  renderTableHeader() {
    let headCells = [
      { id: 'model', label: 'Vendor' },
      { id: 'model_number', label: 'Model Number' },
      { id: 'hostname', label: 'Hostname' },
      { id: 'slot_number', label: 'Slot Number' },
      { id: 'owner', label: 'Owner' },
      { id: 'asset_number', label: 'Asset Number' },
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
    if (this.props.blades.length == 0) return (
      <TableRow hover tabIndex={-1}>
        <TableCell align="center" colSpan={6}>No entries</TableCell>
      </TableRow>
    )

    return this.props.blades.map((blade) => {
      const { id, model, hostname, slot_number, owner, asset_number } = blade //destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{model ? model.vendor : null}</TableCell>
          <TableCell align="center">{model ? model.model_number : null}</TableCell>
          <TableCell align="center">{hostname}</TableCell>
          <TableCell align="center">{slot_number}</TableCell>
          <TableCell align="center">{owner}</TableCell>
          <TableCell align="center">{asset_number}</TableCell>

          <TableCell align="right">
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
        </TableRow>
      )
    })
  }

  render() {
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

export default AllInstalledBladesView
