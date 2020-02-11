import React, { Component } from 'react'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip
} from "@material-ui/core";

export class ModelCard extends Component {

  renderTableHeader() {
    let headCells = [
      { id: 'vendor', numeric: false, disablePadding: false, label: 'Vendor' },
      { id: 'model-number', numeric: false, disablePadding: false, label: 'Model Number' },
      { id: 'height', numeric: true, disablePadding: false, label: 'Height (U)' },
      { id: 'display-color', numeric: true, disablePadding: false, label: 'Display Color' },
      { id: 'ethernet-ports', numeric: true, disablePadding: false, label: 'Ethernet Ports' },
      { id: 'power-ports', numeric: true, disablePadding: false, label: 'Power Ports' },
      { id: 'cpu', numeric: false, disablePadding: false, label: 'CPU' },
      { id: 'memory', numeric: true, disablePadding: false, label: 'Memory (GB)' },
      { id: 'storage', numeric: false, disablePadding: false, label: 'Storage' },
      { id: 'comment', numeric: false, disablePadding: false, label: 'Comment' },
    ];
    return headCells.map(headCell => (
      <TableCell
        key={headCell.id}
        align={headCell.numeric ? 'right' : 'left'}
        padding={headCell.disablePadding ? 'none' : 'default'}
      // sortDirection={orderBy === headCell.id ? order : false}
      >
        {headCell.label.toUpperCase()}
      </TableCell>
    ))
  }

  renderTableData() {
    return this.props.model.map((model, index) => {
      const { id, vendor, model_number, height, display_color } = model //destructuring
      const { ethernet_ports, power_ports, cpu, memory, storage, comment } = model //more destructuring
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
          <TableCell align="center">{comment}</TableCell>
        </TableRow>
      )
    })
  }

  render() {
    return (
      <div>
        <div>
          <Table hover striped>
            <tbody>
              <tr>{this.renderTableHeader()}</tr>
              {this.renderTableData()}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default ModelCard
