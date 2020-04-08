import React, {Component} from 'react'
import {
  Collapse, Table, TableBody, Button, TableCell, TableContainer, TableRow, Toolbar,
  Typography, Paper, IconButton, Tooltip, TableSortLabel
} from "@material-ui/core";

export class ModelCard extends Component {

  renderTableHeader() {
    let headCells = [
      {id: 'mount_type', label: 'Mount Type'},
      {id: 'vendor', label: 'Vendor'},
      {id: 'model_number', label: 'Model Number'},
      {id: 'height', label: 'Height (U)'},
      {id: 'display_color', label: 'Display Color'},
      {id: 'network_ports', label: 'Network Ports'},
      {id: 'power_ports', label: 'Power Ports'},
      {id: 'cpu', label: 'CPU'},
      {id: 'memory', label: 'Memory (GB)'},
      {id: 'storage', label: 'Storage'},
      {id: 'comment', label: 'Comment'},
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
    return this.props.model.map((model) => {
      const {id, vendor, model_number, height, display_color} = model //destructuring
      const {network_ports, power_ports, cpu, memory, storage, comment, mount_type} = model //more destructuring
      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >
          <TableCell align="center">{mount_type}</TableCell>
          <TableCell align="center">{vendor}</TableCell>
          <TableCell align="center">{model_number}</TableCell>
          <TableCell align="center">{height}</TableCell>
          <TableCell align="right">
            <div style={{
              width: 12,
              height: 12,
              backgroundColor: '#' + display_color,
              left: 5,
              top: 5,
            }}></div>
            {display_color}</TableCell>
          <TableCell align="center">{ network_ports ? network_ports.toString() : null }</TableCell>
          <TableCell align="center">{power_ports}</TableCell>
          <TableCell align="center">{cpu}</TableCell>
          <TableCell align="center">{memory}</TableCell>
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
          <Table>
            <TableBody>
            <TableRow>{this.renderTableHeader()}</TableRow>
            {this.renderTableData()}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

export default ModelCard
