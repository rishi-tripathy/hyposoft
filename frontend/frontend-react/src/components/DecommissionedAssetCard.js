import React, { Component } from 'react'
import { IconButton, Table, TableCell, 
  TableRow, TableBody, TableSortLabel, 
  Container, Grid, Typography,
  Tooltip } from "@material-ui/core";


export class DecommissionedAssetCard extends Component {

  renderTableHeader() {
    let headCells = [
      // { id: 'timestamp', label: 'Timestamp' },
      // { id: 'user', label: 'Decommissioned by' },
      { id: 'rack__rack_number', label: 'Rack' },
      { id: 'rack_u', label: 'Rack U' },
      { id: 'model__vendor', label: 'Vendor' },
      { id: 'model__model_number', label: 'Model Number' },
      { id: 'hostname', label: 'Hostname' },
      { id: 'datacenter', label: 'Datacenter' },
      { id: 'owner', label: 'Owner' },
      { id: 'np', label: 'Network Ports' },
      { id: 'pp', label: 'Power Ports' },
      { id: 'asset_number', label: 'Asset no.' },
      { id: 'comment', label: 'Comment' },

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
    return this.props.asset.map((asset) => {
      if (! asset) {
        return;
      }
      const { id, asset_state, timestamp, username  } = asset //destructuring

      return (
        <TableRow
          hover
          tabIndex={-1}
          key={id}
        >

          {/* <TableCell align="center">{timestamp}</TableCell>
          <TableCell align="center">{username}</TableCell> */}
          <TableCell align="center">{asset_state.rack.rack_number}</TableCell>
          <TableCell align="center">{asset_state.rack_u}</TableCell>
          <TableCell align="center">{asset_state.model.vendor}</TableCell>
          <TableCell align="center">{asset_state.model.model_number}</TableCell>
          <TableCell align="center">{asset_state.hostname ? asset_state.hostname : null}</TableCell>
          <TableCell align="center">{asset_state.datacenter.abbreviation}</TableCell>
          <TableCell align="center">{asset_state.owner ? asset_state.owner.username : null}</TableCell>
          <TableCell align="center">{asset_state.network_ports ? asset_state.network_ports.length : null}</TableCell>
          <TableCell align="center">{asset_state.power_ports ? asset_state.power_ports.length : null}</TableCell>
          <TableCell align="center">{asset_state.asset_number}</TableCell>
          <TableCell align="center">{asset_state.comment ? asset_state.comment : null}</TableCell>

        </TableRow>
      )
    })
  }

  render() {
    console.log(JSON.stringify(this.props.asset, null, 2))
    return (
      <div>
        <Table hover striped>
          <TableBody>
            <TableRow>{this.renderTableHeader()}</TableRow>
            {this.renderTableData()}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default DecommissionedAssetCard
